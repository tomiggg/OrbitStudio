import { NextResponse } from "next/server";
import { getRepository } from "@/lib/admin/repository";
import { PROJECT_STATUS_ORDER } from "@/lib/admin/types";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const project = await getRepository().getById(id);
  if (!project) {
    return NextResponse.json({ error: "Proyecto no encontrado." }, { status: 404 });
  }
  return NextResponse.json(project);
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const repo = getRepository();

  if (typeof body?.status === "string") {
    if (!PROJECT_STATUS_ORDER.includes(body.status)) {
      return NextResponse.json({ error: "Estado inválido." }, { status: 400 });
    }
    const updated = await repo.updateStatus(id, body.status);
    if (!updated) return NextResponse.json({ error: "Proyecto no encontrado." }, { status: 404 });
    return NextResponse.json(updated);
  }

  if (typeof body?.notes === "string") {
    const updated = await repo.updateNotes(id, body.notes);
    if (!updated) return NextResponse.json({ error: "Proyecto no encontrado." }, { status: 404 });
    return NextResponse.json(updated);
  }

  return NextResponse.json({ error: "Nada para actualizar." }, { status: 400 });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  const ok = await getRepository().deleteProject(id);
  if (!ok) return NextResponse.json({ error: "Proyecto no encontrado." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
