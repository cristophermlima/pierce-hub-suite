
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CashRegister } from '../types';
import { useState } from 'react';

interface CashRegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenRegister: (initialAmount: number) => void;
  onCloseRegister: (data: { finalAmount: number; notes: string }) => void;
  currentRegister: CashRegister | null;
}

const CashRegisterDialog = ({
  open,
  onOpenChange,
  onOpenRegister,
  onCloseRegister,
  currentRegister,
}: CashRegisterDialogProps) => {
  const [initialAmount, setInitialAmount] = useState<number>(0);
  const [finalAmount, setFinalAmount] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');

  const handleOpenRegister = () => {
    onOpenRegister(initialAmount);
    onOpenChange(false);
  };

  const handleCloseRegister = () => {
    onCloseRegister({
      finalAmount: finalAmount,
      notes: notes
    });
    onOpenChange(false);
  };

  React.useEffect(() => {
    if (currentRegister?.isOpen) {
      setFinalAmount(currentRegister.currentAmount);
    } else {
      setInitialAmount(0);
      setFinalAmount(0);
      setNotes('');
    }
  }, [currentRegister, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {currentRegister?.isOpen ? 'Fechar Caixa' : 'Abrir Caixa'}
          </DialogTitle>
          <DialogDescription>
            {currentRegister?.isOpen 
              ? 'Insira o valor final e observações para fechar o caixa.'
              : 'Insira o valor inicial para abrir o caixa.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {currentRegister?.isOpen ? (
            <>
              <div className="grid gap-2">
                <Label htmlFor="finalAmount">Valor Final em Caixa</Label>
                <Input
                  id="finalAmount"
                  type="number"
                  value={finalAmount}
                  onChange={(e) => setFinalAmount(Number(e.target.value))}
                  min={0}
                  step={0.01}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Observações sobre o fechamento do caixa..."
                />
              </div>
              <div className="grid gap-2 mt-2">
                <p className="text-sm text-muted-foreground">
                  <strong>Valor inicial:</strong> R$ {currentRegister.initialAmount.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Total vendas:</strong> R$ {currentRegister.sales.reduce((acc, sale) => acc + sale.total, 0).toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Saldo esperado:</strong> R$ {currentRegister.currentAmount.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Diferença:</strong> R$ {(finalAmount - currentRegister.currentAmount).toFixed(2)}
                </p>
              </div>
            </>
          ) : (
            <div className="grid gap-2">
              <Label htmlFor="initialAmount">Valor Inicial em Caixa</Label>
              <Input
                id="initialAmount"
                type="number"
                value={initialAmount}
                onChange={(e) => setInitialAmount(Number(e.target.value))}
                min={0}
                step={0.01}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          {currentRegister?.isOpen ? (
            <Button onClick={handleCloseRegister}>Fechar Caixa</Button>
          ) : (
            <Button onClick={handleOpenRegister}>Abrir Caixa</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CashRegisterDialog;
