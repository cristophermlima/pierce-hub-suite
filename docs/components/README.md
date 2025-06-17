
# Guia de Componentes - PiercerHub

## Visão Geral

Este documento descreve todos os componentes do PiercerHub, organizados por funcionalidade e responsabilidade.

## Estrutura de Componentes

### Componentes Base (UI)

Localizados em `src/components/ui/`, baseados no shadcn/ui:

#### Formulários
- `Button` - Botões com variantes
- `Input` - Campos de entrada
- `Textarea` - Área de texto
- `Select` - Seleção dropdown
- `Checkbox` - Caixas de seleção
- `RadioGroup` - Grupos de radio
- `Switch` - Interruptores
- `Slider` - Controles deslizantes

#### Layout
- `Card` - Cartões de conteúdo
- `Dialog` - Modais/diálogos
- `Sheet` - Painéis laterais
- `Tabs` - Abas
- `Accordion` - Acordeões
- `Separator` - Separadores

#### Feedback
- `Alert` - Alertas
- `Badge` - Badges/etiquetas
- `Progress` - Barras de progresso
- `Skeleton` - Loading skeletons
- `Toast` - Notificações

### Componentes de Layout

#### `AdminLayout`
Layout principal para páginas administrativas.

```tsx
<AdminLayout>
  <div>Conteúdo da página</div>
</AdminLayout>
```

**Props:**
- `children: ReactNode` - Conteúdo da página

#### `Header`
Cabeçalho principal com navegação e menu do usuário.

**Funcionalidades:**
- Logo do PiercerHub
- Menu de navegação
- UserMenu com opções do usuário
- TrialBanner para período de teste

#### `Sidebar`
Barra lateral de navegação.

**Funcionalidades:**
- Links para todas as seções
- Indicador de seção ativa
- Ícones Lucide para cada item

### Componentes de Autenticação

#### `ProtectedRoute`
Wrapper para rotas que requerem autenticação.

```tsx
<ProtectedRoute>
  <MinhaPagePrivada />
</ProtectedRoute>
```

#### `AccessControl`
Controla acesso baseado em assinatura.

#### `UserMenu`
Menu dropdown do usuário logado.

**Funcionalidades:**
- Informações do usuário
- Link para configurações
- Logout

### Componentes de Funcionalidades

#### Inventário (`src/features/inventory/components/`)

##### `InventoryTable`
Tabela principal do inventário.

**Props:**
- `inventory: InventoryItem[]` - Lista de itens
- `onEdit: (item) => void` - Callback para edição
- `onAddItem: () => void` - Callback para adicionar

**Funcionalidades:**
- Exibição em tabela responsiva
- Filtros por categoria
- Busca por nome/SKU
- Ordenação por colunas
- Indicadores de estoque baixo

##### `InventoryDialog`
Modal para criar/editar produtos.

**Props:**
- `isOpen: boolean` - Estado do modal
- `onClose: () => void` - Callback para fechar
- `selectedItem?: InventoryItem` - Item para edição
- `onSave: (data) => void` - Callback para salvar

**Seções:**
- `BasicInfoSection` - Informações básicas
- `CommercialInfoSection` - Preços e estoque
- `JewelrySpecsSection` - Especificações para joias
- `FormActionsSection` - Ações do formulário

##### `ImageUpload`
Componente para upload de imagens.

**Props:**
- `images: string[]` - URLs das imagens
- `onChange: (images) => void` - Callback para mudanças
- `maxImages?: number` - Limite de imagens

#### PDV/POS (`src/features/pos/components/`)

##### `ProductsList`
Lista de produtos no PDV.

**Props:**
- `products: Product[]` - Lista de produtos
- `onAddToCart: (product) => void` - Adicionar ao carrinho
- `selectedTab: string` - Aba ativa
- `searchQuery: string` - Termo de busca
- `onTabChange: (tab) => void` - Mudar aba
- `onSearchChange: (query) => void` - Mudar busca

##### `ProductCard`
Card individual de produto.

**Props:**
- `product: Product` - Dados do produto
- `onAddToCart: (product) => void` - Adicionar ao carrinho

**Funcionalidades:**
- Exibição de informações
- Indicador de estoque
- Botão de adicionar
- Badge de categoria
- Badge de serviço

##### `Cart`
Carrinho de compras.

**Props:**
- `items: CartItem[]` - Itens no carrinho
- `onUpdateQuantity: (id, qty) => void` - Atualizar quantidade
- `onRemoveItem: (id) => void` - Remover item
- `onClearCart: () => void` - Limpar carrinho
- `total: number` - Total do carrinho

##### `PaymentDialog`
Modal para processar pagamento.

**Props:**
- `isOpen: boolean`
- `onClose: () => void`
- `cartItems: CartItem[]`
- `total: number`
- `onPaymentComplete: () => void`

#### Clientes (`src/features/clients/components/`)

