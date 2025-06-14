
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CustomField } from "../hooks/useCustomFields";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Partial<CustomField>) => void;
  loading?: boolean;
  defaultValues?: Partial<CustomField> | null;
}

export const CustomFieldDialog = ({
  open,
  onOpenChange,
  onSave,
  loading = false,
  defaultValues,
}: Props) => {
  const safeDefaultValues = defaultValues || {};
  
  const [fieldLabel, setFieldLabel] = useState(safeDefaultValues.field_label || "");
  const [fieldName, setFieldName] = useState(safeDefaultValues.field_name || "");
  const [fieldType, setFieldType] = useState(safeDefaultValues.field_type || "text");
  const [options, setOptions] = useState(safeDefaultValues.options ? JSON.stringify(safeDefaultValues.options) : "");
  const [required, setRequired] = useState(safeDefaultValues.required ?? false);

  useEffect(() => {
    const values = defaultValues || {};
    setFieldLabel(values.field_label || "");
    setFieldName(values.field_name || "");
    setFieldType(values.field_type || "text");
    setOptions(values.options ? JSON.stringify(values.options) : "");
    setRequired(values.required ?? false);
  }, [defaultValues, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let optionsJson = null;
    try {
      if (options) optionsJson = JSON.parse(options);
    } catch { optionsJson = options; }
    onSave({
      field_label: fieldLabel,
      field_name: fieldName,
      field_type: fieldType,
      options: optionsJson,
      required,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{safeDefaultValues.id ? "Editar Campo" : "Novo Campo"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 mt-3">
          <Label>Nome do Campo</Label>
          <Input value={fieldLabel} onChange={e => setFieldLabel(e.target.value)} required />
          <Label>Chave Interna</Label>
          <Input value={fieldName} onChange={e => setFieldName(e.target.value)} required />
          <Label>Tipo</Label>
          <Input value={fieldType} onChange={e => setFieldType(e.target.value)} placeholder='text, number, select...' required />
          {fieldType === "select" && (
            <>
              <Label>Opções (JSON array)</Label>
              <Input value={options} onChange={e => setOptions(e.target.value)} placeholder='["opção1", "opção2"]' />
            </>
          )}
          <div className="flex items-center gap-2">
            <Switch checked={required} onCheckedChange={setRequired} id="required" />
            <Label htmlFor="required">Obrigatório</Label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
