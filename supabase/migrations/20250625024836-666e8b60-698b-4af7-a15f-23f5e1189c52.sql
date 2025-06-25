
-- Adicionar campo CPF na tabela profiles (já existe baseado no diff)
-- Vamos garantir que existe e criar as páginas de conteúdo

-- Criar tabela para páginas de conteúdo se não existir
INSERT INTO public.content_pages (slug, title, content) VALUES 
('termos-de-uso', 'Termos de Uso', 'Aqui estão nossos termos de uso...'),
('politica-privacidade', 'Política de Privacidade', 'Nossa política de privacidade...'),
('quanto-custa', 'Quanto Custa?', 'Confira nossos planos e preços...')
ON CONFLICT (slug) DO NOTHING;

-- Habilitar RLS para content_pages
ALTER TABLE public.content_pages ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública das páginas de conteúdo
CREATE POLICY "Páginas de conteúdo são públicas para leitura"
ON public.content_pages FOR SELECT
USING (true);

-- Atualizar função para contar eventos por categoria corretamente
CREATE OR REPLACE FUNCTION public.count_events_by_category()
RETURNS TABLE(category text, event_count bigint)
LANGUAGE sql
STABLE
AS $$
  SELECT 
    CASE 
      WHEN e.category IS NULL OR e.category = '' THEN 'Eventos Diversos'
      ELSE e.category
    END as category,
    COUNT(*) as event_count
  FROM public.events e
  WHERE e.status = 'published'
  GROUP BY 
    CASE 
      WHEN e.category IS NULL OR e.category = '' THEN 'Eventos Diversos'
      ELSE e.category
    END
  ORDER BY event_count DESC;
$$;
