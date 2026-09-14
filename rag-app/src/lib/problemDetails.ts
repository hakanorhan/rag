export type ProblemDetail = {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  code: string;
};

type ProblemTranslations = (key: string) => string;

export function getProblemMessage(
  problem: ProblemDetail,
  translations: ProblemTranslations,
) {
  return translations(problem.code);
}

export class ProblemDetailError extends Error {
  constructor(readonly problem: ProblemDetail) {
    super(problem.code);
    this.name = "ProblemDetailError";
  }
}
