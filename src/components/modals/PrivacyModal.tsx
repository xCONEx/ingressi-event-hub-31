
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PrivacyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PrivacyModal = ({ open, onOpenChange }: PrivacyModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Política de Privacidade</DialogTitle>
          <DialogDescription>
            Como coletamos, usamos e protegemos seus dados
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4 text-sm">
            <section>
              <h3 className="font-semibold text-lg mb-2">1. Informações que Coletamos</h3>
              <p className="text-gray-600">
                Coletamos informações que você nos fornece diretamente, como nome, email, telefone e CPF 
                quando você cria uma conta ou compra ingressos. Também coletamos dados de uso da plataforma 
                para melhorar nossos serviços.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">2. Como Usamos suas Informações</h3>
              <p className="text-gray-600">
                Usamos suas informações para:
              </p>
              <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                <li>Processar transações e fornecer serviços</li>
                <li>Comunicar sobre eventos e atualizações</li>
                <li>Melhorar nossa plataforma e experiência do usuário</li>
                <li>Cumprir obrigações legais e fiscais</li>
                <li>Prevenir fraudes e garantir segurança</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">3. Compartilhamento de Dados</h3>
              <p className="text-gray-600">
                Não vendemos suas informações pessoais. Podemos compartilhar dados apenas com:
              </p>
              <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                <li>Organizadores de eventos (quando você compra ingressos)</li>
                <li>Processadores de pagamento para transações</li>
                <li>Prestadores de serviços que nos ajudam a operar a plataforma</li>
                <li>Autoridades legais quando exigido por lei</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">4. Segurança dos Dados</h3>
              <p className="text-gray-600">
                Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações 
                contra acesso não autorizado, alteração, divulgação ou destruição. Usamos criptografia SSL 
                e armazenamento seguro em nuvem.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">5. Seus Direitos</h3>
              <p className="text-gray-600">
                Conforme a LGPD, você tem o direito de:
              </p>
              <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                <li>Acessar e corrigir seus dados pessoais</li>
                <li>Solicitar a exclusão de seus dados</li>
                <li>Revogar consentimento para tratamento de dados</li>
                <li>Solicitar portabilidade de dados</li>
                <li>Ser informado sobre o uso de seus dados</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">6. Cookies e Tecnologias Similares</h3>
              <p className="text-gray-600">
                Usamos cookies para melhorar sua experiência, personalizar conteúdo e analisar o tráfego. 
                Você pode controlar o uso de cookies através das configurações do seu navegador.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">7. Retenção de Dados</h3>
              <p className="text-gray-600">
                Mantemos suas informações pelo tempo necessário para fornecer nossos serviços e cumprir 
                obrigações legais. Dados de transações são mantidos conforme exigido pela legislação fiscal.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">8. Alterações nesta Política</h3>
              <p className="text-gray-600">
                Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças significativas 
                por email ou através de aviso na plataforma.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">9. Contato</h3>
              <p className="text-gray-600">
                Para exercer seus direitos ou esclarecer dúvidas sobre privacidade, entre em contato:
              </p>
              <ul className="list-none mt-2 text-gray-600 space-y-1">
                <li>Email: contato@ingrezzi.com.br</li>
                <li>WhatsApp: +55 (27) 99755-7004</li>
              </ul>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyModal;
