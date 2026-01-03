
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Eye, Copy, Check } from 'lucide-react';
import { Catalog, useCatalogs } from '../hooks/useCatalogs';
import { CatalogDialog } from './CatalogDialog';
import { CatalogItemsDialog } from './CatalogItemsDialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';

export function CatalogsTable() {
  const { catalogs, isLoading, createCatalog, updateCatalog, deleteCatalog, isCreating, isUpdating } = useCatalogs();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [itemsDialogOpen, setItemsDialogOpen] = useState(false);
  const [selectedCatalog, setSelectedCatalog] = useState<Catalog | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [catalogToDelete, setCatalogToDelete] = useState<Catalog | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleEdit = (catalog: Catalog) => {
    setSelectedCatalog(catalog);
    setDialogOpen(true);
  };

  const handleViewItems = (catalog: Catalog) => {
    setSelectedCatalog(catalog);
    setItemsDialogOpen(true);
  };

  const handleSave = (data: { name: string; description?: string; is_active?: boolean }) => {
    if (selectedCatalog) {
      updateCatalog({ id: selectedCatalog.id, ...data });
    } else {
      createCatalog(data);
    }
    setSelectedCatalog(null);
  };

  const handleDelete = (catalog: Catalog) => {
    setCatalogToDelete(catalog);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (catalogToDelete) {
      deleteCatalog(catalogToDelete.id);
      setCatalogToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleCopyLink = (catalog: Catalog) => {
    const shareUrl = `${window.location.origin}/catalog/${catalog.share_token}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedId(catalog.id);
    toast({ title: "Link copiado!" });
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Meus Catálogos</h2>
        <Button onClick={() => { setSelectedCatalog(null); setDialogOpen(true); }}>
          Novo Catálogo
        </Button>
      </div>

      {catalogs.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/50">
          <p className="text-muted-foreground mb-4">Você ainda não tem catálogos.</p>
          <Button onClick={() => setDialogOpen(true)}>Criar Primeiro Catálogo</Button>
        </div>
      ) : (
        <div className="rounded-md border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {catalogs.map((catalog) => (
                <TableRow key={catalog.id}>
                  <TableCell className="font-medium">{catalog.name}</TableCell>
                  <TableCell className="text-muted-foreground max-w-[200px] truncate">
                    {catalog.description || '—'}
                  </TableCell>
                  <TableCell>
                    {catalog.is_active ? (
                      <Badge variant="default">Ativo</Badge>
                    ) : (
                      <Badge variant="secondary">Inativo</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {format(new Date(catalog.created_at), "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleCopyLink(catalog)}
                        title="Copiar link"
                      >
                        {copiedId === catalog.id ? <Check size={16} /> : <Copy size={16} />}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleViewItems(catalog)}
                        title="Ver itens"
                      >
                        <Eye size={16} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(catalog)}
                        title="Editar"
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(catalog)}
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <CatalogDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        catalog={selectedCatalog}
        onSave={handleSave}
        isLoading={isCreating || isUpdating}
      />

      <CatalogItemsDialog
        open={itemsDialogOpen}
        onOpenChange={setItemsDialogOpen}
        catalog={selectedCatalog}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir catálogo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O catálogo "{catalogToDelete?.name}" e todos os seus itens serão excluídos permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
