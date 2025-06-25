
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TermsModal = ({ open, onOpenChange }: TermsModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Termos de Uso</DialogTitle>
          <DialogDescription>
            Leia atentamente nossos termos de uso
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4 text-sm">
            <section>
              <h3 className="font-semibold text-lg mb-2">1. Aceitação dos Termos</h3>
              <p className="text-gray-600">
                Ao acessar e usar a plataforma Ingrezzi, você concorda com estes Termos de Uso. 
                Se você não concordar com qualquer parte destes termos, não deve usar nossos serviços.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">2. Descrição do Serviço</h3>
              <p className="text-gray-600">
                A Ingrezzi é uma plataforma online que permite aos usuários criar, gerenciar e vender ingressos 
                para eventos. Oferecemos ferramentas para organização de eventos, vendas de ingressos e 
                controle de acesso.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">3. Cadastro e Conta</h3>
              <p className="text-gray-600">
                Para usar nossos serviços, você deve criar uma conta fornecendo informações precisas e atualizadas. 
                Você é responsável por manter a confidencialidade de sua conta e senha.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">4. Uso Aceitável</h3>
              <p className="text-gray-600">
                Você concorda em usar a plataforma apenas para fins legítimos e de acordo com todas as leis 
                aplicáveis. É proibido usar nossos serviços para atividades ilegais, fraudulentas ou prejudiciais.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">5. Pagamentos e Taxas</h3>
              <p className="text-gray-600">
                Os pagamentos são processados de forma segura. Aplicamos taxas conforme o plano escolhido. 
                Todos os valores são cobrados em reais (BRL) e incluem impostos aplicáveis.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">6. Propriedade Intelectual</h3>
              <p className="text-gray-600">
                Todo o conteúdo da plataforma Ingrezzi é protegido por direitos autorais e outras leis de 
                propriedade intelectual. Você não pode reproduzir, distribuir ou criar trabalhos derivados 
                sem permissão.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">7. Limitação de Responsabilidade</h3>
              <p className="text-gray-600">
                A Ingrezzi não se responsabiliza por danos indiretos, incidentais ou consequenciais 
                decorrentes do uso da plataforma. Nossa responsabilidade é limitada ao valor pago pelos serviços.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">8. Modificações</h3>
              <p className="text-gray-600">
                Reservamos o direito de modificar estes termos a qualquer momento. As alterações serão 
                comunicadas através da plataforma e entrarão em vigor imediatamente após a publicação.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">9. Contato</h3>
              <p className="text-gray-600">
                Para dúvidas sobre estes termos, entre em contato conosco através do email: 
                contato@ingrezzi.com.br ou WhatsApp: +55 (27) 99755-7004.
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TermsModal;
