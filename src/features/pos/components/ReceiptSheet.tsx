
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
import { useAppSettings } from '@/context/AppSettingsContext';

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
  const { formatCurrency } = useAppSettings();

  if (!currentSale) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-md flex flex-col h-full">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-lg font-semibold">Comprovante de Venda</SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            Venda realizada com sucesso!
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="border-b pb-3">
            <p className="text-sm font-medium">Venda #{currentSale.id.slice(0, 8)}</p>
            <p className="text-xs text-muted-foreground">
              {currentSale.date.toLocaleDateString()} - {currentSale.date.toLocaleTimeString()}
            </p>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm font-medium">Itens:</p>
            <div className="space-y-2">
              {currentSale.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm py-1">
                  <div className="flex-1 pr-2">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-muted-foreground text-xs">
                      {item.quantity}x {formatCurrency(item.price)}
                    </div>
                  </div>
                  <div className="font-medium">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="border-t pt-3 space-y-2">
            <div className="flex justify-between font-semibold text-base">
              <div>Total</div>
              <div>{formatCurrency(currentSale.total)}</div>
            </div>
            <div className="flex justify-between text-sm">
              <div>Forma de Pagamento</div>
              <div className="font-medium">{currentSale.paymentMethod}</div>
            </div>
          </div>
        </div>
        
        <SheetFooter className="pt-4 mt-4 border-t">
          <div className="flex flex-col gap-2 w-full">
            <Button 
              onClick={onSendToWhatsApp}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Enviar via WhatsApp
            </Button>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => window.print()}
                className="flex-1"
              >
                <Printer className="mr-2 h-4 w-4" />
                Imprimir
              </Button>
              
              <Button 
                variant="outline" 
                onClick={onFinishSale}
                className="flex-1"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Finalizar
              </Button>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ReceiptSheet;
