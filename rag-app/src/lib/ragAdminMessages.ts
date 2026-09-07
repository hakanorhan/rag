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
  requestError:
    "Die Anfrage konnte nicht abgeschlossen werden. Lade die Seite neu und prüfe den Dokumentstand vor einem erneuten Upload.",
  forbidden: "Für diese Seite ist die Admin-Rolle erforderlich.",
  loginExpired:
    "Die Anmeldung ist abgelaufen. Lade die Seite neu und melde dich erneut an.",
  conflict:
    "Das Dokument wurde inzwischen aktualisiert. Lade die Seite neu, bevor du es ersetzt.",
  duplicate: "Eine PDF mit demselben SHA-256 ist bereits gespeichert.",
  invalidPdf: "Bitte eine gültige, nicht leere PDF-Datei auswählen.",
  tooLarge: "Eine PDF darf höchstens 20 MB groß sein.",
  missing: "Das Dokument wurde nicht gefunden. Lade die Seite neu.",
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
  requestError:
    "The request could not be completed. Reload the page and check the document status before uploading again.",
  forbidden: "The admin role is required to access this page.",
  loginExpired: "Your session has expired. Reload the page and sign in again.",
  conflict:
    "This document has been updated. Reload the page before replacing it.",
  duplicate: "A PDF with the same SHA-256 is already stored.",
  invalidPdf: "Choose a valid, non-empty PDF file.",
  tooLarge: "Each PDF must be no larger than 20 MB.",
  missing: "Document not found. Reload the page.",
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
