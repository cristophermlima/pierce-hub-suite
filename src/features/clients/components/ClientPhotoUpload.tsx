
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Plus, X, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface ClientPhotoUploadProps {
  clientId: string;
}

interface ClientPhoto {
  id: string;
  photo_url: string;
  description: string | null;
  photo_type: string;
  created_at: string;
}

export const ClientPhotoUpload = ({ clientId }: ClientPhotoUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [description, setDescription] = useState('');
  const queryClient = useQueryClient();

  const { data: photos = [], isLoading } = useQuery({
    queryKey: ['client-photos', clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_photos')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ClientPhoto[];
    }
  });

  const deletePhotoMutation = useMutation({
    mutationFn: async (photoId: string) => {
      const { error } = await supabase
        .from('client_photos')
        .delete()
        .eq('id', photoId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-photos', clientId] });
      toast.success('Foto removida com sucesso');
    },
    onError: () => {
      toast.error('Erro ao remover foto');
    }
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB');
      return;
    }

    setIsUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${clientId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('client-photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('client-photos')
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase
        .from('client_photos')
        .insert({
          client_id: clientId,
          photo_url: publicUrl,
          description: description || null,
          photo_type: 'portfolio'
        });

      if (insertError) throw insertError;

      queryClient.invalidateQueries({ queryKey: ['client-photos', clientId] });
      setDescription('');
      toast.success('Foto adicionada com sucesso');
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error);
      toast.error('Erro ao fazer upload da foto');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium flex items-center gap-2">
          <Camera className="h-4 w-4" />
          Fotos do Cliente / Trabalhos
        </Label>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {photos.map((photo) => (
          <div key={photo.id} className="relative group aspect-square">
            <img
              src={photo.photo_url}
              alt={photo.description || 'Foto do cliente'}
              className="w-full h-full object-cover rounded-lg"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => deletePhotoMutation.mutate(photo.id)}
            >
              <X className="h-3 w-3" />
            </Button>
            {photo.description && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1.5 rounded-b-lg truncate">
                {photo.description}
              </div>
            )}
          </div>
        ))}

        <label className="aspect-square border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
          {isUploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : (
            <>
              <Plus className="h-6 w-6 text-muted-foreground" />
              <span className="text-xs text-muted-foreground mt-1">Adicionar</span>
            </>
          )}
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
        </label>
      </div>

      {photos.length === 0 && !isLoading && (
        <p className="text-sm text-muted-foreground text-center py-2">
          Nenhuma foto adicionada ainda
        </p>
      )}
    </div>
  );
};
