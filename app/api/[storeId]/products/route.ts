import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    props: {params: Promise<{storeId: string}>}
){
    try {
        const {userId} = await auth()
        const body = await req.json();

        const {
            name,
            price,
            categoryId,
            sizeId,
            colorId,
            images,
            isFeatured,
            isArchived,
        } = body;

        const params = await props.params;

        if(!userId){
            return new NextResponse("Unauthorized", {status: 401});
        }

        if(!name){
            return new NextResponse("Nama product perlu diinput", {status: 400});
        }
        
        if(!images || !images.length){
            return new NextResponse("Gambar product perlu diinput", {status: 400});
        }

        if(!price){
            return new NextResponse("Harga product perlu diinput", {status: 400});
        }

        if(!categoryId){
            return new NextResponse("Category ID perlu diinput", {status: 400});
        }

        if(!sizeId){
            return new NextResponse("Size ID perlu diinput", {status: 400});
        }

        if(!colorId){
            return new NextResponse("Color ID perlu diinput", {status: 400});
        }

        if(!params.storeId){
            return new NextResponse("Store id URL dibutuhkan" , {status: 400});
        }

        const storeByUserId = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }

        })

        if(!storeByUserId) {
            return new NextResponse("Unauthorized", {status: 500})
        }

        const product = await db.product.create({
            data: {
                name,
                price,
                categoryId,
                sizeId,
                colorId,
                isFeatured,
                isArchived,
                storeId: params.storeId,
                images : {
                    createMany: {
                        data: [
                            ...images.map((image: {url: string}) => image)
                        ]
                    }
                }
            },
        });

        return NextResponse.json(product);

    } catch ( error ){
        console.log("[PRODUCTS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(
    req: Request,
    props : {params: Promise<{storeId: string}>}
){
    const params = await props.params;

    try {
        const {searchParams} = new URL(req.url);
        const categoryId = searchParams.get("categoryId") || undefined;
        const sizeId = searchParams.get("sizeId") || undefined;
        const colorId = searchParams.get("colorId") || undefined;
        const isFeatured = searchParams.get("isFeatured");
        const name = searchParams.get("name") || undefined;

        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "8");
        const skip = (page - 1) * limit;

        if(!params.storeId){
            return new NextResponse("Store id URL dibutuhkan")
        }

        const products = await db.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                sizeId,
                colorId,
                isFeatured: isFeatured === "true" ? true : undefined,
                isArchived: false,
                name: name
                    ? {
                        contains: name,
                        mode: "insensitive"
                    }
                    : undefined,
            },
            include: {
                images: true,
                category: true,
                size: true,
                color: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            skip,
            take: limit,
        });

        return NextResponse.json(products);

    } catch ( error ){
        console.log("[PRODUCTS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}