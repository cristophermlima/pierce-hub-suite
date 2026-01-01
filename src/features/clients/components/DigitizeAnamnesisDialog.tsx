
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Client } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Combobox } from '@/components/ui/combobox';

interface DigitizeAnamnesisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clients: Client[];
  onSuccess: () => void;
}

interface ExtractedData {
  address?: string;
  bloodPressure?: string;
  sleepHours?: string;
  medication?: string;
  whichMedication?: string;
  allergies?: string;
  otherHealthIssue?: string;
  mentalHealth?: string;
  anxiety?: string;
  depression?: string;
  panic?: string;
  applicationLocation?: string;
  jewel?: string;
  value?: string;
  observation?: string;
  epilepsy?: boolean;
  hemophilia?: boolean;
  diabetes?: boolean;
  heartDisease?: boolean;
  anemia?: boolean;
  keloid?: boolean;
  dst?: boolean;
  hepatitis?: boolean;
  dermatitis?: boolean;
  smoke?: boolean;
  alcohol?: boolean;
  drugs?: boolean;
  physicalActivity?: boolean;
}

export const DigitizeAnamnesisDialog = ({
  open,
  onOpenChange,
  clients,
  onSuccess
}: DigitizeAnamnesisDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [step, setStep] = useState<'upload' | 'review' | 'success'>('upload');

  const clientOptions = clients.map(c => ({ value: c.id, label: c.name }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('O arquivo deve ter no máximo 10MB');
        return;
      }
      setFile(selectedFile);
    }
  };

  const processWithOCR = async () => {
    if (!file || !selectedClientId) {
      toast.error('Selecione um arquivo e um cliente');
      return;
    }

    setIsProcessing(true);

    try {
      // Converter arquivo para base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]); // Remove data URL prefix
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Chamar edge function para processar OCR
      const { data, error } = await supabase.functions.invoke('process-anamnesis-ocr', {
        body: { 
          fileBase64: base64,
          fileType: file.type
        }
      });

      if (error) throw error;

      setExtractedData(data.extractedData || {});
      setStep('review');
    } catch (error: any) {
      console.error('Erro no OCR:', error);
      toast.error('Erro ao processar documento. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const saveAnamnesis = async () => {
    if (!selectedClientId || !extractedData) return;

    setIsProcessing(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Verificar se já existe anamnese para este cliente
      const { data: existing } = await supabase
        .from('anamnesis')
        .select('id')
        .eq('client_id', selectedClientId)
        .single();

      const anamnesisData = {
        client_id: selectedClientId,
        address: extractedData.address || null,
        blood_pressure: extractedData.bloodPressure || null,
        sleep_hours: extractedData.sleepHours || null,
        medication: extractedData.medication || null,
        which_medication: extractedData.whichMedication || null,
        allergies: extractedData.allergies || null,
        other_health_issue: extractedData.otherHealthIssue || null,
        mental_health: extractedData.mentalHealth || null,
        anxiety: extractedData.anxiety || null,
        depression: extractedData.depression || null,
        panic: extractedData.panic || null,
        application_location: extractedData.applicationLocation || null,
        jewel: extractedData.jewel || null,
        value: extractedData.value || null,
        observation: extractedData.observation || null,
        epilepsy: extractedData.epilepsy || false,
        hemophilia: extractedData.hemophilia || false,
        diabetes: extractedData.diabetes || false,
        heart_disease: extractedData.heartDisease || false,
        anemia: extractedData.anemia || false,
        keloid: extractedData.keloid || false,
        dst: extractedData.dst || false,
        hepatitis: extractedData.hepatitis || false,
        dermatitis: extractedData.dermatitis || false,
        smoke: extractedData.smoke || false,
        alcohol: extractedData.alcohol || false,
        drugs: extractedData.drugs || false,
        physical_activity: extractedData.physicalActivity || false
      };

      if (existing) {
        const { error } = await supabase
          .from('anamnesis')
          .update(anamnesisData)
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('anamnesis')
          .insert(anamnesisData);

        if (error) throw error;
      }

      setStep('success');
      toast.success('Anamnese digitalizada com sucesso!');
      onSuccess();
    } catch (error: any) {
      console.error('Erro ao salvar:', error);
      toast.error('Erro ao salvar anamnese');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetDialog = () => {
    setFile(null);
    setSelectedClientId('');
    setExtractedData(null);
    setStep('upload');
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      resetDialog();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Digitalizar Ficha de Anamnese
          </DialogTitle>
          <DialogDescription>
            Envie uma foto ou PDF da ficha preenchida em papel para extrair os dados automaticamente.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[65vh]">
          {step === 'upload' && (
            <div className="space-y-4 p-1">
              <Alert>
                <AlertDescription>
                  As imagens não serão armazenadas — apenas os dados extraídos serão salvos no sistema.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label>Selecione o Cliente</Label>
                <Combobox
                  options={clientOptions}
                  value={selectedClientId}
                  onChange={setSelectedClientId}
                  placeholder="Buscar cliente..."
                />
              </div>

              <div className="space-y-2">
                <Label>Arquivo da Ficha</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  {file ? (
                    <div className="space-y-2">
                      <FileText className="h-10 w-10 mx-auto text-primary" />
                      <p className="text-sm font-medium">{file.name}</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setFile(null)}
                      >
                        Remover
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Clique para selecionar ou arraste o arquivo
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Formatos aceitos: JPG, PNG, PDF (máx. 10MB)
                      </p>
                      <Input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  )}
                </div>
              </div>

              <Button 
                className="w-full" 
                onClick={processWithOCR}
                disabled={!file || !selectedClientId || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  'Processar Documento'
                )}
              </Button>
            </div>
          )}

          {step === 'review' && extractedData && (
            <div className="space-y-4 p-1">
              <Alert className="border-yellow-500 bg-yellow-50">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  Revise os dados extraídos antes de salvar. Alguns campos podem precisar de correção manual.
                </AlertDescription>
              </Alert>

              <div className="grid gap-3 text-sm">
                <div>
                  <span className="font-medium">Endereço:</span> {extractedData.address || 'Não identificado'}
                </div>
                <div>
                  <span className="font-medium">Local de aplicação:</span> {extractedData.applicationLocation || 'Não identificado'}
                </div>
                <div>
                  <span className="font-medium">Joia:</span> {extractedData.jewel || 'Não identificado'}
                </div>
                <div>
                  <span className="font-medium">Valor:</span> {extractedData.value || 'Não identificado'}
                </div>
                <div>
                  <span className="font-medium">Observações:</span> {extractedData.observation || 'Não identificado'}
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setStep('upload')}
                >
                  Voltar
                </Button>
                <Button 
                  className="flex-1"
                  onClick={saveAnamnesis}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar Anamnese'
                  )}
                </Button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8 space-y-4">
              <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
              <h3 className="text-lg font-semibold">Anamnese Salva com Sucesso!</h3>
              <p className="text-muted-foreground">
                Os dados foram extraídos e salvos no cadastro do cliente.
              </p>
              <Button onClick={() => handleClose(false)}>
                Fechar
              </Button>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
