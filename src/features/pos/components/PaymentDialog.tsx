
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
  onPayment: (paymentMethod: string, clientData?: any) => Promise<void>;
  selectedClient: any;
  onClientChange: (client: any) => void;
}

const PaymentDialog = ({ 
  open, 
  onOpenChange, 
  onPayment,
  selectedClient,
  onClientChange
}: PaymentDialogProps) => {
  const [paymentMethod, setPaymentMethod] = React.useState('');
  const [total, setTotal] = React.useState(0);

  const handlePaymentMethodSelect = (method: string) => {
    setPaymentMethod(method);
  };

  const handleProcessPayment = async () => {
    await onPayment(paymentMethod);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Finalizar Pagamento</DialogTitle>
          <DialogDescription>
            Selecione a forma de pagamento
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={paymentMethod === 'Dinheiro' ? 'default' : 'outline'}
              onClick={() => handlePaymentMethodSelect('Dinheiro')}
              className="h-12"
            >
              Dinheiro
            </Button>
            <Button
              variant={paymentMethod === 'Cartão' ? 'default' : 'outline'}
              onClick={() => handlePaymentMethodSelect('Cartão')}
              className="h-12"
            >
              Cartão
            </Button>
            <Button
              variant={paymentMethod === 'Pix' ? 'default' : 'outline'}
              onClick={() => handlePaymentMethodSelect('Pix')}
              className="h-12"
            >
              Pix
            </Button>
            <Button
              variant={paymentMethod === 'Crédito' ? 'default' : 'outline'}
              onClick={() => handlePaymentMethodSelect('Crédito')}
              className="h-12"
            >
              Crédito
            </Button>
          </div>

          {paymentMethod === 'Pix' && (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="bg-white p-4 rounded-md">
                <QrCode size={180} className="text-black" />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Escaneie o código QR com o aplicativo do seu banco
              </p>
            </div>
          )}

          {paymentMethod === 'Cartão' && (
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
          <Button 
            type="button" 
            onClick={handleProcessPayment}
            disabled={!paymentMethod}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Confirmar Pagamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
