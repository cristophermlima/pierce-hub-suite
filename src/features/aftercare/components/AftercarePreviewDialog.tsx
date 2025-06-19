
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { AftercareTemplate } from '../types';

interface AftercarePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: AftercareTemplate | null;
}

export function AftercarePreviewDialog({
  open,
  onOpenChange,
  template
}: AftercarePreviewDialogProps) {
  if (!template) return null;

  const handleShareWhatsApp = () => {
    const message = `*${template.title}*\n\n${template.content}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Preview: {template.name}</DialogTitle>
          <DialogDescription>
            Visualização de como a mensagem será enviada
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800 mb-2">{template.title}</h3>
            <div className="text-green-700 whitespace-pre-wrap">
              {template.content}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Status: {template.is_active ? 'Ativo' : 'Inativo'}
            </div>
            <Button onClick={handleShareWhatsApp} className="bg-green-600 hover:bg-green-700">
              <Share2 className="h-4 w-4 mr-2" />
              Testar no WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
