import { NextResponse } from "next/server";
import { getRepository } from "@/lib/admin/repository";
import { extractFileFromForm } from "@/lib/admin/uploadValidation";

type Params = { params: Promise<{ token: string }> };

export async function POST(request: Request, { params }: Params) {
  const { token } = await params;
  const extracted = await extractFileFromForm(request);
  if ("error" in extracted) {
    return NextResponse.json({ error: extracted.error }, { status: 400 });
  }

  const repo = getRepository();
  const project = await repo.getByToken(token);
  if (!project) {
    return NextResponse.json({ error: "Proyecto no encontrado." }, { status: 404 });
  }

  const file = await repo.addFile(project.id, {
    name: extracted.name,
    size: extracted.size,
    mimeType: extracted.mimeType,
    uploadedBy: "client",
    buffer: extracted.buffer,
  });
  if (!file) {
    return NextResponse.json({ error: "Proyecto no encontrado." }, { status: 404 });
  }
  return NextResponse.json(file, { status: 201 });
}
