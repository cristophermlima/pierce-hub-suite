
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface FormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
}

export const FormActions = ({ onCancel, isSubmitting }: FormActionsProps) => {
  return (
    <DialogFooter className="pt-4">
      <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processando...
          </>
        ) : (
          'Confirmar Agendamento'
        )}
      </Button>
    </DialogFooter>
  );
};
