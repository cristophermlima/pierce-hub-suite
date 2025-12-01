
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { Gift, Beaker } from "lucide-react";
import logo from "@/assets/logo.png";

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se o usuário já está autenticado
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/');
      }
    };

    checkUser();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast("Dados incompletos", {
        description: "Por favor, preencha todos os campos."
      });
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast("Login realizado", {
        description: "Bem-vindo de volta!"
      });
      navigate('/');
    } catch (error: any) {
      console.error('Erro no login:', error);
      toast("Erro no login", {
        description: error.message || "Verifique suas credenciais e tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword || !name) {
      toast("Dados incompletos", {
        description: "Por favor, preencha todos os campos."
      });
      return;
    }

    if (password !== confirmPassword) {
      toast("Senhas diferentes", {
        description: "As senhas não conferem."
      });
      return;
    }

    try {
      setLoading(true);
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name,
          }
        }
      });

      if (error) throw error;

      toast("Cadastro realizado", {
        description: "Conta criada com sucesso! Faça login para começar."
      });
      
      // Limpar formulário e mudar para aba de login
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setName('');
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      toast("Erro no cadastro", {
        description: error.message || "Não foi possível criar sua conta."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="PiercerHub Logo" className="h-16 w-auto" />
          </div>
          <CardTitle className="text-2xl">PiercerHub ERP</CardTitle>
          <CardDescription>
            Gerencie seu estúdio de piercing de maneira eficiente
          </CardDescription>
        </CardHeader>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Cadastro</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nome@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <div className="px-6 pb-4">
              <Alert className="border-green-600 bg-green-50">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center gap-2 text-green-700">
                    <Gift className="h-5 w-5" />
                    <span className="font-bold text-base">10 dias GRÁTIS de teste!</span>
                  </div>
                  <AlertDescription className="text-green-900 text-sm leading-relaxed">
                    Experimente todas as funcionalidades do PiercerHub sem compromisso.
                    Após o período, será necessário realizar uma assinatura para continuar utilizando.
                  </AlertDescription>
                  <div className="flex items-start gap-2 pt-2 border-t border-green-200">
                    <Beaker className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-yellow-800">
                      <strong>Atenção:</strong> Este software está em fase de testes! Sinta-se à vontade para sugerir melhorias e relatar bugs.
                    </div>
                  </div>
                </div>
              </Alert>
            </div>
            <form onSubmit={handleSignUp}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    placeholder="Seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">E-mail</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="nome@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Senha</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Senha</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Cadastrando..." : "Iniciar Teste Grátis"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;
