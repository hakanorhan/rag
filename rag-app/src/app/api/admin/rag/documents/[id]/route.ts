import { proxyRagUpload } from "../upload";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  return proxyRagUpload({ request, id });
}
