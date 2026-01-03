
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWhatsAppSupport } from '@/hooks/useWhatsAppSupport';

interface WhatsAppSupportProps {
  variant?: 'default' | 'header' | 'auth';
}

const DEFAULT_SUPPORT_PHONE = '5511999999999'; // Fallback padrão
const SUPPORT_MESSAGE = encodeURIComponent('Olá! Preciso de ajuda com o PiercerHub.');

export const WhatsAppSupport = ({ variant = 'default' }: WhatsAppSupportProps) => {
  const configuredNumber = useWhatsAppSupport();
  const supportPhone = configuredNumber || DEFAULT_SUPPORT_PHONE;
  const whatsappUrl = `https://wa.me/${supportPhone}?text=${SUPPORT_MESSAGE}`;

  if (variant === 'header') {
    return (
      <a 
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-xs text-green-600 hover:text-green-700 transition-colors"
      >
        <MessageCircle size={14} />
        <span className="hidden sm:inline">Suporte</span>
      </a>
    );
  }

  if (variant === 'auth') {
    return (
      <a 
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 text-sm text-green-600 hover:text-green-700 transition-colors mt-4"
      >
        <MessageCircle size={16} />
        <span>Precisa de ajuda? Fale com o suporte</span>
      </a>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="text-green-600 border-green-600 hover:bg-green-50"
      asChild
    >
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        <MessageCircle size={16} className="mr-2" />
        Suporte WhatsApp
      </a>
    </Button>
  );
};
