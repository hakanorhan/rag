export type ProblemDetail = {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  code?: string;
};

type ProblemTranslations = {
  (key: string): string;
  has(key: string): boolean;
};

export function getProblemMessage(
  problem: ProblemDetail,
  translations: ProblemTranslations,
) {
  return problem.code && translations.has(problem.code)
    ? translations(problem.code)
    : translations("INTERNAL_SERVER_ERROR");
}

export class ProblemDetailError extends Error {
  constructor(readonly problem: ProblemDetail) {
    super(problem.code ?? "INTERNAL_SERVER_ERROR");
    this.name = "ProblemDetailError";
  }
}
