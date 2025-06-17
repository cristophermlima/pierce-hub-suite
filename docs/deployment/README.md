
# Guia de Deploy - PiercerHub

## Visão Geral

O PiercerHub é implantado usando Lovable para o frontend e Supabase para o backend. Este documento cobre todos os aspectos do deployment e configuração de produção.

## Arquitetura de Deploy

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   Lovable       │    │   Supabase      │    │   CDN/Edge      │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│   (Assets)      │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Frontend (Lovable)

### Deploy Automático

O Lovable realiza deploy automático a cada push para a branch principal:

1. **Build Process**
   - Vite build para produção
   - Otimização de assets
   - Tree-shaking automático
   - Minificação de código

2. **Deploy Pipeline**
   - Build validation
   - Asset optimization
   - CDN distribution
   - Health checks

### Configuração de Domínio

#### Domínio Padrão
```
https://piercerhub.lovable.app
```

#### Domínio Customizado
1. Acesse Project > Settings > Domains
2. Click em "Connect Domain"
3. Configure DNS:
   ```
   Type: CNAME
   Name: www (ou subdomain desejado)
   Value: piercerhub.lovable.app
   ```

### Variáveis de Ambiente

As configurações são injetadas durante o build:

```typescript
// src/integrations/supabase/client.ts
const supabaseUrl = "https://ulbjqdwnmjvmsrjrball.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIs..."
```

### Performance Optimizations

#### Code Splitting
```typescript
// Lazy loading de páginas
const Inventory = lazy(() => import('./pages/Inventory'))
const POS = lazy(() => import('./pages/POS'))
const Clients = lazy(() => import('./pages/Clients'))
```

#### Asset Optimization
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-select'],
          charts: ['recharts']
        }
      }
    }
  }
})
```

## Backend (Supabase)

### Infraestrutura

#### Database
- **PostgreSQL 15+** - Database principal
- **Connection Pooling** - PgBouncer integrado
- **Backups** - Automáticos diários
- **Read Replicas** - Para queries pesadas

#### Edge Functions
- **Deno Runtime** - JavaScript/TypeScript
- **Global Distribution** - Múltiplas regiões
- **Auto-scaling** - Baseado em demanda

#### Storage
- **S3-compatible** - Para imagens e arquivos
- **CDN Global** - Distribuição de assets
- **Image Optimization** - Resize automático

### Configuração de Produção

#### Database Settings
```sql
-- Configurações de performance
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
ALTER SYSTEM SET max_connections = 100;
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
```

#### RLS Policies
```sql
-- Exemplo de política otimizada
CREATE POLICY "Users can manage their inventory"
  ON public.inventory
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Índice para performance
CREATE INDEX idx_inventory_user_id ON inventory(user_id);
```

#### Triggers e Functions
```sql
-- Função para atualizar estoque
CREATE OR REPLACE FUNCTION update_inventory_stock()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.inventory
  SET stock = stock - NEW.quantity
  WHERE id = NEW.product_id AND is_service = false;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para vendas
CREATE TRIGGER update_stock_on_sale
  AFTER INSERT ON sale_items
  FOR EACH ROW
  EXECUTE FUNCTION update_inventory_stock();
```

### Monitoramento

#### Métricas do Database
- **Query Performance** - pg_stat_statements
- **Connection Usage** - Monitoramento contínuo
- **Disk Usage** - Alertas automáticos
- **Memory Usage** - Tracking de buffers

#### Logs e Alertas
```sql
-- Log de queries lentas
SELECT query, mean_time, calls, total_time
FROM pg_stat_statements
WHERE mean_time > 1000
ORDER BY mean_time DESC;
```

## CI/CD Pipeline

### Git Workflow

```
feature/nova-funcionalidade
│
├── Development
│   ├── Testes locais
│   ├── Code review
│   └── Merge para main
│
└── Production
    ├── Build automático
    ├── Deploy Lovable
    └── Health checks
```

### Migrations

#### Database Migrations
```sql
-- Versionamento de migrations
-- 20250617_add_inventory_fields.sql

ALTER TABLE inventory 
ADD COLUMN thread_specification_id UUID REFERENCES thread_specifications(id);

ALTER TABLE inventory 
ADD COLUMN ring_closure_id UUID REFERENCES ring_closures(id);

