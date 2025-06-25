
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, UserPlus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface EventAuthorizationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  eventTitle: string;
}

const EventAuthorizationModal = ({ open, onOpenChange, eventId, eventTitle }: EventAuthorizationModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [authorizations, setAuthorizations] = useState<any[]>([]);

  useEffect(() => {
    if (open && eventId) {
      loadAuthorizations();
    }
  }, [open, eventId]);

  const loadAuthorizations = async () => {
    try {
      const { data, error } = await supabase
        .from('event_authorizations')
        .select(`
          *,
          profiles!event_authorizations_authorized_user_id_fkey (
            name,
            email
          )
        `)
        .eq('event_id', eventId);

      if (error) throw error;
      setAuthorizations(data || []);
    } catch (error) {
      console.error('Error loading authorizations:', error);
    }
  };

  const handleAddAuthorization = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Buscar usuário pelo email
      const { data: user, error: userError } = await supabase
        .from('profiles')
        .select('id, name')
        .eq('email', email.trim())
        .single();

      if (userError || !user) {
        toast({
          title: "Usuário não encontrado",
          description: "Este email não está cadastrado na plataforma.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Verificar se já existe autorização
      const { data: existing } = await supabase
        .from('event_authorizations')
        .select('id')
        .eq('event_id', eventId)
        .eq('authorized_user_id', user.id)
        .single();

      if (existing) {
        toast({
          title: "Autorização já existe",
          description: "Este usuário já possui autorização para este evento.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Criar autorização
      const storedUser = localStorage.getItem('ingrezzi_user');
      const currentUserId = storedUser ? JSON.parse(storedUser).id : null;

      const { error } = await supabase
        .from('event_authorizations')
        .insert({
          event_id: eventId,
          authorized_user_id: user.id,
          authorized_by: currentUserId,
          status: 'approved'
        });

      if (error) throw error;

      toast({
        title: "Autorização concedida",
        description: `${user.name} agora pode fazer check-in neste evento.`,
      });

      setEmail("");
      loadAuthorizations();
    } catch (error) {
      console.error('Error adding authorization:', error);
      toast({
        title: "Erro ao adicionar autorização",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAuthorization = async (authId: string) => {
    try {
      const { error } = await supabase
        .from('event_authorizations')
        .delete()
        .eq('id', authId);

      if (error) throw error;

      toast({
        title: "Autorização removida",
        description: "A autorização foi removida com sucesso.",
      });

      loadAuthorizations();
    } catch (error) {
      console.error('Error removing authorization:', error);
      toast({
        title: "Erro ao remover autorização",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciar Autorizações de Check-in</DialogTitle>
          <DialogDescription>
            Controle quem pode fazer check-in no evento: {eventTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Adicionar nova autorização */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserPlus className="w-5 h-5" />
                Adicionar Autorização
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddAuthorization} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email do usuário</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="usuario@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Adicionando..." : "Adicionar Autorização"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Lista de autorizações */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Usuários Autorizados ({authorizations.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {authorizations.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  Nenhuma autorização concedida ainda.
                </p>
              ) : (
                <div className="space-y-3">
                  {authorizations.map((auth) => (
                    <div key={auth.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium">{auth.profiles?.name}</p>
                          <p className="text-sm text-gray-500">{auth.profiles?.email}</p>
                        </div>
                        <Badge variant={auth.status === 'approved' ? 'default' : 'secondary'}>
                          {auth.status === 'approved' ? 'Aprovado' : 'Pendente'}
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveAuthorization(auth.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventAuthorizationModal;
