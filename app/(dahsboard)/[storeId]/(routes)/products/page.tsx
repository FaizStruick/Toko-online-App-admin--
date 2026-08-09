import db from "@/lib/db";
import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/columns";

import { format } from 'date-fns';
import { formatter } from "@/lib/utils";

interface ProductPageProps {
    params: Promise<{
        storeId: string;
    }>;
}

const ProductsPage = async (props: ProductPageProps) => {

    const params= await props.params;
    
    const products = await db.product.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            category: true,
            size: true,
            color: true,
        },
        orderBy: {
            createdAt: 'desc'
        },
    });
  
    const formattedProducts: ProductColumn[] = products.map((item) => ({
        id: item.id,
        name: item.name,
        isFeatured: item.isFeatured,    
        isArchived: item.isArchived,
        price: formatter.format(parseFloat(item.price.toString())),
        category: item.category?.name || "No Category",
        size: item.size?.name || "-",
        color: item.color?.value || "-",
        createdAt: format(item.createdAt, "MMM do, yyyy")
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6 max-w-7xl mx-auto w-full">
            <ProductClient data={formattedProducts}/>
            </div>
        </div>
    );
}

export default ProductsPage;