-- Rollback script
-- 20250617_add_inventory_fields_rollback.sql
ALTER TABLE inventory DROP COLUMN thread_specification_id;
ALTER TABLE inventory DROP COLUMN ring_closure_id;
```

#### Schema Changes
1. Criar migration script
2. Testar em ambiente de desenvolvimento
3. Aplicar em produção via Supabase Dashboard
4. Verificar integridade dos dados

### Backup e Recovery

#### Backup Strategy
- **Daily Backups** - Automáticos pelo Supabase
- **Point-in-time Recovery** - Até 7 dias
- **Export Manual** - Para migrations grandes

#### Recovery Procedures
```sql
-- Restore de backup específico
SELECT restore_backup('backup_20250617_123456');

-- Verificação de integridade
SELECT * FROM pg_stat_database;
```

## Segurança

### HTTPS/SSL
- **TLS 1.3** - Criptografia em trânsito
- **HSTS** - HTTP Strict Transport Security
- **CSP** - Content Security Policy

### Headers de Segurança
```typescript
// Configurações no Lovable
const securityHeaders = {
  'Strict-Transport-Security': 'max-age=63072000',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block'
}
```

### Authentication
```typescript
// JWT token validation
const validateToken = async (token: string) => {
  const { data, error } = await supabase.auth.getUser(token)
  if (error) throw new Error('Invalid token')
  return data.user
}
```

## Monitoramento e Logs

### Frontend Monitoring

#### Error Tracking
```typescript
// Error boundary para capturar erros
class ErrorBoundary extends Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App Error:', error, errorInfo)
    // Enviar para serviço de monitoramento
  }
}
```

#### Performance Metrics
```typescript
// Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

getCLS(console.log)
getFID(console.log)
getFCP(console.log)
getLCP(console.log)
getTTFB(console.log)
```

### Backend Monitoring

#### Supabase Dashboard
- **API Usage** - Requests por minuto
- **Database Performance** - Query time
- **Storage Usage** - Bytes transferidos
- **Auth Activity** - Logins e registros

#### Custom Metrics
```sql
-- Queries mais executadas
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY calls DESC
LIMIT 10;

-- Tabelas mais acessadas
SELECT schemaname, tablename, n_tup_ins, n_tup_upd, n_tup_del
FROM pg_stat_user_tables
ORDER BY n_tup_ins + n_tup_upd + n_tup_del DESC;
```

## Troubleshooting

### Problemas Comuns

#### Build Failures
```bash
# Limpar cache do Vite
rm -rf node_modules/.vite
npm install

# Verificar TypeScript
npx tsc --noEmit
```

#### Database Connection Issues
```sql
-- Verificar conexões ativas
SELECT pid, usename, application_name, state
FROM pg_stat_activity
WHERE state = 'active';

-- Terminar conexões órfãs
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'idle in transaction'
AND query_start < now() - interval '5 minutes';
```

#### Performance Issues
```typescript
// Profiling de componentes React
import { Profiler } from 'react'

const onRenderCallback = (id, phase, actualDuration) => {
  console.log('Component:', id, 'Phase:', phase, 'Duration:', actualDuration)
}

<Profiler id="InventoryTable" onRender={onRenderCallback}>
  <InventoryTable />
</Profiler>
```

### Health Checks

#### Frontend Health Check
```typescript
// /health endpoint
export const healthCheck = async () => {
  try {
    const response = await fetch('/api/health')
    return response.ok
  } catch {
    return false
  }
}
```

#### Backend Health Check
```sql
-- Database health
SELECT 
  datname,
  numbackends,
  xact_commit,
  xact_rollback,
  blks_read,
  blks_hit
FROM pg_stat_database
WHERE datname = 'postgres';
```

## Rollback Procedures

### Frontend Rollback
1. Acessar Lovable dashboard
2. Ir para Project History
3. Selecionar versão anterior
4. Click "Revert to this version"

### Backend Rollback
```sql
-- Rollback de migration
BEGIN;
-- Executar scripts de rollback
-- Verificar integridade
ROLLBACK; -- ou COMMIT se OK
```

## Scaling

### Horizontal Scaling
- **Supabase** - Auto-scaling baseado em carga
- **CDN** - Distribuição global de assets
- **Edge Functions** - Scaling automático

### Performance Optimization
```typescript
// Lazy loading com Suspense
const LazyComponent = lazy(() => import('./HeavyComponent'))

<Suspense fallback={<Skeleton />}>
  <LazyComponent />
</Suspense>
```

### Database Optimization
```sql
-- Índices para queries frequentes
CREATE INDEX CONCURRENTLY idx_sales_date ON sales(created_at);
CREATE INDEX CONCURRENTLY idx_inventory_category ON inventory(category_id);

-- Particionamento para tabelas grandes
CREATE TABLE sales_2025 PARTITION OF sales
FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
```

---

**Última atualização**: 17 de junho de 2025
**Mantenedor**: Equipe PiercerHub
