
import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Gift, Beaker, Mail, AlertTriangle, KeyRound } from "lucide-react";
import logo from "@/assets/logo.png";
import { PasswordInput } from "@/components/ui/password-input";
import { WhatsAppSupport } from "@/components/layout/WhatsAppSupport";
import { z } from 'zod';

const forgotEmailSchema = z.string().trim().email('Informe um e-mail válido').max(255);

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);

  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  const navigate = useNavigate();

  const isRecovery = useMemo(() => {
    const hash = window.location.hash || '';
    const search = window.location.search || '';
    return hash.includes('type=recovery') || search.includes('type=recovery');
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session && !isRecovery) {
        navigate('/');
      }
    };

    checkUser();
  }, [navigate, isRecovery]);

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

  const handleSendRecovery = async () => {
    const parsed = forgotEmailSchema.safeParse(forgotEmail);
    if (!parsed.success) {
      toast('E-mail inválido', { description: parsed.error.issues[0]?.message });
      return;
    }

    try {
      setForgotLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
        redirectTo: `${window.location.origin}/auth?type=recovery`,
      });
      if (error) throw error;

      toast('Link enviado', {
        description: 'Enviamos um link de redefinição de senha para o seu e-mail.',
      });
      setForgotOpen(false);
      setForgotEmail('');
    } catch (err: any) {
      toast('Não foi possível enviar o link', {
        description: err?.message || 'Tente novamente em instantes.',
      });
    } finally {
      setForgotLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const pass = newPassword.trim();
    if (pass.length < 6) {
      toast('Senha inválida', { description: 'A senha deve ter pelo menos 6 caracteres.' });
      return;
    }
    if (pass !== newPasswordConfirm.trim()) {
      toast('Senhas diferentes', { description: 'As senhas não conferem.' });
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({ password: pass });
      if (error) throw error;

      toast('Senha atualizada', { description: 'Você já pode continuar usando o sistema.' });
      window.history.replaceState({}, document.title, '/auth');
      navigate('/');
    } catch (err: any) {
      toast('Não foi possível atualizar a senha', {
        description: err?.message || 'Tente novamente.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (isRecovery) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background p-4 pb-safe pt-safe">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <img src={logo} alt="PiercerHub Logo" className="h-16 w-auto" />
            </div>
            <CardTitle className="text-2xl">Redefinir senha</CardTitle>
            <CardDescription>Crie uma nova senha para sua conta.</CardDescription>
          </CardHeader>
          <form onSubmit={handleUpdatePassword}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">Nova senha</Label>
                <PasswordInput id="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-new-password">Confirmar nova senha</Label>
                <PasswordInput
                  id="confirm-new-password"
                  value={newPasswordConfirm}
                  onChange={(e) => setNewPasswordConfirm(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Salvando...' : 'Atualizar senha'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  window.history.replaceState({}, document.title, '/auth');
                  navigate('/auth');
                }}
              >
                Voltar
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

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
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto p-0 text-sm"
                      onClick={() => {
                        setForgotEmail(email);
                        setForgotOpen(true);
                      }}
                    >
                      Esqueci minha senha
                    </Button>
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

        <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <KeyRound className="h-5 w-5" />
                Redefinir senha
              </DialogTitle>
              <DialogDescription>
                Informe seu e-mail para enviarmos um link de redefinição de senha.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-2">
              <Label htmlFor="forgot-email">E-mail</Label>
              <Input
                id="forgot-email"
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="nome@exemplo.com"
              />
              <Alert className="bg-muted">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>Se não encontrar o e-mail, verifique a caixa de spam.</AlertDescription>
              </Alert>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setForgotOpen(false)}>
                Cancelar
              </Button>
              <Button type="button" onClick={handleSendRecovery} disabled={forgotLoading}>
                {forgotLoading ? 'Enviando...' : 'Enviar link'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
};

export default Auth;
