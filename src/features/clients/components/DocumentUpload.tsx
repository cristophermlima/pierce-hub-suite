import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Upload, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DocumentUploadProps {
  documentUrl?: string;
  onDocumentChange: (url: string | undefined) => void;
  clientId?: string;
}

export function DocumentUpload({ documentUrl, onDocumentChange, clientId }: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false);

  const uploadDocument = async (file: File) => {
    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${clientId || 'temp'}-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('identity-documents')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('identity-documents')
        .getPublicUrl(fileName);

      onDocumentChange(publicUrl);
      toast.success('Documento enviado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao enviar documento:', error);
      toast.error('Erro ao enviar documento: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const removeDocument = () => {
    onDocumentChange(undefined);
    toast.success('Documento removido');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast.error('Tipo de arquivo inválido. Use JPG, PNG, WEBP ou PDF');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Arquivo muito grande. Tamanho máximo: 5MB');
        return;
      }
      uploadDocument(file);
    }
  };

  return (
    <div className="space-y-4">
      <Label>Documento de Identidade</Label>
      
      <div className="flex items-center gap-4">
        <Input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
          id="document-upload"
        />
        <Label htmlFor="document-upload" asChild>
          <Button 
            type="button" 
            variant="outline" 
            disabled={uploading || !!documentUrl}
            className="cursor-pointer"
          >
            {uploading ? (
              <>Enviando...</>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Enviar Documento
              </>
            )}
          </Button>
        </Label>
      </div>

      {documentUrl && (
        <div className="relative border rounded-lg p-4 bg-muted/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">Documento anexado</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={removeDocument}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      <p className="text-xs text-muted-foreground">
        Formatos aceitos: JPG, PNG, WEBP, PDF (máx. 5MB)
      </p>
    </div>
  );
}
