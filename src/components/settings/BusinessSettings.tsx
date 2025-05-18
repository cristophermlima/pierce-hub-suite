
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';

export const BusinessSettings = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas configurações de empresa foram salvas com sucesso.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações da Empresa</CardTitle>
        <CardDescription>
          Gerencie as informações do seu estúdio e detalhes da empresa.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-[60vh] pr-4">
          <div className="pr-4 space-y-4">
            <div className="grid gap-1.5">
              <Label htmlFor="businessName">Nome do Estúdio</Label>
              <Input id="businessName" defaultValue="Estúdio Steel & Ink Piercing" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="businessAddress">Endereço</Label>
              <Input id="businessAddress" defaultValue="Rua Principal, 123" />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="grid gap-1.5">
                <Label htmlFor="businessCity">Cidade</Label>
                <Input id="businessCity" defaultValue="São Paulo" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="businessState">Estado</Label>
                <Input id="businessState" defaultValue="SP" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="businessZip">CEP</Label>
                <Input id="businessZip" defaultValue="01000-000" />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="businessDescription">Descrição</Label>
              <Textarea 
                id="businessDescription" 
                className="min-h-[100px]"
                defaultValue="Estúdio profissional de piercing especializado em piercings e joias de alta qualidade. Estabelecido em 2015."
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="businessHours">Horário de Funcionamento</Label>
                <Input id="businessHours" defaultValue="Seg-Sáb: 10h-20h, Dom: Fechado" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="businessWebsite">Site</Label>
                <Input id="businessWebsite" defaultValue="https://piercingstudio.exemplo.com" />
              </div>
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
