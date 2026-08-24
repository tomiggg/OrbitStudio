import { NextResponse } from "next/server";
import { getRepository } from "@/lib/admin/repository";

export async function GET() {
  const projects = await getRepository().list();
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const clientName = typeof body?.clientName === "string" ? body.clientName.trim() : "";
  const projectName = typeof body?.projectName === "string" ? body.projectName.trim() : "";

  if (!clientName || !projectName) {
    return NextResponse.json(
      { error: "Cliente y proyecto son obligatorios." },
      { status: 400 }
    );
  }

  const project = await getRepository().create({ clientName, projectName });
  return NextResponse.json(project, { status: 201 });
}
