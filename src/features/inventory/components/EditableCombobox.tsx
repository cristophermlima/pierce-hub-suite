
import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from '@/components/ui/command';
import { Check, ChevronDown } from 'lucide-react';
import { Control } from 'react-hook-form';
import { InventoryMutationData } from '../types';
import { cn } from '@/lib/utils';

interface EditableComboboxProps {
  control: Control<InventoryMutationData>;
  suggestions: string[];
}

export function EditableCombobox({ control, suggestions }: EditableComboboxProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  return (
    <FormField
      control={control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nome do Item *</FormLabel>
          <div className="flex gap-2">
            <FormControl className="flex-1">
              <Input
                placeholder="Digite o nome do item"
                value={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-10 p-0"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Buscar sugestões..."
                    value={inputValue}
                    onValueChange={setInputValue}
                  />
                  <CommandList>
                    <CommandEmpty>Nenhuma sugestão encontrada.</CommandEmpty>
                    {suggestions.map((suggestion) => (
                      <CommandItem
                        key={suggestion}
                        value={suggestion}
                        onSelect={() => {
                          field.onChange(suggestion);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value === suggestion ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {suggestion}
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
