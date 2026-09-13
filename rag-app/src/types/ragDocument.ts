export const ragCategories = [
  "AGB",
  "MIETVERTRAG",
  "DATENSCHUTZ",
  "VERSICHERUNG",
  "SONSTIGES",
] as const;

export type RagCategory = (typeof ragCategories)[number];

export interface RagDocument {
  id: string;
  category: RagCategory;
  filename: string;
  sizeBytes: number;
  sha256: string;
  version: number;
  pageCount: number;
  chunkCount: number;
  createdAt: string;
  updatedAt: string;
}

export type RagAdminActionState =
  | { status: "idle" }
  | {
      status: "success";
      document: RagDocument;
      previousVersion?: number;
    }
  | {
      status: "error";
      httpStatus?: number;
      code?: string;
      detail?: string;
    };
