
# Documentação da API - PiercerHub

## Visão Geral

O PiercerHub utiliza o Supabase como backend, fornecendo uma API REST automaticamente gerada a partir do esquema do banco de dados PostgreSQL.

## Base URL

```
https://ulbjqdwnmjvmsrjrball.supabase.co/rest/v1/
```

## Autenticação

Todas as requisições devem incluir os headers de autenticação:

```bash
Authorization: Bearer <JWT_TOKEN>
apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsYmpxZHdubWp2bXNyanJiYWxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NjgwNzcsImV4cCI6MjA2MzM0NDA3N30.BKMJMIatvmGbXhRKX_BCNa8uDQZvFlPK9RpvHnaNpx8
```

## Endpoints Principais

### Inventário

#### Listar Produtos
```http
GET /inventory?select=*,product_categories(name),jewelry_materials(name)
```

#### Criar Produto
```http
POST /inventory
Content-Type: application/json

{
  "name": "Piercing Titânio",
  "category_id": "uuid",
  "price": 50.00,
  "cost_price": 25.00,
  "stock": 10,
  "threshold": 5,
  "is_service": false
}
```

#### Atualizar Produto
```http
PATCH /inventory?id=eq.{id}
Content-Type: application/json

{
  "stock": 8,
  "price": 55.00
}
```

### Clientes

#### Listar Clientes
```http
GET /clients?select=*
```

#### Criar Cliente
```http
POST /clients
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "(11) 99999-9999",
  "birth_date": "1990-01-01"
}
```

### Vendas

#### Criar Venda
```http
POST /sales
Content-Type: application/json

{
  "client_id": "uuid",
  "total": 150.00,
  "payment_method": "credit_card",
  "procedure_notes": "Piercing no lóbulo"
}
```

#### Itens da Venda
```http
POST /sale_items
Content-Type: application/json

{
  "sale_id": "uuid",
  "product_id": "uuid",
  "quantity": 1,
  "price": 50.00
}
```

### Agendamentos

#### Listar Agendamentos
```http
GET /appointments?select=*,clients(name)
```

#### Criar Agendamento
```http
POST /appointments
Content-Type: application/json

{
  "client_id": "uuid",
  "title": "Piercing no Nariz",
  "start_time": "2025-06-20T14:00:00Z",
  "end_time": "2025-06-20T15:00:00Z",
  "description": "Cliente quer piercing simples"
}
```

## Filtros e Consultas

### Operadores Supabase

- `eq` - igual
- `neq` - diferente
- `gt` - maior que
- `gte` - maior ou igual
- `lt` - menor que
- `lte` - menor ou igual
- `like` - busca textual
- `ilike` - busca textual (case insensitive)
- `in` - está em lista
- `is` - é nulo/não nulo

### Exemplos

```http
# Produtos em baixa no estoque
GET /inventory?stock=lt.threshold

# Clientes por nome
GET /clients?name=ilike.*João*

# Vendas do último mês
GET /sales?created_at=gte.2025-05-01

# Produtos de uma categoria
GET /inventory?category_id=eq.uuid
```

## Relacionamentos (Joins)

```http
# Vendas com itens e produtos
GET /sales?select=*,sale_items(quantity,price,inventory(name))

# Clientes com anamnese
GET /clients?select=*,anamnesis(*)

# Agendamentos com dados do cliente
GET /appointments?select=*,clients(name,phone)
```

## Agregações

```http
# Total de vendas por mês
GET /sales?select=created_at::date,total.sum()&group_by=created_at::date

# Contagem de produtos por categoria
GET /inventory?select=category_id,count()&group_by=category_id
```

## Row Level Security (RLS)

Todas as consultas são automaticamente filtradas pelo `user_id` do usuário autenticado. Não é necessário incluir este filtro manualmente.

## Rate Limiting

- 100 requisições por minuto por usuário
- 1000 requisições por hora por usuário

## Códigos de Status

- `200` - Sucesso
- `201` - Criado
- `400` - Requisição inválida
- `401` - Não autorizado
- `403` - Proibido
- `404` - Não encontrado
- `409` - Conflito
- `422` - Entidade não processável
- `500` - Erro interno

## Websockets (Realtime)

O Supabase oferece subscriptions em tempo real:

```javascript
// Escutar mudanças no inventário
const channel = supabase
  .channel('inventory-changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'inventory'
  }, (payload) => {
    console.log('Mudança no inventário:', payload)
  })
  .subscribe()
```

## Edge Functions

### Processamento de Pagamentos
```http
POST /functions/v1/process-payment
Content-Type: application/json

{
  "sale_id": "uuid",
  "payment_data": { ... }
}
```

### Notificações
```http
POST /functions/v1/send-notification
Content-Type: application/json

{
  "user_id": "uuid",
  "type": "appointment_reminder",
  "data": { ... }
}
```

## SDKs e Bibliotecas

### JavaScript/TypeScript
```javascript
import { supabase } from '@/integrations/supabase/client'

// Listar produtos
const { data, error } = await supabase
  .from('inventory')
  .select('*')
  .eq('is_service', false)
```

### Exemplos de Uso Comum

#### Buscar produtos em baixa no estoque
```javascript
const { data: lowStock } = await supabase
  .from('inventory')
  .select('*')
  .filter('stock', 'lt', 'threshold')
```

#### Criar venda completa
```javascript
// 1. Criar venda
const { data: sale } = await supabase
  .from('sales')
  .insert({
    client_id,
    total,
    payment_method
  })
  .select()
  .single()

// 2. Adicionar itens
const { data: items } = await supabase
  .from('sale_items')
  .insert(saleItems.map(item => ({
    sale_id: sale.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.price
  })))
```

## Monitoramento e Logs

- Dashboard do Supabase para métricas
- Logs de API em tempo real
- Alertas para erros frequentes
- Monitoring de performance
