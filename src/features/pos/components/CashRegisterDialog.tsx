
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
import { useState } from 'react';

interface CashRegister {
  id: string;
  cashier: string;
  initial_amount: number;
  final_amount?: number;
  difference?: number;
  isOpen: boolean;
  opened_at: string;
  closed_at?: string;
  sales?: any[];
  currentAmount?: number;
}

interface CashRegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenRegister: (cashier: string, initialAmount: number, notes?: string) => void;
  onCloseRegister: (finalAmount: number, notes?: string) => void;
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
  const [cashier, setCashier] = useState<string>('');

  const handleOpenRegister = () => {
    if (initialAmount <= 0) {
      alert('Por favor, insira um valor inicial válido');
      return;
    }
    if (!cashier.trim()) {
      alert('Por favor, insira o nome do operador');
      return;
    }
    onOpenRegister(cashier, initialAmount, notes);
    onOpenChange(false);
  };

  const handleCloseRegister = () => {
    onCloseRegister(finalAmount, notes);
    onOpenChange(false);
  };

  React.useEffect(() => {
    if (currentRegister?.isOpen) {
      setFinalAmount(currentRegister.currentAmount || 0);
    } else {
      setInitialAmount(0);
      setFinalAmount(0);
      setNotes('');
      setCashier('');
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
              : 'Insira o valor inicial e o operador para abrir o caixa.'}
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
                  <strong>Valor inicial:</strong> R$ {currentRegister.initial_amount.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Total vendas:</strong> R$ {(currentRegister.sales?.reduce((acc: number, sale: any) => acc + sale.total, 0) || 0).toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Saldo esperado:</strong> R$ {(currentRegister.currentAmount || 0).toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Diferença:</strong> R$ {(finalAmount - (currentRegister.currentAmount || 0)).toFixed(2)}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="grid gap-2">
                <Label htmlFor="cashier">Operador do Caixa</Label>
                <Input
                  id="cashier"
                  type="text"
                  value={cashier}
                  onChange={(e) => setCashier(e.target.value)}
                  placeholder="Nome do operador"
                />
              </div>
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
              <div className="grid gap-2">
                <Label htmlFor="notes">Observações (opcional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Observações sobre a abertura do caixa..."
                />
              </div>
            </>
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
