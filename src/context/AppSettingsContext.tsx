import React, { createContext, useContext, useState, useEffect } from 'react';

export type Currency = 'BRL' | 'USD' | 'EUR';
export type Language = 'pt-BR' | 'en-US' | 'es-ES';

interface AppSettingsContextType {
  currency: Currency;
  language: Language;
  setCurrency: (currency: Currency) => void;
  setLanguage: (language: Language) => void;
  formatCurrency: (value: number) => string;
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

const currencySymbols: Record<Currency, string> = {
  BRL: 'R$',
  USD: '$',
  EUR: '€',
};

const currencyLocales: Record<Currency, string> = {
  BRL: 'pt-BR',
  USD: 'en-US',
  EUR: 'de-DE',
};

export function AppSettingsProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem('app-currency');
    return (saved as Currency) || 'BRL';
  });

  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('app-language');
    return (saved as Language) || 'pt-BR';
  });

  useEffect(() => {
    localStorage.setItem('app-currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('app-language', language);
  }, [language]);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
  };

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat(currencyLocales[currency], {
      style: 'currency',
      currency: currency,
    }).format(value);
  };

  return (
    <AppSettingsContext.Provider
      value={{
        currency,
        language,
        setCurrency,
        setLanguage,
        formatCurrency,
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);
  if (context === undefined) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider');
  }
  return context;
}
