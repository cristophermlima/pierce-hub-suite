
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useBusinessSettings } from '@/features/settings/hooks/useBusinessSettings';

export const BusinessSettings = () => {
  const { settings, isLoading, updateSettings, isUpdating } = useBusinessSettings();
  
  const [formData, setFormData] = useState({
    user_id: '',
    business_name: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    description: '',
    business_hours: '',
    website: ''
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        user_id: settings.user_id || '',
        business_name: settings.business_name || '',
        address: settings.address || '',
        city: settings.city || '',
        state: settings.state || '',
        zip_code: settings.zip_code || '',
        description: settings.description || '',
        business_hours: settings.business_hours || '',
        website: settings.website || ''
      });
    }
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
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
        <CardTitle>Configurações da Empresa</CardTitle>
        <CardDescription>
          Gerencie as informações do seu estúdio e detalhes da empresa.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <ScrollArea className="h-[60vh] pr-4">
            <div className="pr-4 space-y-4">
              <div className="grid gap-1.5">
                <Label htmlFor="businessName">Nome do Estúdio</Label>
                <Input 
                  id="businessName" 
                  value={formData.business_name}
                  onChange={(e) => handleChange('business_name', e.target.value)}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="businessAddress">Endereço</Label>
                <Input 
                  id="businessAddress" 
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="businessCity">Cidade</Label>
                  <Input 
                    id="businessCity" 
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="businessState">Estado</Label>
                  <Input 
                    id="businessState" 
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="businessZip">CEP</Label>
                  <Input 
                    id="businessZip" 
                    value={formData.zip_code}
                    onChange={(e) => handleChange('zip_code', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="businessDescription">Descrição</Label>
                <Textarea 
                  id="businessDescription" 
                  className="min-h-[100px]"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="businessHours">Horário de Funcionamento</Label>
                  <Input 
                    id="businessHours" 
                    value={formData.business_hours}
                    onChange={(e) => handleChange('business_hours', e.target.value)}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="businessWebsite">Site</Label>
                  <Input 
                    id="businessWebsite" 
                    value={formData.website}
                    onChange={(e) => handleChange('website', e.target.value)}
                  />
                </div>
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
