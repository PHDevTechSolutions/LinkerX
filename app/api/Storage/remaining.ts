// app/api/remaining/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.resolve("remaining.json");

export async function GET() {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    return NextResponse.json(parsed);
  } catch (error) {
    return NextResponse.json({ date: "", leftover: 0 });
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const today = new Date().toISOString().slice(0, 10);

  const content = {
    date: today,
    leftover: body.leftover || 0,
  };

  fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
  return NextResponse.json({ message: "Saved successfully" });
}
