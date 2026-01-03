
import React from 'react';
import { CatalogsTable } from '@/features/catalogs/components/CatalogsTable';
import { useTranslation } from '@/hooks/useTranslation';

const Catalogs = () => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Catálogo de Joias</h1>
        <p className="text-muted-foreground">
          Crie catálogos personalizados para compartilhar com seus clientes.
        </p>
      </div>

      <CatalogsTable />
    </div>
  );
};

export default Catalogs;
