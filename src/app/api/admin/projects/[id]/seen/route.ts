import { NextResponse } from "next/server";
import { getRepository } from "@/lib/admin/repository";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Params) {
  const { id } = await params;
  await getRepository().markSeenByAdmin(id);
  return NextResponse.json({ ok: true });
}
