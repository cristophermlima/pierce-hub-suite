import React, { forwardRef } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CashRegisterCloseReportProps {
  register: {
    id: string;
    cashier: string;
    initial_amount: number;
    final_amount?: number;
    difference?: number;
    opened_at: string;
    closed_at?: string;
    sales?: any[];
    currentAmount?: number;
  };
  formatCurrency: (value: number) => string;
}

const CashRegisterCloseReport = forwardRef<HTMLDivElement, CashRegisterCloseReportProps>(
  ({ register, formatCurrency }, ref) => {
    const totalSales = register.sales?.reduce((acc, sale) => acc + sale.total, 0) || 0;
    const salesCount = register.sales?.length || 0;
    
    // Group sales by payment method
    const salesByPaymentMethod = register.sales?.reduce((acc, sale) => {
      const method = sale.payment_method || 'Outros';
      if (!acc[method]) {
        acc[method] = { count: 0, total: 0 };
      }
      acc[method].count += 1;
      acc[method].total += sale.total;
      return acc;
    }, {} as Record<string, { count: number; total: number }>) || {};

    // Group by card type if applicable
    const cardSales = register.sales?.filter(s => s.payment_method === 'Cartão') || [];
    const creditSales = cardSales.filter(s => s.card_type === 'credito');
    const debitSales = cardSales.filter(s => s.card_type === 'debito');

    return (
      <div ref={ref} className="p-8 bg-white text-black print:p-4" style={{ fontFamily: 'monospace' }}>
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold">RELATÓRIO DE FECHAMENTO DE CAIXA</h1>
          <p className="text-sm">PiercerHub - Sistema de Gestão</p>
        </div>

        <div className="border-t border-b border-dashed py-4 mb-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span>Operador:</span>
            <span className="font-bold">{register.cashier}</span>
            
            <span>Abertura:</span>
            <span>{format(new Date(register.opened_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
            
            <span>Fechamento:</span>
            <span>{register.closed_at ? format(new Date(register.closed_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) : 'Agora'}</span>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="font-bold mb-2 border-b pb-1">RESUMO FINANCEIRO</h2>
          <div className="grid grid-cols-2 gap-1 text-sm">
            <span>Valor Inicial:</span>
            <span className="text-right">{formatCurrency(register.initial_amount)}</span>
            
            <span>Total de Vendas:</span>
            <span className="text-right">{formatCurrency(totalSales)}</span>
            
            <span className="font-bold">Saldo Esperado:</span>
            <span className="text-right font-bold">{formatCurrency(register.currentAmount || 0)}</span>
            
            {register.final_amount !== undefined && (
              <>
                <span>Valor Final Informado:</span>
                <span className="text-right">{formatCurrency(register.final_amount)}</span>
                
                <span className={`font-bold ${(register.difference || 0) < 0 ? 'text-red-600' : ''}`}>
                  Diferença:
                </span>
                <span className={`text-right font-bold ${(register.difference || 0) < 0 ? 'text-red-600' : ''}`}>
                  {formatCurrency(register.difference || 0)}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="mb-4">
          <h2 className="font-bold mb-2 border-b pb-1">VENDAS POR FORMA DE PAGAMENTO</h2>
          <div className="text-sm">
            {Object.entries(salesByPaymentMethod).map(([method, data]) => {
              const typedData = data as { count: number; total: number };
              return (
                <div key={method} className="grid grid-cols-3 gap-1">
                  <span>{method}:</span>
                  <span className="text-center">{typedData.count} venda(s)</span>
                  <span className="text-right">{formatCurrency(typedData.total)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {cardSales.length > 0 && (
          <div className="mb-4">
            <h2 className="font-bold mb-2 border-b pb-1">DETALHAMENTO CARTÃO</h2>
            <div className="text-sm">
              <div className="grid grid-cols-3 gap-1">
                <span>Crédito:</span>
                <span className="text-center">{creditSales.length} venda(s)</span>
                <span className="text-right">{formatCurrency(creditSales.reduce((acc, s) => acc + s.total, 0))}</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <span>Débito:</span>
                <span className="text-center">{debitSales.length} venda(s)</span>
                <span className="text-right">{formatCurrency(debitSales.reduce((acc, s) => acc + s.total, 0))}</span>
              </div>
            </div>
          </div>
        )}

        <div className="mb-4">
          <h2 className="font-bold mb-2 border-b pb-1">ESTATÍSTICAS</h2>
          <div className="grid grid-cols-2 gap-1 text-sm">
            <span>Total de Vendas:</span>
            <span className="text-right">{salesCount}</span>
            
            <span>Ticket Médio:</span>
            <span className="text-right">{formatCurrency(salesCount > 0 ? totalSales / salesCount : 0)}</span>
          </div>
        </div>

        <div className="border-t border-dashed pt-4 mt-6 text-center text-xs text-gray-500">
          <p>Documento gerado em {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
          <p>PiercerHub - www.piercerhub.com</p>
        </div>
      </div>
    );
  }
);

CashRegisterCloseReport.displayName = 'CashRegisterCloseReport';

export default CashRegisterCloseReport;
