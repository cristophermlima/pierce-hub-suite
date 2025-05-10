
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QrCode, CheckCircle2 } from "lucide-react";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentMethod: string;
  total: number;
  onProcessPayment: () => void;
}

const PaymentDialog = ({ 
  open, 
  onOpenChange, 
  paymentMethod, 
  total, 
  onProcessPayment 
}: PaymentDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Finalizar Pagamento - {paymentMethod}</DialogTitle>
          <DialogDescription>
            Valor total: R$ {total.toFixed(2)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {paymentMethod === 'Pix' ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="bg-white p-4 rounded-md">
                <QrCode size={180} className="text-black" />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Escaneie o código QR com o aplicativo do seu banco para realizar o pagamento via Pix
              </p>
            </div>
          ) : paymentMethod === 'Cartão de Crédito' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm font-medium">Número do Cartão</label>
                  <Input placeholder="0000 0000 0000 0000" />
                </div>
                <div>
                  <label className="text-sm font-medium">Validade</label>
                  <Input placeholder="MM/AA" />
                </div>
                <div>
                  <label className="text-sm font-medium">CVV</label>
                  <Input placeholder="000" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium">Nome no Cartão</label>
                  <Input placeholder="Nome como aparece no cartão" />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Valor total:</span>
                <span className="font-bold">R$ {total.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Valor recebido:</span>
                <Input 
                  type="number" 
                  placeholder="0.00" 
                  className="w-24 text-right" 
                  defaultValue={total.toFixed(2)}
                />
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button type="button" onClick={onProcessPayment}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Confirmar Pagamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
