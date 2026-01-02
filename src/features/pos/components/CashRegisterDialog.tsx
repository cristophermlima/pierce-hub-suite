
import React, { useRef } from 'react';
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
import { Printer } from "lucide-react";
import { useState } from 'react';
import { useAppSettings } from '@/context/AppSettingsContext';
import CashRegisterCloseReport from './CashRegisterCloseReport';

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
  const [showReport, setShowReport] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const { formatCurrency } = useAppSettings();

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
    setShowReport(true);
  };

  const handlePrintReport = () => {
    const printContent = reportRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Relatório de Fechamento de Caixa</title>
          <style>
            body { font-family: monospace; padding: 20px; }
            .grid { display: grid; }
            .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
            .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
            .gap-1 { gap: 0.25rem; }
            .gap-2 { gap: 0.5rem; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .font-bold { font-weight: bold; }
            .text-xl { font-size: 1.25rem; }
            .text-sm { font-size: 0.875rem; }
            .text-xs { font-size: 0.75rem; }
            .mb-2, .mb-4, .mb-6 { margin-bottom: 1rem; }
            .mt-2, .mt-4, .mt-6 { margin-top: 1rem; }
            .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
            .pt-4 { padding-top: 1rem; }
            .pb-1 { padding-bottom: 0.25rem; }
            .border-t { border-top: 1px dashed #000; }
            .border-b { border-bottom: 1px dashed #000; }
            .border-dashed { border-style: dashed; }
            .text-red-600 { color: #dc2626; }
            .text-muted-foreground { color: #6b7280; }
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

  const handleFinish = () => {
    setShowReport(false);
    onOpenChange(false);
    // Reset form
    setInitialAmount(0);
    setFinalAmount(0);
    setNotes('');
    setCashier('');
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
    setShowReport(false);
  }, [currentRegister, open]);

  if (showReport && currentRegister) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Relatório de Fechamento</DialogTitle>
            <DialogDescription>
              Caixa fechado com sucesso. Confira o relatório abaixo.
            </DialogDescription>
          </DialogHeader>

          <CashRegisterCloseReport 
            ref={reportRef}
            register={{
              ...currentRegister,
              final_amount: finalAmount,
              difference: finalAmount - (currentRegister.currentAmount || 0),
              closed_at: new Date().toISOString()
            }}
            formatCurrency={formatCurrency}
          />

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handlePrintReport}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimir Relatório
            </Button>
            <Button onClick={handleFinish}>
              Concluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

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
                  <strong>Valor inicial:</strong> {formatCurrency(currentRegister.initial_amount)}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Total vendas:</strong> {formatCurrency(currentRegister.sales?.reduce((acc: number, sale: any) => acc + sale.total, 0) || 0)}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Saldo esperado:</strong> {formatCurrency(currentRegister.currentAmount || 0)}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Diferença:</strong> {formatCurrency(finalAmount - (currentRegister.currentAmount || 0))}
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
