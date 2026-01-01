
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
import { Gift, Beaker, Mail, CheckCircle } from "lucide-react";
import logo from "@/assets/logo.png";
import { PasswordInput } from "@/components/ui/password-input";
import { WhatsAppSupport } from "@/components/layout/WhatsAppSupport";

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
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
      
      let errorMessage = "Verifique suas credenciais e tente novamente.";
      if (error.message.includes('Email not confirmed')) {
        errorMessage = "Por favor, confirme seu email antes de fazer login.";
      } else if (error.message.includes('Invalid login credentials')) {
        errorMessage = "Email ou senha incorretos.";
      }
      
      toast("Erro no login", {
        description: errorMessage,
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

    if (password.length < 6) {
      toast("Senha muito curta", {
        description: "A senha deve ter pelo menos 6 caracteres."
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

      setShowEmailVerification(true);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setName('');
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      
      let errorMessage = "Não foi possível criar sua conta.";
      if (error.message.includes('already registered')) {
        errorMessage = "Este email já está cadastrado.";
      }
      
      toast("Erro no cadastro", {
        description: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background p-4 pb-safe pt-safe">
      <Card className="w-full max-w-md mx-4">
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
                  <PasswordInput
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
                <WhatsAppSupport variant="auth" />
              </CardFooter>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            {showEmailVerification ? (
              <CardContent className="space-y-4">
                <Alert className="border-green-600 bg-green-50">
                  <div className="flex flex-col items-center space-y-4 py-4">
                    <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                      <Mail className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="text-center space-y-2">
                      <h3 className="font-bold text-lg text-green-800">Verifique seu e-mail!</h3>
                      <AlertDescription className="text-green-900 text-sm leading-relaxed">
                        Enviamos um link de confirmação para o seu e-mail. 
                        Por favor, acesse sua caixa de entrada e clique no link para ativar sua conta.
                      </AlertDescription>
                      <p className="text-xs text-green-700 mt-4">
                        Não recebeu? Verifique também a pasta de spam.
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setShowEmailVerification(false)}
                    >
                      Voltar ao cadastro
                    </Button>
                  </div>
                </Alert>
                <WhatsAppSupport variant="auth" />
              </CardContent>
            ) : (
              <>
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
                      <PasswordInput
                        id="signup-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar Senha</Label>
                      <PasswordInput
                        id="confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4">
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Cadastrando..." : "Iniciar Teste Grátis"}
                    </Button>
                    <WhatsAppSupport variant="auth" />
                  </CardFooter>
                </form>
              </>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;
