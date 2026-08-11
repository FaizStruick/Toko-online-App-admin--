import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"


export async function GET (
    req: Request,
    props: {params: Promise<{productId: string}>} 
) {
    try {

        const params = await props.params;

        if(!params.productId){
            return new NextResponse("Product Id dibutuhkan", {status: 400});
        }
        
        const product = await db.product.findUnique({
            where: {
                id: params.productId,
            },
            include: {
                images: true,
                category: true,
                size: true,
                color: true,
            }
        });
        return NextResponse.json(product);    
        
    } catch (error) {
        console.log('[PRODUCT_GET]', error);
        return new NextResponse("Internal Error", {status: 500})
    }
}

export async function PATCH (
    req: Request,
    props: {params: Promise<{storeId: string, productId: string}>}
) {
    try {

        const {userId} = await auth()
        const body = await req.json();
        const {name, price, categoryId, sizeId, colorId, images, isFeatured, isArchived} = body;

        const params = await props.params;

        if(!userId){
            return new NextResponse("Unauthenticated", {status: 401});
        }
        if(!name){
            return new NextResponse("Harus menginput name" , {status: 400});
        }
        if(!images || !images.length){
            return new NextResponse("Harus menginput images" , {status: 400});
        }
        if(!price){
            return new NextResponse("Harus menginput price" , {status: 400});
        }
        if(!categoryId){
            return new NextResponse("Harus menginput category" , {status: 400});
        }

        if(!sizeId){
            return new NextResponse("Harus menginput size" , {status: 400});
        }

        if(!colorId){
            return new NextResponse("Harus menginput color" , {status: 400});
        }

        if(!params.productId){
            return new NextResponse("Product Id dibutuhkan", {status: 400});
        }

        const storeByUserId = await db.store.findFirst ({
            where: {
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId){
            return new NextResponse("Unauthorized", {status: 403})
        }
        
        await db.product.update({
            where: {
                id: params.productId,
            },
            data: {
                name,
                price,
                isFeatured,
                isArchived,
                categoryId,
                colorId,
                sizeId,
                images: {
                    deleteMany: {}
                },
            },
        });

        const product = await db.product.update({
            where: {
                id: params.productId,
            },
            data: {
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: {url: string}) => image)
                        ]
                    }
                } 
            }
        })
        return NextResponse.json(product);    
        
    } catch (error) {
        console.log('[PRODUCT_PATCH]', error)
        return new NextResponse("Internal Error", {status: 500})
    }
}

export async function DELETE (
    req: Request,
    props: {params: Promise<{storeId: string, productId: string}>} 
) {
    try {

        const {userId} = await auth()
        const params = await props.params;
       

        if(!userId){
            return new NextResponse("Unauthenticated", {status: 401});
        }
        
        if(!params.productId){
            return new NextResponse("Product Id dibutuhkan", {status: 400});
        }

        const storeByUserId = await db.store.findFirst ({
            where: {
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId){
            return new NextResponse("Unauthorized", {status: 403})
        }
        
        const product = await db.product.deleteMany({
            where: {
                id: params.productId,
            },
        });
        return NextResponse.json(product);    
        
    } catch (error) {
        console.log('[PRODUCT_DELETE]', error)
        return new NextResponse("Internal Error", {status: 500})
    }
}