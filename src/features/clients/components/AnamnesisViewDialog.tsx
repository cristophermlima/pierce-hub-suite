import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Client } from '../types';

interface AnamnesisViewDialogProps {
  client: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AnamnesisViewDialog = ({ 
  client, 
  open, 
  onOpenChange 
}: AnamnesisViewDialogProps) => {
  if (!client?.anamnesis) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Ficha de Anamnese</DialogTitle>
            <DialogDescription>
              Este cliente ainda não possui ficha de anamnese preenchida.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const anamnesis = client.anamnesis;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Ficha de Anamnese - {client.name}</DialogTitle>
          <DialogDescription>
            Visualização completa da ficha de anamnese
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[65vh] pr-4">
          <div className="space-y-6">
            {/* Dados Pessoais */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Dados Pessoais</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Data de Nascimento:</span>{' '}
                  {anamnesis.birthDate ? new Date(anamnesis.birthDate).toLocaleDateString('pt-BR') : 'Não informado'}
                </div>
                <div>
                  <span className="font-medium">Endereço:</span>{' '}
                  {anamnesis.address || 'Não informado'}
                </div>
              </div>
            </div>

            <Separator />

            {/* Histórico de Saúde */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Histórico de Saúde</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Epilepsia: <span className="font-medium">{anamnesis.epilepsy ? 'Sim' : 'Não'}</span></div>
                <div>Hemofilia: <span className="font-medium">{anamnesis.hemophilia ? 'Sim' : 'Não'}</span></div>
                <div>Diabetes: <span className="font-medium">{anamnesis.diabetes ? 'Sim' : 'Não'}</span></div>
                <div>Doença Cardíaca: <span className="font-medium">{anamnesis.heartDisease ? 'Sim' : 'Não'}</span></div>
                <div>Anemia: <span className="font-medium">{anamnesis.anemia ? 'Sim' : 'Não'}</span></div>
                <div>Quelóide: <span className="font-medium">{anamnesis.keloid ? 'Sim' : 'Não'}</span></div>
                <div>DST: <span className="font-medium">{anamnesis.dst ? 'Sim' : 'Não'}</span></div>
                <div>Hepatite: <span className="font-medium">{anamnesis.hepatitis ? 'Sim' : 'Não'}</span></div>
                <div>Dermatite: <span className="font-medium">{anamnesis.dermatitis ? 'Sim' : 'Não'}</span></div>
              </div>
              {anamnesis.otherHealthIssue && (
                <div className="mt-3 text-sm">
                  <span className="font-medium">Outros problemas de saúde:</span>
                  <p className="mt-1 text-muted-foreground">{anamnesis.otherHealthIssue}</p>
                </div>
              )}
              {anamnesis.allergies && (
                <div className="mt-3 text-sm">
                  <span className="font-medium">Alergias:</span>
                  <p className="mt-1 text-muted-foreground">{anamnesis.allergies}</p>
                </div>
              )}
            </div>

            <Separator />

            {/* Estilo de Vida */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Estilo de Vida</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Atividade Física: <span className="font-medium">{anamnesis.physicalActivity ? 'Sim' : 'Não'}</span></div>
                <div>Álcool: <span className="font-medium">{anamnesis.alcohol ? 'Sim' : 'Não'}</span></div>
                <div>Tabagismo: <span className="font-medium">{anamnesis.smoke ? 'Sim' : 'Não'}</span></div>
                <div>Drogas: <span className="font-medium">{anamnesis.drugs ? 'Sim' : 'Não'}</span></div>
              </div>
              <div className="mt-3 space-y-2 text-sm">
                <div>
                  <span className="font-medium">Refeições adequadas:</span> {anamnesis.goodMeals || 'Não informado'}
                </div>
                <div>
                  <span className="font-medium">Qualidade das refeições:</span> {anamnesis.mealQuality || 'Não informado'}
                </div>
                <div>
                  <span className="font-medium">Horas de sono:</span> {anamnesis.sleepHours || 'Não informado'}
                </div>
              </div>
            </div>

            <Separator />

            {/* Medicamentos */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Medicamentos</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Usa medicamentos:</span> {anamnesis.medication || 'Não informado'}
                </div>
                {anamnesis.whichMedication && (
                  <div>
                    <span className="font-medium">Quais medicamentos:</span>
                    <p className="mt-1 text-muted-foreground">{anamnesis.whichMedication}</p>
                  </div>
                )}
                <div>
                  <span className="font-medium">Pressão arterial:</span> {anamnesis.bloodPressure || 'Não informado'}
                </div>
              </div>
            </div>

            <Separator />

            {/* Saúde Mental */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Saúde Mental</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Saúde mental:</span> {anamnesis.mentalHealth || 'Não informado'}
                </div>
                <div>
                  <span className="font-medium">Ansiedade:</span> {anamnesis.anxiety || 'Não informado'}
                </div>
                <div>
                  <span className="font-medium">Depressão:</span> {anamnesis.depression || 'Não informado'}
                </div>
                <div>
                  <span className="font-medium">Pânico:</span> {anamnesis.panic || 'Não informado'}
                </div>
              </div>
            </div>

            <Separator />

            {/* Informações do Procedimento */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Informações do Procedimento</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Local de aplicação:</span> {anamnesis.applicationLocation || 'Não informado'}
                </div>
                <div>
                  <span className="font-medium">Joia:</span> {anamnesis.jewel || 'Não informado'}
                </div>
                <div>
                  <span className="font-medium">Valor:</span> {anamnesis.value || 'Não informado'}
                </div>
                {anamnesis.observation && (
                  <div>
                    <span className="font-medium">Observações:</span>
                    <p className="mt-1 text-muted-foreground">{anamnesis.observation}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
