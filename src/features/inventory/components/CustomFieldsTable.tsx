
import { Button } from "@/components/ui/button";
import { CustomField } from "../hooks/useCustomFields";
import { Edit, Trash2 } from "lucide-react";

interface Props {
  fields: CustomField[];
  onEdit: (field: CustomField) => void;
  onDelete: (id: string) => void;
}

export const CustomFieldsTable = ({ fields, onEdit, onDelete }: Props) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="py-2 text-left">Campo</th>
            <th className="py-2 text-left">Tipo</th>
            <th className="py-2">Obrigatório</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {fields.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center p-4 text-muted-foreground">Nenhum campo encontrado.</td>
            </tr>
          ) : (
            fields.map(field => (
              <tr key={field.id} className="border-t">
                <td className="p-2">{field.field_label}</td>
                <td className="p-2">{field.field_type}</td>
                <td className="p-2">{field.required ? "Sim" : "Não"}</td>
                <td className="p-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(field)}>
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(field.id)}>
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
