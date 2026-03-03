import { NextResponse } from "next/server";
import { sendComplaint } from "@/lib/mail";

export async function POST(req: Request) {
  const data = await req.json();
  if (!data.name || !data.email || !data.message) {
    return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
  }

  const result = await sendComplaint(data);
  return NextResponse.json(result);
}
