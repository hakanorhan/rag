const de = {
  title: "RAG-Dokumente verwalten",
  intro:
    "PDFs nach Kategorie hochladen und bestehende Dokumente aktualisieren.",
  newDocument: "PDF hochladen",
  replaceDocument: "PDF aktualisieren",
  category: "Kategorie",
  chooseFile: "PDF-Datei auswählen",
  chooseReplacement: "Neue PDF auswählen",
  limits: "Maximal 20 MB pro PDF.",
  upload: "Hochladen und einlesen",
  replace: "PDF ersetzen und einlesen",
  cancel: "Abbrechen",
  processing: "PDF wird eingelesen …",
  saved: "Gespeichert und für die Suche verfügbar.",
  unchanged:
    "Die PDF ist unverändert. Es wurden keine neuen Embeddings erstellt.",
  documents: "Gespeicherte Dokumente",
  empty: "Noch keine PDFs hochgeladen.",
  id: "Dokument-ID",
  version: "Version",
  pages: "Seiten",
  chunks: "Textabschnitte",
  metadata: "Metadaten anzeigen",
  replaceHint:
    "Die Dokument-ID bleibt erhalten. Die neue PDF ersetzt die bisherigen Inhalte und Suchdaten nach erfolgreicher Verarbeitung.",
  categories: {
    AGB: "AGB",
    MIETVERTRAG: "Mietvertrag",
    DATENSCHUTZ: "Datenschutz",
    VERSICHERUNG: "Versicherung",
    SONSTIGES: "Sonstiges",
  },
};

const en: typeof de = {
  title: "Manage RAG documents",
  intro: "Upload PDFs by category and update existing documents.",
  newDocument: "Upload PDF",
  replaceDocument: "Update PDF",
  category: "Category",
  chooseFile: "Choose PDF file",
  chooseReplacement: "Choose replacement PDF",
  limits: "Maximum 20 MB per PDF.",
  upload: "Upload and index",
  replace: "Replace and index PDF",
  cancel: "Cancel",
  processing: "Indexing PDF …",
  saved: "Saved and available for search.",
  unchanged: "The PDF is unchanged. No new embeddings were created.",
  documents: "Saved documents",
  empty: "No PDFs uploaded yet.",
  id: "Document ID",
  version: "Version",
  pages: "Pages",
  chunks: "Text chunks",
  metadata: "Show metadata",
  replaceHint:
    "The document ID stays the same. The new PDF replaces the previous content and search data after processing succeeds.",
  categories: {
    AGB: "Terms and conditions",
    MIETVERTRAG: "Rental agreement",
    DATENSCHUTZ: "Privacy policy",
    VERSICHERUNG: "Insurance",
    SONSTIGES: "Other",
  },
};

export function getRagAdminMessages(locale: string) {
  return locale === "de" ? de : en;
}
