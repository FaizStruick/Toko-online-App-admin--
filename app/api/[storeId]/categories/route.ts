import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    {params}: {params: Promise<{storeId: string}>}
){
    try {
        const {userId} = await auth()
        const body = await req.json();

        const {name, bannerId} = body;

        const {storeId} =  await params;

        if(!userId){
            return new NextResponse("Unauthenticated", {status: 401});
        }

        if(!name){
            return new NextResponse("Nama category perlu diinput", {status: 400});
        }

        if(!bannerId){
            return new NextResponse("Banner Id perlu diinput", {status: 400});
        }

        if(!storeId){
            return new NextResponse("Store id URL dibutuhkan")
        }

        const storeByUserId = await db.store.findFirst({
            where: {
                id: storeId,
                userId
            }

        })

        if(!storeByUserId) {
            return new NextResponse("Unauthorized", {status: 403})
        }

        const category = await db.category.create({
            data: {
                name,
                bannerId,
                storeId: storeId,
            }
        })

        return NextResponse.json(category);

    } catch ( error ){
        console.log("[CATEGORIES_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(
    req: Request,
    {params}: {params: Promise<{storeId: string}>}
){
    
    try {
        const resolvedParams = await params;
        const storeId  = resolvedParams.storeId; 

        if(!storeId){
            return new NextResponse("Store id URL dibutuhkan", {status: 400});
        }

        const categories = await db.category.findMany({
            where: {
                storeId: storeId,
            },
            include: {
                banner: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(categories, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            }
        });

    } catch ( error ){
        console.log("[CATEGORIES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}