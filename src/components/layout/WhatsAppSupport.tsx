
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWhatsAppSupport } from '@/hooks/useWhatsAppSupport';

interface WhatsAppSupportProps {
  variant?: 'default' | 'header' | 'auth';
}

// Número fixo do suporte (Brasil): +55 54 99175-2129
const DEFAULT_SUPPORT_PHONE = '5554991752129';
const SUPPORT_MESSAGE = encodeURIComponent('Olá! Preciso de ajuda com o PiercerHub.');

function normalizeWhatsAppPhone(value?: string | null) {
  const digits = (value ?? '').replace(/\D/g, '');
  if (!digits) return DEFAULT_SUPPORT_PHONE;
  if (digits.startsWith('55')) return digits;
  if (digits.length === 11) return `55${digits}`; // DDD + número (11 dígitos)
  return digits;
}

export const WhatsAppSupport = ({ variant = 'default' }: WhatsAppSupportProps) => {
  const configuredNumber = useWhatsAppSupport();
  const supportPhone = normalizeWhatsAppPhone(configuredNumber);
  const whatsappUrl = `https://wa.me/${supportPhone}?text=${SUPPORT_MESSAGE}`;

  if (variant === 'header') {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
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
        className="flex items-center justify-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors mt-4"
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
      className="text-primary border-primary/40 hover:bg-primary/10"
      asChild
    >
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        <MessageCircle size={16} className="mr-2" />
        Suporte WhatsApp
      </a>
    </Button>
  );
};

