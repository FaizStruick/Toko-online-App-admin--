'use client'

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Code2, Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { ProductColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

interface ProductClientProps {
    data: ProductColumn[];
}

export const ProductClient: React.FC<ProductClientProps> = ({
    data
}) => {

    const router = useRouter();
    const params = useParams();

    return (
        <div className="space-y-6">
        <div className="flex flex-col gap-y-4 sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
           <Heading 
           title= {`Product (${data.length})`}
           description= "Atur product untuk toko"
           />
           <Button onClick={() => router.push(`/${params.storeId}/products/new`)}
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-600 text-white rounded-xl text-xs font-semibold px-4 py-2.5 transition-all shadow-sm"
            >
            <Plus className="mr-2 h-4 w-4"/>
            Add Now
           </Button>
        </div>

        <Separator className="bg-slate-200/60"/>

        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-x-auto">
        <DataTable data={data} columns={columns} searchKey="name"/>
        </div>

        <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-2xl">
                    <Code2 className="h-5 w-5"/>
                </div>
                <Heading 
                title="API"
                description="API untuk products"
                />
        </div>

        <Separator className="bg-slate-200/60"/>

        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <ApiList namaIndikator="products" idIndikator="productId"/>
        </div>
        </div>
        </div>
    )
}