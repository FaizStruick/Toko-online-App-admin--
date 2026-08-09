import db from "@/lib/db";
import { ProductForm } from "./components/product-form";

const ProductPage = async (
    props: {params: Promise<{productId: string, storeId: string}>}
) => {
    const params = await props.params;

    const product = await db.product.findUnique({
        where: {
            id: params.productId
        }, 
        include: {
            images: true,
            category: true,
            size: true,
            color: true,
        },
    })

    const categories = await db.category.findMany({
        where: {
            storeId: params.storeId
        }
    })

    const sizes = await db.size.findMany({
        where: {
            storeId: params.storeId
        }
    })

    const colors = await db.color.findMany({
        where: {
            storeId: params.storeId
        }
    })

    const formattedProduct = product ? JSON.parse(JSON.stringify(product)) : null;

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
            <ProductForm 
                categories={categories}
                sizes={sizes}
                colors={colors}
                initialData={formattedProduct}
                />
            </div>
        </div>
    );
}

export default ProductPage;