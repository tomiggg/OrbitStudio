import { getRepository } from "@/lib/admin/repository";

type Params = { params: Promise<{ projectId: string; fileId: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { projectId, fileId } = await params;
  const result = await getRepository().getFileBuffer(projectId, fileId);
  if (!result) {
    return new Response("Archivo no encontrado.", { status: 404 });
  }

  const { buffer, file } = result;
  const encodedName = encodeURIComponent(file.name);
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": file.mimeType,
      "Content-Length": String(file.size),
      "Content-Disposition": `attachment; filename="${encodedName}"; filename*=UTF-8''${encodedName}`,
      "Cache-Control": "private, max-age=0, no-cache",
    },
  });
}
