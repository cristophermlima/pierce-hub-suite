
import React, { useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  onSendToWhatsApp,
}: ReceiptSheetProps) => {
  const { formatCurrency } = useAppSettings();
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!currentSale) return null;

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleFinish = () => {
    onFinishSale();
    onOpenChange(false);
  };

  const handlePrint = () => {
    const printContent = receiptRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Comprovante de Venda</title>
          <style>
            body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; padding: 20px; }
            .text-muted-foreground { color: #6b7280; }
            .font-medium { font-weight: 500; }
            .font-semibold { font-weight: 600; }
            .border-b { border-bottom: 1px solid #e5e7eb; }
            .border-t { border-top: 1px solid #e5e7eb; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Comprovante de Venda</DialogTitle>
          <DialogDescription>Venda realizada com sucesso!</DialogDescription>
        </DialogHeader>

        <div ref={receiptRef} className="space-y-4">
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
                  <div className="font-medium">{formatCurrency(item.price * item.quantity)}</div>
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

        <DialogFooter className="flex-col sm:flex-col gap-2">
          <div className="flex w-full gap-2">
            <Button variant="outline" onClick={handlePrint} className="flex-1">
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
            <Button onClick={onSendToWhatsApp} className="flex-1">
              <Share2 className="mr-2 h-4 w-4" />
              WhatsApp
            </Button>
          </div>

          <div className="flex w-full gap-2">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Fechar
            </Button>
            <Button onClick={handleFinish} className="flex-1">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Finalizar Venda
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptSheet;