##### `ClientList`
Lista de clientes.

**Props:**
- `clients: Client[]`
- `onSelectClient: (client) => void`
- `onEditClient: (client) => void`

##### `ClientDialog`
Modal para criar/editar cliente.

**Props:**
- `isOpen: boolean`
- `onClose: () => void`
- `selectedClient?: Client`
- `onSave: (data) => void`

**Seções:**
- Dados pessoais
- Contato
- Preferências de notificação

##### `AnamnesisForm`
Formulário de anamnese médica.

**Props:**
- `clientId: string`
- `initialData?: Anamnesis`
- `onSave: (data) => void`

#### Agendamentos (`src/features/appointments/components/`)

##### `AppointmentList`
Lista de agendamentos.

**Props:**
- `appointments: Appointment[]`
- `onEdit: (appointment) => void`
- `onDelete: (id) => void`

##### `AppointmentForm`
Formulário de agendamento.

**Props:**
- `selectedAppointment?: Appointment`
- `onSave: (data) => void`
- `onCancel: () => void`

### Hooks Customizados

#### `useInventory`
Hook para gerenciar estado do inventário.

**Retorna:**
- `inventoryItems` - Lista de itens
- `filteredInventory` - Itens filtrados
- `isLoading` - Estado de carregamento
- `handleAddItem` - Adicionar item
- `handleEditItem` - Editar item
- `handleSaveItem` - Salvar item

#### `usePOSState`
Hook para estado do PDV.

**Retorna:**
- `cartItems` - Itens no carrinho
- `total` - Total do carrinho
- `addToCart` - Adicionar ao carrinho
- `removeFromCart` - Remover do carrinho
- `clearCart` - Limpar carrinho

#### `useAppointments`
Hook para agendamentos.

**Retorna:**
- `appointments` - Lista de agendamentos
- `createAppointment` - Criar agendamento
- `updateAppointment` - Atualizar agendamento
- `deleteAppointment` - Deletar agendamento

### Padrões de Desenvolvimento

#### Composição de Componentes
```tsx
// Componente composto
const InventoryDialog = () => (
  <Dialog>
    <DialogContent>
      <BasicInfoSection />
      <CommercialInfoSection />
      <JewelrySpecsSection />
      <FormActionsSection />
    </DialogContent>
  </Dialog>
)
```

#### Props Tipadas
```tsx
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  // implementação
}
```

#### Hooks com TanStack Query
```tsx
const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
      
      if (error) throw error
      return data
    }
  })
}
```

#### Error Boundaries
```tsx
const ErrorBoundary = ({ children }) => {
  // implementação de error boundary
}
```

### Estilização

#### Tailwind Classes Comuns
```css
/* Cards */
.card-base {
  @apply bg-white rounded-lg shadow-sm border border-gray-200;
}

/* Botões */
.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white;
}

/* Inputs */
.input-base {
  @apply border border-gray-300 rounded-md px-3 py-2;
}
```

#### Variantes de Componentes
```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-input bg-background",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
      },
    },
  }
)
```

### Testes

#### Testes de Componente
```tsx
import { render, screen } from '@testing-library/react'
import { ProductCard } from './ProductCard'

test('renders product information', () => {
  const product = {
    name: 'Test Product',
    price: 50,
    stock: 10
  }
  
  render(<ProductCard product={product} onAddToCart={jest.fn()} />)
  
  expect(screen.getByText('Test Product')).toBeInTheDocument()
  expect(screen.getByText('R$ 50.00')).toBeInTheDocument()
})
```

#### Testes de Hook
```tsx
import { renderHook } from '@testing-library/react'
import { useInventory } from './useInventory'

test('loads inventory items', async () => {
  const { result } = renderHook(() => useInventory())
  
  await waitFor(() => {
    expect(result.current.inventoryItems).toBeDefined()
  })
})
```

### Performance

#### Lazy Loading
```tsx
const InventoryPage = lazy(() => import('./pages/Inventory'))

// Uso com Suspense
<Suspense fallback={<Loading />}>
  <InventoryPage />
</Suspense>
```

#### Memoização
```tsx
const ProductCard = memo(({ product, onAddToCart }) => {
  const handleClick = useCallback(() => {
    onAddToCart(product)
  }, [product, onAddToCart])
  
  return (
    <Card onClick={handleClick}>
      {/* conteúdo */}
    </Card>
  )
})
```

### Acessibilidade

#### ARIA Labels
```tsx
<Button 
  aria-label="Adicionar produto ao carrinho"
  onClick={() => onAddToCart(product)}
>
  <Plus className="h-4 w-4" />
</Button>
```

#### Navegação por Teclado
```tsx
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    onAddToCart(product)
  }
}
```

#### Screen Readers
```tsx
<div role="alert" aria-live="polite">
  {error && <span>Erro: {error.message}</span>}
</div>
```
