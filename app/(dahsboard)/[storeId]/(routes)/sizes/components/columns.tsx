'use client'

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type SizeColumn = {
    id: string
    name: string
    value: string
    createdAt: string
}

export const columns: ColumnDef<SizeColumn>[] = [
    {
        accessorKey: "name",
        header: "Nama Size",
    },
    {
        accessorKey: "value",
        header: "Value",
        cell: ({row}) => row.original.value,
    },
    {
        accessorKey: "createdAt",
        header: "Tanggal Buat",
    },
    {
        id: "actions",
        cell: ({row}) => <CellAction data={row.original} />
    }
]