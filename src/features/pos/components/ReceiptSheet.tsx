
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Printer, Share2 } from "lucide-react";
import { Sale } from '../types';

interface ReceiptSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSale: Sale | null;
  onFinishSale: () => void;
  onSendToWhatsApp: () => void;
}

const ReceiptSheet = ({ 
  open, 
  onOpenChange, 
  currentSale, 
  onFinishSale, 
  onSendToWhatsApp 
}: ReceiptSheetProps) => {
  if (!currentSale) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="min-w-[400px]">
        <SheetHeader>
          <SheetTitle>Comprovante de Venda</SheetTitle>
          <SheetDescription>
            Venda realizada com sucesso!
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-4 space-y-4">
          <div className="border-b pb-2">
            <p className="text-sm font-medium">Venda #{currentSale.id}</p>
            <p className="text-xs text-muted-foreground">
              {currentSale.date.toLocaleDateString()} - {currentSale.date.toLocaleTimeString()}
            </p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">Itens:</p>
            {currentSale.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <div>
                  {item.name} <span className="text-muted-foreground">x{item.quantity}</span>
                </div>
                <div>R$ {(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-2">
            <div className="flex justify-between font-medium">
              <div>Total</div>
              <div>R$ {currentSale.total.toFixed(2)}</div>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <div>Forma de Pagamento</div>
              <div>{currentSale.paymentMethod}</div>
            </div>
          </div>
        </div>
        
        <SheetFooter className="flex flex-col gap-2 sm:flex-row mt-6">
          <Button variant="outline" onClick={onFinishSale}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Finalizar
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button onClick={onSendToWhatsApp}>
            <Share2 className="mr-2 h-4 w-4" />
            Enviar via WhatsApp
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ReceiptSheet;
