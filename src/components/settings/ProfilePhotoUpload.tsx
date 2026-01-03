
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Loader2, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function ProfilePhotoUpload() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Buscar URL da foto atual
  const { data: profileData } = useQuery({
    queryKey: ['user-profile-photo'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      return {
        photoUrl: user.user_metadata?.profile_photo_url || null,
        initials: `${(user.user_metadata?.first_name || 'U')[0]}${(user.user_metadata?.last_name || '')[0]}`.toUpperCase(),
      };
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload da imagem
      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(fileName);

      // Atualizar metadados do usuário
      const { error: updateError } = await supabase.auth.updateUser({
        data: { profile_photo_url: publicUrl }
      });

      if (updateError) throw updateError;

      return publicUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile-photo'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      setPreviewUrl(null);
      toast({ title: "Foto atualizada com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao atualizar foto", variant: "destructive" });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Remover URL dos metadados
      const { error } = await supabase.auth.updateUser({
        data: { profile_photo_url: null }
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile-photo'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast({ title: "Foto removida!" });
    },
    onError: () => {
      toast({ title: "Erro ao remover foto", variant: "destructive" });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Arquivo muito grande. Máximo 5MB.", variant: "destructive" });
      return;
    }

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    uploadMutation.mutate(file);
  };

  const displayUrl = previewUrl || profileData?.photoUrl;

  return (
    <div className="flex items-center gap-6">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={displayUrl || undefined} />
          <AvatarFallback className="text-2xl">
            {profileData?.initials || 'U'}
          </AvatarFallback>
        </Avatar>
        {uploadMutation.isPending && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadMutation.isPending}
        >
          <Camera size={16} className="mr-2" />
          Alterar Foto
        </Button>
        {profileData?.photoUrl && (
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => removeMutation.mutate()}
            disabled={removeMutation.isPending}
          >
            <Trash2 size={16} className="mr-2" />
            Remover
          </Button>
        )}
      </div>
    </div>
  );
}
