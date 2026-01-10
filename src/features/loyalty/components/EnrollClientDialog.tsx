import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Loader2, UserPlus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useClientLoyalty } from '../hooks/useClientLoyalty';
import { useLoyaltyPlans } from '../hooks/useLoyaltyPlans';
import { useTranslation } from '@/hooks/useTranslation';

interface EnrollClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedPlanId?: string;
}

export function EnrollClientDialog({ open, onOpenChange, preselectedPlanId }: EnrollClientDialogProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedPlanId, setSelectedPlanId] = useState<string>(preselectedPlanId || '');
  
  const { enrollClient, isEnrolling, getClientEnrollments } = useClientLoyalty();
  const { plans } = useLoyaltyPlans();

  const { data: clients = [], isLoading: loadingClients } = useQuery({
    queryKey: ['clients-for-loyalty', searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('clients')
        .select('id, name, phone, email, visits')
        .order('name');

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query.limit(20);
      if (error) throw error;
      return data || [];
    },
    enabled: open
  });

  const activePlans = plans.filter(p => p.active);

  const handleEnroll = () => {
    if (!selectedClientId || !selectedPlanId) return;

    enrollClient(
      { clientId: selectedClientId, planId: selectedPlanId },
      {
        onSuccess: () => {
          setSelectedClientId('');
          setSelectedPlanId(preselectedPlanId || '');
          setSearchQuery('');
          onOpenChange(false);
        }
      }
    );
  };

  // Verificar se cliente já está matriculado no plano selecionado
  const isAlreadyEnrolled = (clientId: string) => {
    if (!selectedPlanId) return false;
    const enrollments = getClientEnrollments(clientId);
    return enrollments.some(e => e.plan_id === selectedPlanId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Matricular Cliente
          </DialogTitle>
          <DialogDescription>
            Vincule um cliente a um plano de fidelidade
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Seleção do Plano */}
          <div className="space-y-2">
            <Label>Plano de Fidelidade</Label>
            <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um plano" />
              </SelectTrigger>
              <SelectContent>
                {activePlans.map(plan => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Busca de Cliente */}
          <div className="space-y-2">
            <Label>{t('searchClient')}</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Nome, telefone ou email..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Lista de Clientes */}
          <div className="border rounded-md max-h-48 overflow-y-auto">
            {loadingClients ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm text-muted-foreground">{t('loading')}</span>
              </div>
            ) : clients.length === 0 ? (
              <div className="text-center p-4 text-sm text-muted-foreground">
                {t('noClientsFound')}
              </div>
            ) : (
              <div className="divide-y">
                {clients.map(client => {
                  const alreadyEnrolled = isAlreadyEnrolled(client.id);
                  return (
                    <button
                      key={client.id}
                      type="button"
                      disabled={alreadyEnrolled}
                      onClick={() => setSelectedClientId(client.id)}
                      className={`w-full text-left p-3 hover:bg-muted/50 transition-colors ${
                        selectedClientId === client.id ? 'bg-primary/10 border-l-2 border-primary' : ''
                      } ${alreadyEnrolled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="font-medium text-sm">{client.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {client.phone} • {client.visits || 0} visitas
                        {alreadyEnrolled && (
                          <span className="ml-2 text-amber-600">
                            (já matriculado)
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Botão de Ação */}
          <Button
            onClick={handleEnroll}
            disabled={!selectedClientId || !selectedPlanId || isEnrolling}
            className="w-full"
          >
            {isEnrolling ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Matriculando...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Matricular no Plano
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
