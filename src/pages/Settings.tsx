
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

const Settings = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas configurações foram salvas com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Configurações</h1>
        <p className="text-muted-foreground">Gerencie suas configurações e preferências do PiercerHub.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <ScrollArea className="max-w-full">
          <TabsList className="flex flex-nowrap overflow-x-auto py-1 w-auto mb-2">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="business">Empresa</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="appearance">Aparência</TabsTrigger>
          </TabsList>
        </ScrollArea>
        
        <TabsContent value="profile" className="pt-4">
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
        </TabsContent>
        
        <TabsContent value="business" className="pt-4">
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
        </TabsContent>
        
        <TabsContent value="notifications" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>
                Escolha quais notificações você deseja receber.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ScrollArea className="h-[60vh] pr-4">
                <div className="pr-4 space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Notificações por E-mail</h3>
                    <div className="grid gap-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email-appointments" className="flex-1">Confirmações de Agendamento</Label>
                        <Switch id="email-appointments" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email-reminders" className="flex-1">Lembretes de Agendamento</Label>
                        <Switch id="email-reminders" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email-inventory" className="flex-1">Alertas de Estoque</Label>
                        <Switch id="email-inventory" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email-reports" className="flex-1">Relatórios Semanais</Label>
                        <Switch id="email-reports" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email-marketing" className="flex-1">Atualizações de Marketing</Label>
                        <Switch id="email-marketing" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Notificações no Aplicativo</h3>
                    <div className="grid gap-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="app-appointments" className="flex-1">Novos Agendamentos</Label>
                        <Switch id="app-appointments" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="app-cancellations" className="flex-1">Cancelamentos de Agendamento</Label>
                        <Switch id="app-cancellations" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="app-inventory" className="flex-1">Alertas de Estoque Baixo</Label>
                        <Switch id="app-inventory" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="app-client" className="flex-1">Mensagens de Clientes</Label>
                        <Switch id="app-client" defaultChecked />
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
        </TabsContent>
        
        <TabsContent value="appearance" className="pt-4">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
