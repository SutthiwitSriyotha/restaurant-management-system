import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Menu from "@/models/Menu";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// GET เมนูของร้าน
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "store") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const menus = await Menu.find({ storeId: session.user.id });
  return NextResponse.json(menus);
}

// เพิ่มเมนูอาหาร
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "store") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, price, imageUrl, addons } = body;

  await connectDB();
  const menu = await Menu.create({
    storeId: session.user.id, // ใช้ id ร้านจาก session
    name,
    price,
    imageUrl,
    addons,
  });

  return NextResponse.json(menu);
}

// ลบเมนูอาหาร
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "store") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const id = req.url.split("id=")[1]; // query ?id=
  if (!id) return NextResponse.json({ message: "Id missing" }, { status: 400 });

  await connectDB();
  await Menu.findByIdAndDelete(id);
  return NextResponse.json({ message: "Menu deleted" });
}
