
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

interface FormActionsSectionProps {
  isSubmitting: boolean;
  selectedItem: any;
  onCancel: () => void;
}

export function FormActionsSection({ isSubmitting, selectedItem, onCancel }: FormActionsSectionProps) {
  return (
    <DialogFooter className="pt-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
      >
        Cancelar
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Salvando...
          </>
        ) : (
          selectedItem ? 'Salvar Alterações' : 'Adicionar ao Estoque'
        )}
      </Button>
    </DialogFooter>
  );
}
