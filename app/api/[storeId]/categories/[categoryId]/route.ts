import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"


export async function GET (
    req: Request,
    {params}: {params: Promise<{categoryId: string}>} 
) {
    try {

        const resolvedParams = await params;

        if(!resolvedParams.categoryId){
            return new NextResponse("Category Id dibutuhkan", {status: 400});
        }
        
        const category = await db.category.findUnique({
            where: {
                id: resolvedParams.categoryId,
            },
            include: {
                banner: true,
            },
        });
        return NextResponse.json(category);    
        
    } catch (error) {
        console.log('[CATEGORIES_GET]', error);
        return new NextResponse("Internal Error", {status: 500})
    }
}

export async function PATCH (
    req: Request,
    props: {params: Promise<{storeId: string, categoryId: string}>}
) {
    try {

        const {userId} = await auth();
        const body = await req.json();

        const {name, bannerId} = body;

        const params = await props.params;

        if(!userId){
            return new NextResponse("Unauthenticated", {status: 401});
        }
        if(!name){
            return new NextResponse("Harus menginput nama" , {status: 400});
        }
        if(!bannerId){
            return new NextResponse("Harus menginput bannerId" , {status: 400});
        }
        if(!params.categoryId){
            return new NextResponse("Category Id dibutuhkan", {status: 400});
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
        
        const category = await db.category.update({
            where: {
                id: params.categoryId,
            },
            data: {
                name,
                bannerId,
            },
        });
        return NextResponse.json(category);    
        
    } catch (error) {
        console.log('[CATEGORY_PATCH]', error)
        return new NextResponse("Internal Error", {status: 500})
    }
}

export async function DELETE (
    req: Request,
    props: {params: Promise<{storeId: string, categoryId: string}>} 
) {
    try {

        const {userId} = await auth()
        const params = await props.params;
       

        if(!userId){
            return new NextResponse("Unauthenticated", {status: 401});
        }
        
        if(!params.categoryId){
            return new NextResponse("Category Id dibutuhkan", {status: 400});
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
        
        const category = await db.category.delete({
            where: {
                id: params.categoryId,
            },
        });
        return NextResponse.json(category);    
        
    } catch (error) {
        console.log('[CATEGORY_DELETE]', error)
        return new NextResponse("Internal Error", {status: 500})
    }
}