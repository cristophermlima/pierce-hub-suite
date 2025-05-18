
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';

export const ProfileSettings = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas informações de perfil foram salvas com sucesso.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Perfil</CardTitle>
        <CardDescription>
          Atualize suas informações pessoais e configurações de perfil.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-[60vh] pr-4">
          <div className="pr-4 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="firstName">Nome</Label>
                <Input id="firstName" defaultValue="João" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="lastName">Sobrenome</Label>
                <Input id="lastName" defaultValue="Silva" />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="email">Endereço de Email</Label>
              <Input id="email" type="email" defaultValue="joao.silva@exemplo.com" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="phone">Número de Telefone</Label>
              <Input id="phone" defaultValue="(11) 98765-4321" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" value="********" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="role">Cargo/Título</Label>
              <Input id="role" defaultValue="Piercer Principal" />
            </div>
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSave}>Salvar Alterações</Button>
      </CardFooter>
    </Card>
  );
};
