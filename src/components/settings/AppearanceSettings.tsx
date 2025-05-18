
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';

export const AppearanceSettings = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas preferências de aparência foram salvas com sucesso.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Aparência</CardTitle>
        <CardDescription>
          Personalize a aparência do seu PiercerHub.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ScrollArea className="h-[60vh] pr-4">
          <div className="pr-4 space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium">Tema</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border rounded-md p-4 cursor-pointer bg-card border-primary">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Escuro (Padrão)</span>
                    <div className="w-4 h-4 rounded-full bg-primary"></div>
                  </div>
                  <div className="h-20 bg-background rounded-md border border-border">
                    <div className="h-6 w-full bg-card border-b border-border"></div>
                  </div>
                </div>
                <div className="border rounded-md p-4 cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Claro</span>
                    <div className="w-4 h-4 rounded-full border border-muted-foreground"></div>
                  </div>
                  <div className="h-20 bg-white rounded-md border">
                    <div className="h-6 w-full bg-gray-100 border-b"></div>
                  </div>
                </div>
                <div className="border rounded-md p-4 cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Sistema</span>
                    <div className="w-4 h-4 rounded-full border border-muted-foreground"></div>
                  </div>
                  <div className="h-20 bg-gradient-to-r from-background to-black rounded-md border border-border">
                    <div className="h-6 w-full bg-gradient-to-r from-card to-gray-800 border-b border-border"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Layout do Painel</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border rounded-md p-4 cursor-pointer bg-card border-primary">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Padrão</span>
                    <div className="w-4 h-4 rounded-full bg-primary"></div>
                  </div>
                  <div className="h-20 bg-accent rounded-md p-1 grid grid-cols-4 gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="bg-card rounded-sm"></div>
                    ))}
                    <div className="col-span-2 bg-card rounded-sm"></div>
                    <div className="col-span-2 bg-card rounded-sm"></div>
                  </div>
                </div>
                <div className="border rounded-md p-4 cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Compacto</span>
                    <div className="w-4 h-4 rounded-full border border-muted-foreground"></div>
                  </div>
                  <div className="h-20 bg-accent rounded-md p-1 grid grid-cols-2 gap-1">
                    <div className="bg-card rounded-sm"></div>
                    <div className="bg-card rounded-sm"></div>
                    <div className="col-span-2 bg-card rounded-sm h-10"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Opções Adicionais</h3>
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="compact-menu" className="flex-1">Menu Compacto</Label>
                  <Switch id="compact-menu" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-animations" className="flex-1">Animações da Interface</Label>
                  <Switch id="show-animations" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="dense-tables" className="flex-1">Tabelas Compactas</Label>
                  <Switch id="dense-tables" />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSave}>Salvar Preferências</Button>
      </CardFooter>
    </Card>
  );
};
