// src/app/api/menu/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Menu from "@/models/Menu";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // ปรับ path ตามจริงของ authOptions

// GET เมนูของร้าน
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "store") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const menus = await Menu.find({ storeId: session.user.id });
    return NextResponse.json(menus);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Server error" }, { status: 500 });
  }
}

// POST เพิ่มเมนูอาหาร
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "store") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, price, imageUrl, addons } = body;

    await connectDB();
    const menu = await Menu.create({
      storeId: session.user.id,
      name,
      price,
      imageUrl,
      addons,
    });

    return NextResponse.json(menu);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Server error" }, { status: 500 });
  }
}

// DELETE ลบเมนูอาหาร
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "store") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ message: "Id missing" }, { status: 400 });

    await connectDB();
    await Menu.findByIdAndDelete(id);

    return NextResponse.json({ message: "Menu deleted" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Server error" }, { status: 500 });
  }
}
