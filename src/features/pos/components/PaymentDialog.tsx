
import React, { useState } from 'react';
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QrCode, CheckCircle2, CreditCard, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPayment: (paymentMethod: string, paymentDetails?: PaymentDetails) => Promise<void>;
  selectedClient: any;
  onClientChange: (client: any) => void;
}

export interface PaymentDetails {
  cardType?: 'credito' | 'debito';
  cardBrand?: string;
  receiptNumber?: string;
}

const PaymentDialog = ({ 
  open, 
  onOpenChange, 
  onPayment,
  selectedClient,
  onClientChange
}: PaymentDialogProps) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardType, setCardType] = useState<'credito' | 'debito'>('credito');
  const [cardBrand, setCardBrand] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePaymentMethodSelect = (method: string) => {
    setPaymentMethod(method);
    // Reset card fields when changing payment method
    if (method !== 'Cartão') {
      setCardType('credito');
      setCardBrand('');
      setReceiptNumber('');
    }
  };

  const handleProcessPayment = async () => {
    // Validate card payment fields
    if (paymentMethod === 'Cartão') {
      if (!receiptNumber.trim()) {
        return;
      }
    }

    setIsProcessing(true);
    try {
      const paymentDetails: PaymentDetails = paymentMethod === 'Cartão' ? {
        cardType,
        cardBrand: cardBrand || undefined,
        receiptNumber
      } : undefined;

      await onPayment(paymentMethod, paymentDetails);
      
      // Reset form
      setPaymentMethod('');
      setCardType('credito');
      setCardBrand('');
      setReceiptNumber('');
    } finally {
      setIsProcessing(false);
    }
  };

  const isCardPaymentValid = paymentMethod !== 'Cartão' || receiptNumber.trim() !== '';

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
              <CreditCard className="mr-2 h-4 w-4" />
              Cartão
            </Button>
            <Button
              variant={paymentMethod === 'Pix' ? 'default' : 'outline'}
              onClick={() => handlePaymentMethodSelect('Pix')}
              className="h-12"
            >
              Pix
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
            <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Pagamento realizado em maquininha externa. Este sistema apenas registra o pagamento.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <Label>Tipo do Cartão *</Label>
                <RadioGroup 
                  value={cardType} 
                  onValueChange={(value) => setCardType(value as 'credito' | 'debito')}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="credito" id="credito" />
                    <Label htmlFor="credito" className="cursor-pointer">Crédito</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="debito" id="debito" />
                    <Label htmlFor="debito" className="cursor-pointer">Débito</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="receiptNumber">Número do Comprovante *</Label>
                <Input
                  id="receiptNumber"
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value)}
                  placeholder="Digite o número do comprovante da maquininha"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardBrand">Bandeira do Cartão (opcional)</Label>
                <Select value={cardBrand} onValueChange={setCardBrand}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a bandeira" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visa">Visa</SelectItem>
                    <SelectItem value="mastercard">Mastercard</SelectItem>
                    <SelectItem value="elo">Elo</SelectItem>
                    <SelectItem value="amex">American Express</SelectItem>
                    <SelectItem value="hipercard">Hipercard</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
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
            disabled={!paymentMethod || !isCardPaymentValid || isProcessing}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            {isProcessing ? 'Processando...' : 'Confirmar Pagamento'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
