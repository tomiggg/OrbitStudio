const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const BLOCKED_EXTENSIONS = [".exe", ".bat", ".cmd", ".sh", ".msi", ".com", ".scr", ".ps1"];

export type ExtractedFile = {
  name: string;
  size: number;
  mimeType: string;
  buffer: Uint8Array;
};

export async function extractFileFromForm(
  request: Request
): Promise<ExtractedFile | { error: string }> {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return { error: "No se pudo leer el archivo." };
  }

  const entry = form.get("file");
  if (!(entry instanceof File)) {
    return { error: "No se recibió ningún archivo." };
  }
  if (entry.size === 0) {
    return { error: "El archivo está vacío." };
  }
  if (entry.size > MAX_FILE_SIZE) {
    return { error: "El archivo supera el límite de 20MB." };
  }
  const lowerName = entry.name.toLowerCase();
  if (BLOCKED_EXTENSIONS.some((ext) => lowerName.endsWith(ext))) {
    return { error: "Ese tipo de archivo no está permitido." };
  }

  const buffer = new Uint8Array(await entry.arrayBuffer());
  return {
    name: entry.name,
    size: entry.size,
    mimeType: entry.type || "application/octet-stream",
    buffer,
  };
}
