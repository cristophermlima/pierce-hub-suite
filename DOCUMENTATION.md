
# PiercerHub - Documentação Completa

## Visão Geral

O PiercerHub é um sistema completo de gerenciamento para estúdios de piercing, desenvolvido com React, TypeScript, Tailwind CSS e Supabase. O sistema oferece funcionalidades para gestão de estoque, clientes, agendamentos, vendas (PDV), relatórios e muito mais.

## Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca principal para interface do usuário
- **TypeScript** - Tipagem estática para JavaScript
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Biblioteca de componentes UI
- **React Router DOM** - Roteamento do lado do cliente
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de esquemas
- **Lucide React** - Ícones
- **Recharts** - Gráficos e visualizações
- **Sonner** - Notificações toast

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - Autenticação
  - Base de dados PostgreSQL
  - Row Level Security (RLS)
  - Realtime subscriptions
  - Edge Functions
- **TanStack Query (React Query)** - Gerenciamento de estado do servidor

## Estrutura do Projeto

```
src/
├── components/           # Componentes reutilizáveis
│   ├── ui/              # Componentes base do shadcn/ui
│   ├── auth/            # Componentes de autenticação
│   ├── layout/          # Componentes de layout
│   └── settings/        # Componentes de configurações
├── features/            # Funcionalidades por domínio
│   ├── appointments/    # Agendamentos
│   ├── clients/         # Gestão de clientes
│   ├── inventory/       # Gestão de estoque
│   ├── loyalty/         # Programas de fidelidade
│   ├── notifications/   # Sistema de notificações
│   ├── pos/            # Ponto de Venda (PDV)
│   ├── reports/        # Relatórios
│   ├── settings/       # Configurações
│   └── suppliers/      # Fornecedores
├── hooks/              # Hooks customizados
├── integrations/       # Integrações externas
│   └── supabase/       # Cliente e tipos do Supabase
├── lib/                # Utilitários e configurações
└── pages/              # Páginas da aplicação
```

## Funcionalidades Principais

### 1. Autenticação e Autorização
- Sistema de login/cadastro com Supabase Auth
- Período de teste gratuito de 10 dias
- Gestão de assinaturas e acesso
- Row Level Security para isolamento de dados por usuário

### 2. Dashboard
- Visão geral das métricas do negócio
- Vendas do dia/mês
- Estoque em baixa
- Próximos agendamentos
- Gráficos de performance

### 3. Gestão de Estoque
- **Produtos e Serviços**: Cadastro completo com categorias
- **Especificações para Joias**: 
  - Materiais (titânio, aço cirúrgico, etc.)
  - Tipos de rosca (interna, externa, push pin)
  - Especificações de fechamento (clicker, segmento, etc.)
  - Dimensões (espessura, comprimento, diâmetro)
- **Controle de Estoque**: Quantidade, preço de custo/venda, threshold
- **Fornecedores**: Gestão de fornecedores e relacionamento com produtos
- **Campos Customizados**: Sistema flexível para adicionar campos específicos
- **Imagens**: Upload e gestão de imagens dos produtos

### 4. Gestão de Clientes
- Cadastro completo com dados pessoais
- **Anamnese Detalhada**: 
  - Histórico médico (epilepsia, hemofilia, diabetes, etc.)
  - Hábitos (atividade física, álcool, fumo)
  - Medicamentos e alergias
  - Saúde mental
- **Preferências de Notificação**: Controle granular de comunicação
- **Histórico de Visitas**: Tracking automático

### 5. Sistema de Agendamentos
- Calendário interativo
- Agendamento de procedimentos
- Notificações automáticas
- Gestão de status (agendado, confirmado, concluído)
- Integração com dados do cliente

### 6. Ponto de Venda (PDV)
- Interface intuitiva para vendas
- **Carrinho de Compras**: Adicionar produtos/serviços
- **Processamento de Pagamentos**: Múltiplas formas de pagamento
- **Gestão de Caixa**: Abertura/fechamento de caixa
- **Custos de Procedimento**: Tracking de materiais utilizados
- **Recibos**: Geração automática de comprovantes
- **Atualização de Estoque**: Automática após vendas

### 7. Programas de Fidelidade
- **Campanhas Customizáveis**: Criar regras específicas
- **Condições Flexíveis**: Baseadas em visitas, gastos, etc.
- **Recompensas Variadas**: Descontos, brindes, serviços gratuitos
- **Tracking Automático**: Aplicação automática de benefícios

### 8. Relatórios e Analytics
- **Vendas**: Por período, produto, cliente
- **Estoque**: Movimentações, produtos em baixa
- **Clientes**: Frequência, gastos médios
- **Financeiro**: Receitas, custos, margem
- **Exportação**: PDF, Excel

### 9. Configurações
- **Perfil do Usuário**: Dados pessoais
- **Configurações de Negócio**: Nome, endereço, horários
- **Notificações**: Preferências de comunicação
- **Aparência**: Temas e personalização

