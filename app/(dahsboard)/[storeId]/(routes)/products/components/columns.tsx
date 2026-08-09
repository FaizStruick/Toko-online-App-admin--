"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"


export type ProductColumn = {
  id: string;
  name: string;
  price: string;
  size: string;
  category: string;
  color: string;
  isFeatured: boolean;
  isArchived: boolean;
  createdAt: string;
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Nama Produk",
    cell: ({row}) => (
      <span className="font-semibold text-slate-800">{row.original.name}</span>
    )
  },
  {
    accessorKey: "isArchived",
    header: "Status Toko",
    cell: ({ row }) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          row.original.isArchived
            ? "bg-rose-50 text-rose-700 border-rose-200"
            : "bg-emerald-50 text-emerald-700 border-emerald-200"
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
            row.original.isArchived ? "bg-rose-500" : "bg-emerald-500"
          }`}
        />
        {row.original.isArchived ? "Archived" : "Active"}
      </span>
    )
  },
  {
    accessorKey: "isFeatured",
    header: "Tampil di utama",
    cell: ({ row }) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          row.original.isFeatured
            ? "bg-blue-50 text-blue-700 border-blue-200"
            : "bg-slate-100 text-slate-500 border-slate-200"
        }`}
      >
        {row.original.isFeatured ? "Featured" : "Standard"}
      </span>
    )
  },
  {
    accessorKey: "price",
    header: "Harga",
    cell: ({row}) => (
      <span className="font-medium text-slate-900">{row.original.price}</span>
    )
  },
  {
    accessorKey: "category",
    header: "Kategori",
    cell: ({row}) => (
      <span className="font-semibold text-slate-900">{row.original.category}</span>
    )
  },
  {
    accessorKey: "size",
    header: "Ukuran",
  },
  {
    accessorKey: "color",
    header: "Warna",
    cell: ({row}) => (
      <div className="flex items-center gap-x-2">
        {row.original.color}
        <div 
          className="h-6 w-6 rounded-full border"
          style={{ backgroundColor: row.original.color}}
        />
      </div>
    )
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({row}) => <CellAction data={row.original}/>
  }
]