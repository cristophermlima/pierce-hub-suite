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
  const [generatedLink, setGeneratedLink] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateLink = async () => {
    setIsGenerating(true);
    try {
      const token = await generateFormToken();
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Link className="h-5 w-5" />
          <span>Gerador de Link do Formulário</span>
        </CardTitle>
        <CardDescription>
          Gere links únicos para novos clientes preencherem o formulário de cadastro e anamnese online
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <Button 
            onClick={handleGenerateLink} 
            disabled={isGenerating}
            size="lg"
          >
            {isGenerating ? 'Gerando...' : 'Gerar Novo Link'}
          </Button>
        </div>

        {generatedLink && (
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg border">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Link gerado para novo cliente</p>
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
              Este link expira em 7 dias e pode ser usado apenas uma vez para cadastrar um novo cliente.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};