
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, ArrowLeft, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(loginData.email, loginData.password);
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta ao Ingrezzi.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(signupData.email, signupData.password, signupData.name);
      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vindo ao Ingrezzi.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Erro no cadastro",
        description: "Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:block">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center space-x-2 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">I</span>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Ingrezzi
              </span>
            </div>
            
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl flex items-center justify-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10 text-center">
                  <Sparkles className="w-16 h-16 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold mb-4">
                    Encontre os melhores eventos
                    <br />
                    da sua cidade
                  </h2>
                  <p className="text-purple-100 text-lg">
                    No Ingrezzi você encontra os melhores eventos e nunca
                    <br />
                    fica parado! Comece agora mesmo.
                  </p>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute top-10 right-10 w-12 h-12 bg-pink-400 rounded-full opacity-80"></div>
                <div className="absolute top-20 left-10 w-8 h-8 bg-yellow-400 rounded-full opacity-80"></div>
                <div className="absolute bottom-20 right-20 w-10 h-10 bg-green-400 rounded-full opacity-80"></div>
                <div className="absolute bottom-10 left-16 w-6 h-6 bg-orange-400 rounded-full opacity-80"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="w-full max-w-md mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6 text-purple-600 hover:text-purple-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Ir para a página inicial
          </Button>

          <Card className="border-0 shadow-2xl">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold">
                Acesse sua conta
                <br />
                no Ingrezzi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Entrar</TabsTrigger>
                  <TabsTrigger value="signup">Cadastrar</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Digite seu e-mail"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Digite sua senha"
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      disabled={isLoading}
                    >
                      {isLoading ? "Entrando..." : "Entrar"}
                    </Button>
                  </form>
                  
                  <div className="text-center mt-4">
                    <Button variant="link" className="text-purple-600">
                      Esqueceu a senha? Clique aqui
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Nome completo</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Digite seu nome completo"
                        value={signupData.name}
                        onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">E-mail</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Digite seu e-mail"
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Senha</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Crie uma senha"
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar senha</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirme sua senha"
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      disabled={isLoading}
                    >
                      {isLoading ? "Criando conta..." : "Cadastre-se gratuitamente"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
