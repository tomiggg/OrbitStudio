import { NextResponse } from "next/server";
import { getRepository, toPublicProject } from "@/lib/admin/repository";

type Params = { params: Promise<{ token: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { token } = await params;
  const project = await getRepository().getByToken(token);
  if (!project) {
    return NextResponse.json({ error: "Proyecto no encontrado." }, { status: 404 });
  }
  return NextResponse.json(toPublicProject(project));
}
