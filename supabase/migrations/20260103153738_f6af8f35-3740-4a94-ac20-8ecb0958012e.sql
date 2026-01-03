-- Adicionar coluna de WhatsApp para suporte nas configurações do negócio
ALTER TABLE public.business_settings 
ADD COLUMN IF NOT EXISTS whatsapp_support text DEFAULT '';