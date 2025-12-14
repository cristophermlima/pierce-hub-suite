import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X, Upload, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface PublicDocumentUploadProps {
  documentUrl?: string;
  onDocumentChange: (url: string | undefined) => void;
}

export function PublicDocumentUpload({ documentUrl, onDocumentChange }: PublicDocumentUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    try {
      setUploading(true);
      
      // Create a base64 preview for display
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setLocalPreview(base64);
        onDocumentChange(base64);
        toast.success('Documento anexado com sucesso!');
      };
      reader.onerror = () => {
        toast.error('Erro ao ler o arquivo');
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      console.error('Erro ao processar documento:', error);
      toast.error('Erro ao processar documento');
    } finally {
      setUploading(false);
    }
  };

  const removeDocument = () => {
    setLocalPreview(null);
    onDocumentChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
      handleFileSelect(file);
    }
  };

  const currentUrl = localPreview || documentUrl;

  return (
    <div className="space-y-4">
      <Label>Documento de Identidade</Label>
      
      <div className="flex items-center gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
          id="public-document-upload"
        />
        <label htmlFor="public-document-upload">
          <Button 
            type="button" 
            variant="outline" 
            disabled={uploading || !!currentUrl}
            className="cursor-pointer"
            asChild
          >
            <span>
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Enviar Documento
                </>
              )}
            </span>
          </Button>
        </label>
      </div>

      {currentUrl && (
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
