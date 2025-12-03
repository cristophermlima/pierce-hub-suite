import { useAppSettings } from '@/context/AppSettingsContext';
import { translations, TranslationKey } from '@/i18n/translations';

export function useTranslation() {
  const { language } = useAppSettings();
  
  const t = (key: TranslationKey): string => {
    return translations[language]?.[key] || translations['pt-BR'][key] || key;
  };
  
  return { t, language };
}
