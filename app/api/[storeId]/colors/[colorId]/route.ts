import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ storeId: string; colorId: string }> }
) {
  try {
    const { userId } = await auth();
    const { storeId, colorId } = await params;
    const body = await req.json();
    const { name, value } = body;

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!value) return new NextResponse("Value is required", { status: 400 });
    if (!colorId) return new NextResponse("Color id is required", { status: 400 });

    const storeByUserId = await db.store.findFirst({
      where: { id: storeId, userId }
    });

    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 405 });

    const color = await db.color.update({
      where: { id: colorId },
      data: { name, value }
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log('[COLOR_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ storeId: string; colorId: string }> }
) {
  try {
    const { userId } = await auth();
    const { storeId, colorId } = await params;

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!colorId) return new NextResponse("Color id is required", { status: 400 });

    const storeByUserId = await db.store.findFirst({
      where: { id: storeId, userId }
    });

    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 405 });

    const color = await db.color.delete({
      where: { id: colorId }
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log('[COLOR_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}