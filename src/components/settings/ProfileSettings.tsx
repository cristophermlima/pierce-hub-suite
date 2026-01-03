
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useProfileSettings } from '@/features/settings/hooks/useProfileSettings';
import { ProfilePhotoUpload } from './ProfilePhotoUpload';

export const ProfileSettings = () => {
  const { profile, isLoading, updateProfile, isUpdating } = useProfileSettings();
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    role: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        role: profile.role || ''
      });
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Perfil</CardTitle>
        <CardDescription>
          Atualize suas informações pessoais e configurações de perfil.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <ScrollArea className="h-[60vh] pr-4">
            <div className="pr-4 space-y-6">
              {/* Foto de Perfil */}
              <div className="pb-4 border-b">
                <Label className="text-base font-medium mb-4 block">Foto de Perfil</Label>
                <ProfilePhotoUpload />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="firstName">Nome</Label>
                  <Input 
                    id="firstName" 
                    value={formData.first_name}
                    onChange={(e) => handleChange('first_name', e.target.value)}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="lastName">Sobrenome</Label>
                  <Input 
                    id="lastName" 
                    value={formData.last_name}
                    onChange={(e) => handleChange('last_name', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="email">Endereço de Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={profile?.email || ''} 
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  O email não pode ser alterado aqui
                </p>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="phone">Número de Telefone</Label>
                <Input 
                  id="phone" 
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="role">Cargo/Título</Label>
                <Input 
                  id="role" 
                  value={formData.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                />
              </div>
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
