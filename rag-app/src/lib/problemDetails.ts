export type ProblemDetail = {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  code?: string;
};

export function parseProblemDetail(response: Response) {
  return response.json().catch(() => null) as Promise<ProblemDetail | null>;
}
