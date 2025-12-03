import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppSettings, Currency, Language } from '@/context/AppSettingsContext';
import { Globe, DollarSign } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export function CurrencyLanguageSettings() {
  const { currency, language, setCurrency, setLanguage } = useAppSettings();
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <CardTitle>{t('currency')}</CardTitle>
          </div>
          <CardDescription>
            {t('currencyDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currency">{t('defaultCurrency')}</Label>
            <Select value={currency} onValueChange={(value) => setCurrency(value as Currency)}>
              <SelectTrigger id="currency">
                <SelectValue placeholder="Selecione a moeda" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BRL">Real Brasileiro (R$)</SelectItem>
                <SelectItem value="USD">US Dollar ($)</SelectItem>
                <SelectItem value="EUR">Euro (€)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <CardTitle>{t('language')}</CardTitle>
          </div>
          <CardDescription>
            {t('languageDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language">{t('interfaceLanguage')}</Label>
            <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
              <SelectTrigger id="language">
                <SelectValue placeholder="Selecione o idioma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                <SelectItem value="en-US">English (US)</SelectItem>
                <SelectItem value="es-ES">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
