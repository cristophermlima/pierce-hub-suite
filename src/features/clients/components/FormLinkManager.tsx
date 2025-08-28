import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Copy, ExternalLink, Link, Users } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Client } from '../types';
import { generateFormToken } from '../services/clientFormService';
import { generateShareableLink } from '../utils/clientUtils';

interface FormLinkManagerProps {
  clients: Client[];
}

export const FormLinkManager = ({ clients }: FormLinkManagerProps) => {
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [generatedLink, setGeneratedLink] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateLink = async () => {
    if (!selectedClientId) {
      toast({
        title: "Erro",
        description: "Selecione um cliente primeiro",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const token = await generateFormToken(selectedClientId);
      if (token) {
        const link = generateShareableLink(token);
        setGeneratedLink(link);
        
        // Copy to clipboard
        await navigator.clipboard.writeText(link);
        
        toast({
          title: "Link gerado",
          description: "Link copiado para a área de transferência!"
        });
      }
    } catch (error) {
      console.error('Error generating link:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o link",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = async () => {
    if (!generatedLink) return;
    
    try {
      await navigator.clipboard.writeText(generatedLink);
      toast({
        title: "Copiado",
        description: "Link copiado para a área de transferência!"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o link",
        variant: "destructive"
      });
    }
  };

  const handleOpenLink = () => {
    if (!generatedLink) return;
    window.open(generatedLink, '_blank');
  };

  const selectedClient = clients.find(c => c.id === selectedClientId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Link className="h-5 w-5" />
          <span>Gerador de Link do Formulário</span>
        </CardTitle>
        <CardDescription>
          Gere links únicos para que seus clientes preencham o formulário de anamnese online
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Select value={selectedClientId} onValueChange={setSelectedClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cliente">
                  {selectedClient && (
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>{selectedClient.name}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>{client.name}</span>
                      <span className="text-muted-foreground">({client.phone})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={handleGenerateLink} 
            disabled={!selectedClientId || isGenerating}
          >
            {isGenerating ? 'Gerando...' : 'Gerar Link'}
          </Button>
        </div>

        {generatedLink && (
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg border">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Link gerado para: {selectedClient?.name}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Input 
                value={generatedLink} 
                readOnly 
                className="flex-1 font-mono text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyLink}
                title="Copiar link"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleOpenLink}
                title="Abrir link"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Este link expira em 7 dias e pode ser usado apenas uma vez.
            </p>
          </div>
        )}

        {clients.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum cliente cadastrado ainda.</p>
            <p className="text-sm">Adicione clientes primeiro para gerar links do formulário.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};