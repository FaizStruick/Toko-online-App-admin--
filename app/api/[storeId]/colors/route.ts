import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { userId } = await auth();
    const { storeId } = await params;
    const body = await req.json();
    const { name, value } = body;

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!value) return new NextResponse("Value is required", { status: 400 });
    if (!storeId) return new NextResponse("Store id is required", { status: 400 });

    const storeByUserId = await db.store.findFirst({
      where: { id: storeId, userId }
    });

    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 405 });

    const color = await db.color.create({
      data: { name, value, storeId }
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log('[COLORS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { storeId } = await params;

    if (!storeId) return new NextResponse("Store id is required", { status: 400 });

    const colors = await db.color.findMany({
      where: { storeId }
    });

    return NextResponse.json(colors);
  } catch (error) {
    console.log('[COLORS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}