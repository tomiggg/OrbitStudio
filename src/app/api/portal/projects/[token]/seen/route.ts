import { NextResponse } from "next/server";
import { getRepository } from "@/lib/admin/repository";

type Params = { params: Promise<{ token: string }> };

export async function POST(_request: Request, { params }: Params) {
  const { token } = await params;
  const project = await getRepository().getByToken(token);
  if (!project) {
    return NextResponse.json({ error: "Proyecto no encontrado." }, { status: 404 });
  }
  await getRepository().markSeenByClient(project.id);
  return NextResponse.json({ ok: true });
}
