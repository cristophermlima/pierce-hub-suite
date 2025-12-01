
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Upload, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

export function ImageUpload({ images, onImagesChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      const newImages = [...images, publicUrl];
      onImagesChange(newImages);
      toast.success('Imagem enviada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao enviar imagem:', error);
      toast.error('Erro ao enviar imagem: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Tipo de arquivo inválido. Use JPG, PNG ou WEBP');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Arquivo muito grande. Tamanho máximo: 5MB');
        return;
      }
      uploadImage(file);
    }
    // Reset input to allow uploading the same file again
    event.target.value = '';
  };

  return (
    <div className="space-y-4">
      <Label>Imagens do Produto</Label>
      
      <div className="flex items-center gap-4">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
          id="image-upload"
        />
        <Label htmlFor="image-upload" asChild>
          <Button 
            type="button" 
            variant="outline" 
            disabled={uploading}
            className="cursor-pointer"
          >
            {uploading ? (
              <>Enviando...</>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Adicionar Imagem
              </>
            )}
          </Button>
        </Label>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Produto ${index + 1}`}
                className="w-full h-24 object-cover rounded border"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
