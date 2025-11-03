# Configuração do Agendador (Scheduler)

## Endpoint de Ping

O endpoint `/ping-supabase` foi criado para manter o projeto Supabase ativo.

### URL do Endpoint
```
https://ulbjqdwnmjvmsrjrball.supabase.co/functions/v1/ping-supabase
```

### Testar Manualmente
```bash
curl https://ulbjqdwnmjvmsrjrball.supabase.co/functions/v1/ping-supabase
```

## Configurar Agendamento Automático (a cada 3 dias)

### Passo 1: Habilitar Extensões no Supabase

Acesse o SQL Editor no Supabase e execute:

```sql
-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;
```

### Passo 2: Criar o Job Agendado

Execute o seguinte SQL para criar um job que roda a cada 3 dias:

```sql
-- Agendar ping a cada 3 dias (a cada 72 horas)
SELECT cron.schedule(
  'ping-supabase-every-3-days',
  '0 0 */3 * *', -- A cada 3 dias à meia-noite
  $$
  SELECT
    net.http_post(
      url:='https://ulbjqdwnmjvmsrjrball.supabase.co/functions/v1/ping-supabase',
      headers:='{"Content-Type": "application/json"}'::jsonb
    ) as request_id;
  $$
);
```

### Passo 3: Verificar Jobs Ativos

Para listar todos os jobs agendados:

```sql
SELECT * FROM cron.job;
```

### Passo 4: Ver Histórico de Execuções

Para verificar o histórico de execuções:

```sql
SELECT * FROM cron.job_run_details 
ORDER BY start_time DESC 
LIMIT 10;
```

## Gerenciamento do Scheduler

### Desativar o Job
```sql
SELECT cron.unschedule('ping-supabase-every-3-days');
```

### Reativar o Job
Execute novamente o comando do Passo 2.

### Alterar Frequência

Exemplos de cronogramas:
- `'0 */6 * * *'` - A cada 6 horas
- `'0 0 * * *'` - Todo dia à meia-noite
- `'0 0 */2 * *'` - A cada 2 dias
- `'0 12 * * 0'` - Todo domingo ao meio-dia

## Variáveis de Ambiente

As seguintes variáveis já estão configuradas automaticamente no ambiente da Edge Function:

- `SUPABASE_URL`: URL do projeto
- `SUPABASE_SERVICE_ROLE_KEY`: Chave de serviço (com permissões elevadas)
- `SUPABASE_PUBLISHABLE_KEY`: Chave pública

Não é necessário adicionar manualmente.

## Monitoramento

Acesse os logs da função em:
https://supabase.com/dashboard/project/ulbjqdwnmjvmsrjrball/functions/ping-supabase/logs

## Resposta Esperada

Sucesso:
```json
{
  "status": "ok",
  "message": "Supabase connection is active",
  "data": [...],
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

Erro:
```json
{
  "status": "error",
  "message": "Error message here",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```
