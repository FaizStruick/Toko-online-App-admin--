'use client'

import { useState } from "react";
import { Store } from "@prisma/client";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useStoreModal } from "@/hooks/use-store-modal";
import { useParams, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "./ui/command";

type PopOverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwticherProps extends PopOverTriggerProps {
    items: Store[];
}

const StoreSwitcher = ({
    className,
    items = []
}: StoreSwticherProps) => {
    const storeModal = useStoreModal();
    const params = useParams();
    const router = useRouter();

    const formattedItems = items.map((item) => ({
        label: item.name,
        value: item.id
    }))

    const [open, setOpen] = useState(false);

    const currentStore = formattedItems.find((item) => item.value === params?.storeId)

    const onStoreSelect = (store: {value: string, label: string}) => {
        setOpen(false);
        router.push(`/${store.value}`);
        router.refresh();
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
            <Button
            variant="outline"
            size="sm"
            role="combobox"
            aria-expanded={open}
            aria-label="Pilih Toko"
            className={cn("w-[200px] justify-between", className)}>
                <StoreIcon className="mr-2 h-4 w-4"/>
                {currentStore?.label || "Pilih Toko"}
                <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50"/>
            </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                        <CommandInput placeholder="Cari Toko"/>
                        <CommandEmpty>
                            Toko tidak ditemukan
                        </CommandEmpty>
                        <CommandGroup heading="Toko">
                            {formattedItems.map((store) => (
                                <CommandItem
                                key={store.value}
                                onSelect={() => onStoreSelect(store)}
                                className="text-sm"
                                >
                                    <StoreIcon className="mr-2 h-4 w-4" />
                                    <span>{store.label}</span>
                                    <Check 
                                    className={cn(
                                        "ml-auto h-4 w-4",
                                        currentStore?.value === store.value ? "opacity-100" : "opacity-0"
                                    )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                    <CommandSeparator/>
                    <CommandList>
                        <CommandGroup>
                            <CommandItem
                            onSelect={() => {
                                setOpen(false);
                                storeModal.onOpen();
                            }}
                            >
                                <PlusCircle className="mr-2 h-5 w-5"/>
                                Buat Toko
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export default StoreSwitcher;