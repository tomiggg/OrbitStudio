import { NextResponse } from "next/server";
import { getRepository } from "@/lib/admin/repository";

type Params = { params: Promise<{ token: string }> };

export async function POST(request: Request, { params }: Params) {
  const { token } = await params;
  const body = await request.json().catch(() => null);
  const text = typeof body?.body === "string" ? body.body.trim() : "";
  if (!text) {
    return NextResponse.json({ error: "El comentario no puede estar vacío." }, { status: 400 });
  }

  const repo = getRepository();
  const project = await repo.getByToken(token);
  if (!project) {
    return NextResponse.json({ error: "Proyecto no encontrado." }, { status: 404 });
  }

  const comment = await repo.addComment(project.id, "client", project.clientName, text);
  if (!comment) {
    return NextResponse.json({ error: "Proyecto no encontrado." }, { status: 404 });
  }
  return NextResponse.json(comment, { status: 201 });
}
