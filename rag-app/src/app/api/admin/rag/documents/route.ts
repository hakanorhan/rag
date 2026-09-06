import { proxyRagUpload } from "./upload";

export function POST(request: Request) {
  return proxyRagUpload({ request });
}
