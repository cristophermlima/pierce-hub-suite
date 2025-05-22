
"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ComboboxProps {
  options: { label: string; value: string; phone?: string; email?: string }[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function Combobox({
  options = [],
  value,
  onChange,
  placeholder = "Selecione uma opção...",
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  
  // Ensure options is always a valid array
  const safeOptions = React.useMemo(() => {
    if (!options || !Array.isArray(options)) {
      console.warn("Combobox received invalid options prop", options)
      return []
    }
    return options
  }, [options])
  
  // Find the option that matches the current value
  const selectedOption = React.useMemo(() => {
    return safeOptions.find((option) => option.value === value)
  }, [safeOptions, value])

  // Filter options based on search query
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return safeOptions
    
    return safeOptions.filter((option) => 
      option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (option.email && option.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (option.phone && option.phone.includes(searchQuery))
    )
  }, [safeOptions, searchQuery])

  // Handle option selection
  const handleSelect = React.useCallback((currentValue: string) => {
    if (typeof onChange === 'function') {
      onChange(currentValue)
    } else {
      console.warn("Combobox onChange is not a function")
    }
    setOpen(false)
    setSearchQuery("")
  }, [onChange])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput 
            placeholder={`Buscar ${placeholder.toLowerCase()}`}
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          {safeOptions.length === 0 ? (
            <CommandEmpty>Nenhuma opção disponível.</CommandEmpty>
          ) : filteredOptions.length === 0 ? (
            <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
          ) : (
            <CommandGroup className="max-h-64 overflow-y-auto">
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={handleSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