## Banco de Dados

### Tabelas Principais

#### Usuários e Autenticação
- `user_subscriptions` - Assinaturas e períodos de teste
- `business_settings` - Configurações do negócio
- `notification_settings` - Preferências de notificação

#### Produtos e Estoque
- `inventory` - Produtos e serviços
- `product_categories` - Categorias de produtos
- `jewelry_materials` - Materiais para joias
- `thread_types` - Tipos de rosca
- `thread_specifications` - Especificações de rosca
- `ring_closures` - Tipos de fechamento
- `suppliers` - Fornecedores
- `inventory_custom_fields` - Campos customizados
- `inventory_item_custom_values` - Valores dos campos customizados

#### Clientes
- `clients` - Dados dos clientes
- `anamnesis` - Anamnese médica

#### Vendas
- `sales` - Vendas realizadas
- `sale_items` - Itens das vendas
- `cash_registers` - Controle de caixa
- `procedure_costs` - Custos de procedimentos
- `procedure_materials` - Materiais para procedimentos

#### Agendamentos
- `appointments` - Agendamentos

#### Fidelidade
- `loyalty_plans` - Planos de fidelidade

### Row Level Security (RLS)

Todas as tabelas implementam RLS para garantir que cada usuário acesse apenas seus próprios dados:

```sql
-- Exemplo de política RLS
CREATE POLICY "Users can manage their own inventory"
  ON public.inventory
  FOR ALL
  USING (user_id = auth.uid());
```

## Fluxos de Trabalho

### 1. Fluxo de Venda
1. Cliente chega ao estúdio
2. Profissional abre o PDV
3. Adiciona produtos/serviços ao carrinho
4. Se for procedimento, registra materiais utilizados
5. Processa pagamento
6. Sistema atualiza estoque automaticamente
7. Gera recibo
8. Atualiza histórico do cliente

### 2. Fluxo de Agendamento
1. Cliente solicita agendamento
2. Profissional verifica disponibilidade
3. Cria agendamento no sistema
4. Sistema envia notificações (se configurado)
5. No dia do procedimento, realiza atendimento
6. Marca como concluído
7. Realiza venda pelo PDV

### 3. Fluxo de Fidelidade
1. Sistema monitora atividades do cliente
2. Verifica condições dos programas ativos
3. Aplica recompensas automaticamente
4. Notifica cliente sobre benefícios

## Segurança

### Autenticação
- Supabase Auth com email/senha
- Tokens JWT para sessões
- Refresh tokens automáticos

### Autorização
- Row Level Security no banco
- Políticas granulares por tabela
- Isolamento completo entre usuários

### Dados Sensíveis
- Criptografia em trânsito (HTTPS)
- Dados médicos protegidos
- Backup automático do Supabase

## Performance

### Frontend
- Code splitting por rotas
- Lazy loading de componentes
- Otimizações do Vite
- Cache do TanStack Query

### Backend
- Indexes otimizados no PostgreSQL
- Queries eficientes com joins
- Paginação em listas grandes
- Cache de dados estáticos

## Ambiente de Desenvolvimento

### Pré-requisitos
- Node.js (versão 18+)
- npm ou yarn
- Conta no Supabase

### Configuração Local
```bash
# Clone o repositório
git clone <URL_DO_REPOSITORIO>

# Instale dependências
npm install

# Configure variáveis de ambiente
# (URLs e chaves do Supabase)

# Inicie o servidor de desenvolvimento
npm run dev
```

### Estrutura de Branch
- `main` - Produção
- `development` - Desenvolvimento
- `feature/*` - Novas funcionalidades

## Deploy

### Frontend (Lovable)
- Deploy automático via Lovable
- Domínio customizável
- HTTPS automático

### Backend (Supabase)
- Infraestrutura gerenciada
- Backups automáticos
- Monitoramento incluso

## Roadmap Futuro

### Funcionalidades Planejadas
- [ ] Integração com WhatsApp Business
- [ ] Sistema de comissões
- [ ] Múltiplos profissionais
- [ ] Agenda online para clientes
- [ ] Integração com redes sociais
- [ ] Sistema de avaliações
- [ ] Marketplace de fornecedores

### Melhorias Técnicas
- [ ] Testes automatizados
- [ ] PWA (Progressive Web App)
- [ ] Modo offline
- [ ] Sincronização em tempo real
- [ ] Analytics avançados

## Suporte e Contribuição

### Documentação Técnica
- README.md - Instruções básicas
- DOCUMENTATION.md - Este documento
- /docs/api/ - Documentação da API
- /docs/components/ - Guia de componentes

### Canais de Suporte
- Discord da Lovable
- Issues no GitHub
- Documentação oficial

### Como Contribuir
1. Fork do repositório
2. Criar branch feature
3. Desenvolver e testar
4. Abrir Pull Request
5. Review e merge

---

**Última atualização**: 17 de junho de 2025
**Versão**: 1.0.0
**Mantenedor**: Equipe PiercerHub
