
-- Criar enum para tipos de planos
CREATE TYPE user_plan_type AS ENUM ('free', 'basic', 'premium');

-- Criar enum para status de autorização
CREATE TYPE authorization_status AS ENUM ('pending', 'approved', 'denied');

-- Atualizar tabela profiles para incluir planos
ALTER TABLE public.profiles ADD COLUMN plan_type user_plan_type DEFAULT 'free';
ALTER TABLE public.profiles ADD COLUMN plan_expires_at TIMESTAMP WITH TIME ZONE;

-- Criar tabela de autorizações para check-in
CREATE TABLE public.event_authorizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  authorized_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  authorized_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status authorization_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(event_id, authorized_user_id)
);

-- Criar tabela de taxas do sistema
CREATE TABLE public.system_fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_type user_plan_type NOT NULL,
  fee_percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(plan_type)
);

-- Inserir taxas padrão
INSERT INTO public.system_fees (plan_type, fee_percentage) VALUES
('free', 0.00),
('basic', 5.00),
('premium', 3.00);

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.event_authorizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_fees ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para event_authorizations
CREATE POLICY "Users can view authorizations for their events" ON public.event_authorizations 
FOR SELECT USING (
  authorized_user_id = (SELECT id FROM public.profiles WHERE email = current_setting('request.jwt.claims', true)::json->>'email')
  OR authorized_by = (SELECT id FROM public.profiles WHERE email = current_setting('request.jwt.claims', true)::json->>'email')
  OR event_id IN (SELECT id FROM public.events WHERE organizer_id = (SELECT id FROM public.profiles WHERE email = current_setting('request.jwt.claims', true)::json->>'email'))
);

CREATE POLICY "Event owners can manage authorizations" ON public.event_authorizations 
FOR ALL USING (
  event_id IN (SELECT id FROM public.events WHERE organizer_id = (SELECT id FROM public.profiles WHERE email = current_setting('request.jwt.claims', true)::json->>'email'))
);

-- Políticas RLS para system_fees (somente leitura pública)
CREATE POLICY "Anyone can view system fees" ON public.system_fees FOR SELECT USING (true);

-- Atualizar tabela events para incluir taxa aplicada
ALTER TABLE public.events ADD COLUMN system_fee_percentage DECIMAL(5,2) DEFAULT 0;

-- Trigger para aplicar taxa automaticamente ao criar evento
CREATE OR REPLACE FUNCTION apply_system_fee()
RETURNS TRIGGER AS $$
DECLARE
  organizer_plan user_plan_type;
  fee_percentage DECIMAL(5,2);
BEGIN
  -- Buscar plano do organizador
  SELECT plan_type INTO organizer_plan
  FROM public.profiles 
  WHERE id = NEW.organizer_id;
  
  -- Buscar taxa do plano
  SELECT sf.fee_percentage INTO fee_percentage
  FROM public.system_fees sf
  WHERE sf.plan_type = organizer_plan;
  
  -- Aplicar taxa apenas para eventos pagos
  IF NEW.ticket_type = 'paid' THEN
    NEW.system_fee_percentage := fee_percentage;
  ELSE
    NEW.system_fee_percentage := 0;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER apply_system_fee_trigger
  BEFORE INSERT OR UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION apply_system_fee();

-- Função para verificar se usuário pode criar eventos pagos
CREATE OR REPLACE FUNCTION can_create_paid_events(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_plan user_plan_type;
  plan_valid BOOLEAN := false;
BEGIN
  SELECT plan_type, (plan_expires_at IS NULL OR plan_expires_at > now()) 
  INTO user_plan, plan_valid
  FROM public.profiles 
  WHERE id = user_id;
  
  RETURN user_plan != 'free' AND plan_valid;
END;
$$ LANGUAGE plpgsql;

-- Trigger para validar criação de eventos pagos
CREATE OR REPLACE FUNCTION validate_paid_event_creation()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ticket_type = 'paid' AND NOT can_create_paid_events(NEW.organizer_id) THEN
    RAISE EXCEPTION 'Usuários com plano gratuito só podem criar eventos gratuitos. Faça upgrade do seu plano.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_paid_event_creation_trigger
  BEFORE INSERT OR UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION validate_paid_event_creation();
