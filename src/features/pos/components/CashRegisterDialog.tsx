
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CashRegister } from '../types';

interface CashRegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenRegister: (amount: number) => void;
  onCloseRegister: (data: { finalAmount: number; notes: string }) => void;
  currentRegister: CashRegister | null;
}

const openCashSchema = z.object({
  initialAmount: z.coerce.number().min(0, "O valor inicial não pode ser negativo"),
  cashier: z.string().min(1, "Nome do operador é obrigatório"),
});

const closeCashSchema = z.object({
  finalAmount: z.coerce.number().min(0, "O valor final não pode ser negativo"),
  notes: z.string().optional(),
});

const CashRegisterDialog = ({ 
  open, 
  onOpenChange, 
  onOpenRegister, 
  onCloseRegister, 
  currentRegister 
}: CashRegisterDialogProps) => {
  const isOpening = !currentRegister?.isOpen;

  const openForm = useForm<z.infer<typeof openCashSchema>>({
    resolver: zodResolver(openCashSchema),
    defaultValues: {
      initialAmount: 0,
      cashier: "",
    },
  });

  const closeForm = useForm<z.infer<typeof closeCashSchema>>({
    resolver: zodResolver(closeCashSchema),
    defaultValues: {
      finalAmount: currentRegister?.currentAmount || 0,
      notes: "",
    },
  });

  const handleSubmitOpen = (data: z.infer<typeof openCashSchema>) => {
    onOpenRegister(data.initialAmount);
    onOpenChange(false);
  };

  const handleSubmitClose = (data: z.infer<typeof closeCashSchema>) => {
    onCloseRegister(data);
    onOpenChange(false);
  };

  // Atualiza o valor padrão do formulário de fechamento quando currentRegister muda
  React.useEffect(() => {
    if (!isOpening && currentRegister) {
      closeForm.setValue('finalAmount', currentRegister.currentAmount);
    }
  }, [currentRegister, isOpening, closeForm]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isOpening ? "Abrir Caixa" : "Fechar Caixa"}
          </DialogTitle>
          <DialogDescription>
            {isOpening 
              ? "Informe o valor inicial do caixa para começar as operações." 
              : "Confira o valor final do caixa e adicione observações se necessário."}
          </DialogDescription>
        </DialogHeader>
        
        {isOpening ? (
          <Form {...openForm}>
            <form onSubmit={openForm.handleSubmit(handleSubmitOpen)} className="space-y-4">
              <FormField
                control={openForm.control}
                name="cashier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Operador</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nome do operador" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={openForm.control}
                name="initialAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Inicial (R$)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" step="0.01" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Abrir Caixa</Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <Form {...closeForm}>
            <form onSubmit={closeForm.handleSubmit(handleSubmitClose)} className="space-y-4">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="initialAmount">Valor Inicial</Label>
                    <div className="p-2 bg-muted rounded mt-1">
                      R$ {currentRegister?.initialAmount.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="sales">Vendas</Label>
                    <div className="p-2 bg-muted rounded mt-1">
                      R$ {currentRegister?.sales.reduce((acc, sale) => acc + sale.total, 0).toFixed(2) || "0.00"}
                    </div>
                  </div>
                </div>
                
                <FormField
                  control={closeForm.control}
                  name="finalAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Final em Caixa (R$)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" step="0.01" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={closeForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Observações sobre o fechamento" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Fechar Caixa</Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CashRegisterDialog;
