
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const Loyalty = () => {
  const topClients = [
    { id: 1, name: 'Ana Silva', points: 540, level: 'Ouro', avatar: 'AS', recentServices: 8 },
    { id: 2, name: 'Carlos Oliveira', points: 480, level: 'Prata', avatar: 'CO', recentServices: 6 },
    { id: 3, name: 'Mariana Santos', points: 320, level: 'Bronze', avatar: 'MS', recentServices: 5 },
    { id: 4, name: 'Rafael Lima', points: 290, level: 'Bronze', avatar: 'RL', recentServices: 4 },
    { id: 5, name: 'Juliana Costa', points: 250, level: 'Bronze', avatar: 'JC', recentServices: 3 },
  ];

  const recentRedeems = [
    { id: 1, client: 'Ana Silva', avatar: 'AS', reward: 'Desconto de 15%', points: 200, date: '12/05/2023' },
    { id: 2, client: 'Carlos Oliveira', avatar: 'CO', reward: 'Piercing Gratuito', points: 350, date: '10/05/2023' },
    { id: 3, client: 'Rafael Lima', avatar: 'RL', reward: 'Kit Cuidados', points: 150, date: '05/05/2023' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total de Pontos</CardTitle>
            <CardDescription>Pontos emitidos este mês</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2,450</div>
            <p className="text-xs text-muted-foreground">+15% em relação ao mês anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Clientes Ativos</CardTitle>
            <CardDescription>No programa de fidelidade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">85</div>
            <p className="text-xs text-muted-foreground">+5 novos este mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Recompensas Resgatadas</CardTitle>
            <CardDescription>Neste mês</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">Valor aproximado: R$ 1.350</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="clients">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="clients">Top Clientes</TabsTrigger>
          <TabsTrigger value="rewards">Resgates Recentes</TabsTrigger>
        </TabsList>
        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <CardTitle>Ranking de Fidelidade</CardTitle>
              <CardDescription>Clientes com mais pontos acumulados</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Nível</TableHead>
                    <TableHead>Pontos</TableHead>
                    <TableHead>Progresso</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topClients.map(client => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="" alt={client.name} />
                            <AvatarFallback>{client.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{client.name}</div>
                            <div className="text-xs text-muted-foreground">{client.recentServices} serviços</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          client.level === 'Ouro' ? 'default' :
                          client.level === 'Prata' ? 'secondary' : 'outline'
                        }>
                          {client.level}
                        </Badge>
                      </TableCell>
                      <TableCell>{client.points}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Progress value={
                            client.level === 'Ouro' ? 90 :
                            client.level === 'Prata' ? 65 : 40
                          } className="h-2" />
                          <span className="text-xs">
                            {client.level === 'Ouro' ? 'Próximo: Platina' :
                             client.level === 'Prata' ? 'Próximo: Ouro' : 'Próximo: Prata'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Ver Perfil</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Ver Todos os Clientes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="rewards">
          <Card>
            <CardHeader>
              <CardTitle>Resgates Recentes</CardTitle>
              <CardDescription>Últimas recompensas resgatadas por clientes</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Recompensa</TableHead>
                    <TableHead>Pontos Usados</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentRedeems.map(redeem => (
                    <TableRow key={redeem.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="" alt={redeem.client} />
                            <AvatarFallback>{redeem.avatar}</AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{redeem.client}</div>
                        </div>
                      </TableCell>
                      <TableCell>{redeem.reward}</TableCell>
                      <TableCell>{redeem.points}</TableCell>
                      <TableCell>{redeem.date}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Detalhes</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Ver Histórico Completo</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Loyalty;
