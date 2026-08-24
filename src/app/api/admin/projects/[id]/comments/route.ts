import { NextResponse } from "next/server";
import { getRepository } from "@/lib/admin/repository";
import { getCurrentAdminName } from "@/lib/admin/currentAdmin";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const text = typeof body?.body === "string" ? body.body.trim() : "";
  if (!text) {
    return NextResponse.json({ error: "El comentario no puede estar vacío." }, { status: 400 });
  }

  const adminName = (await getCurrentAdminName()) ?? "Shift Studio";
  const comment = await getRepository().addComment(id, "admin", adminName, text);
  if (!comment) {
    return NextResponse.json({ error: "Proyecto no encontrado." }, { status: 404 });
  }
  return NextResponse.json(comment, { status: 201 });
}
