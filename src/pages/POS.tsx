
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCartState } from "@/features/pos/hooks/useCartState";
import { useInventory } from "@/features/inventory/hooks/useInventory";
import { useCashRegister } from "@/features/pos/hooks/useCashRegister";
import { usePaymentProcessing } from "@/features/pos/hooks/usePaymentProcessing";
import ProductCard from "@/features/pos/components/ProductCard";
import Cart from "@/features/pos/components/Cart";
import CashRegisterDialog from "@/features/pos/components/CashRegisterDialog";
import ReceiptSheet from "@/features/pos/components/ReceiptSheet";
import { useToast } from "@/components/ui/use-toast";

const categoriesTabs = [
  { label: "Todos", value: "all" },
  { label: "Joias", value: "jewelry" },
  { label: "Cuidados", value: "care" },
  { label: "Serviços", value: "services" },
  { label: "Acessórios", value: "accessories" },
];

const getCategoryType = (product) => {
  if (!product.category) return "";
  const name = product.category.name?.toLocaleLowerCase() || "";
  if (name.includes("joia")) return "jewelry";
  if (name.includes("cuidad")) return "care";
  if (name.includes("servi")) return "services";
  if (name.includes("acess")) return "accessories";
  return "all";
};

const POS = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const { toast } = useToast();

  // Hooks do sistema
  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart } =
    useCartState();
  const { inventoryItems } = useInventory();
  const { 
    cashRegister, 
    cashRegisterDialogOpen, 
    setCashRegisterDialogOpen, 
    handleOpenCashRegister, 
    handleCloseCashRegister 
  } = useCashRegister();
  const {
    paymentDialogOpen,
    setPaymentDialogOpen,
    receiptOpen,
    setReceiptOpen,
    paymentMethod,
    setPaymentMethod,
    currentSale,
    handlePaymentClick,
    processPayment,
    finishSale,
    sendToWhatsApp,
  } = usePaymentProcessing();

  // Verificação de caixa aberto ao carregar a página
  useEffect(() => {
    if (!cashRegister?.isOpen) {
      toast({
        title: "Caixa fechado",
        description: "É necessário abrir o caixa para usar o POS.",
        variant: "destructive",
      });
      setCashRegisterDialogOpen(true);
    }
  }, [cashRegister?.isOpen, setCashRegisterDialogOpen, toast]);

  // Total do carrinho
  const total = cartItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  // Filtrar produtos
  const products = (inventoryItems || [])
    .filter((prod) => {
      // Filtro por tab
      if (activeTab === "all") return true;
      const type = getCategoryType(prod);
      return type === activeTab;
    })
    .filter((prod) =>
      prod.name?.toLowerCase().includes(search.toLowerCase())
    );

  // Handler para pagamento
  const handlePayment = (method: string) => {
    if (!cashRegister?.isOpen) {
      toast({
        title: "Caixa fechado",
        description: "É necessário abrir o caixa para processar vendas.",
        variant: "destructive",
      });
      setCashRegisterDialogOpen(true);
      return;
    }
    setPaymentMethod(method);
    handlePaymentClick(method, cashRegister) && processPayment(cartItems, total, () => clearCart());
  };

  // Fechar caixa
  const handleCloseCash = () => setCashRegisterDialogOpen(true);

  // Wrapper para updateQuantity que aceita apenas dois parâmetros
  const handleUpdateQuantity = (productId: number, quantity: number) => {
    updateQuantity(productId, quantity);
  };

  // Bloquear interface se caixa não estiver aberto
  const isCashRegisterClosed = !cashRegister?.isOpen;

  return (
    <div className="min-h-screen flex flex-row bg-black text-white">
      <div className="flex-1 p-0 flex flex-col">
        {/* Header */}
        <header className="pt-3 pb-2 px-8 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">Ponto de Venda</h2>
            {isCashRegisterClosed && (
              <p className="text-red-400 text-sm">⚠️ Caixa fechado - Abra o caixa para usar o sistema</p>
            )}
          </div>
          <div className="flex gap-2">
            {cashRegister?.isOpen && (
              <div className="text-sm text-green-400 mr-4">
                ✅ Caixa Aberto - {cashRegister.cashier}
              </div>
            )}
            <Button
              className="bg-neutral-900 text-white border border-neutral-700 rounded py-2 px-5 font-medium hover:bg-neutral-800"
              onClick={handleCloseCash}
            >
              {cashRegister?.isOpen ? 'Fechar Caixa' : 'Abrir Caixa'}
            </Button>
          </div>
        </header>

        {/* Overlay quando caixa fechado */}
        <div className={`flex-1 ${isCashRegisterClosed ? 'opacity-50 pointer-events-none' : ''}`}>
          {/* Tabs/categorias e busca */}
          <div className="px-8 pb-6 flex flex-row items-center gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-row items-center gap-4">
              <TabsList className="bg-neutral-900 rounded-lg h-10 mr-4 w-fit">
                {categoriesTabs.map((cat) => (
                  <TabsTrigger
                    key={cat.value}
                    value={cat.value}
                    className="!text-white !font-semibold data-[state=active]:bg-neutral-800 data-[state=active]:text-white px-4 py-2 transition"
                  >
                    {cat.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <div className="ml-4 flex-1">
                <Input
                  className="w-full bg-neutral-900 border border-neutral-700 text-white placeholder:text-neutral-400 rounded px-4 py-2"
                  placeholder="Buscar produtos..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </Tabs>
          </div>
          
          {/* Products */}
          <div className="flex-1 px-8">
            <Tabs value={activeTab}>
              <TabsContent value={activeTab}>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={addToCart}
                    />
                  ))}
                </div>
                {products.length === 0 && (
                  <div className="w-full text-center py-24 text-neutral-400">
                    Nenhum produto encontrado
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* Cart */}
      <aside className={`w-full max-w-lg bg-neutral-900 shadow-xl border-l border-neutral-800 flex flex-col justify-between min-h-screen ${isCashRegisterClosed ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="p-8 pb-0">
          <h3 className="text-xl font-bold flex items-center gap-3">
            Carrinho
            {cartItems.length > 0 && (
              <span className="ml-2 inline-flex items-center justify-center bg-neutral-800 rounded-full w-6 h-6 text-xs font-bold">{cartItems.length}</span>
            )}
          </h3>
          <div className="py-4">
            <Cart
              cartItems={cartItems}
              selectedClient={selectedClient}
              onClientSelect={setSelectedClient}
              onRemoveFromCart={removeFromCart}
              onUpdateQuantity={handleUpdateQuantity}
              onPayment={handlePayment}
            />
          </div>
        </div>
      </aside>
      
      {/* Modal de Caixa */}
      <CashRegisterDialog
        open={cashRegisterDialogOpen}
        onOpenChange={setCashRegisterDialogOpen}
        onOpenRegister={handleOpenCashRegister}
        onCloseRegister={handleCloseCashRegister}
        currentRegister={cashRegister}
      />
      
      {/* Comprovante Venda */}
      <ReceiptSheet
        open={receiptOpen}
        onOpenChange={setReceiptOpen}
        currentSale={currentSale}
        onFinishSale={() => finishSale(clearCart)}
        onSendToWhatsApp={sendToWhatsApp}
      />
    </div>
  );
};

export default POS;
