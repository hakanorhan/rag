"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { type FormEvent, useRef, useState } from "react";
import { getRagAdminMessages } from "@/lib/ragAdminMessages";
import {
  type RagCategory,
  type RagDocument,
  ragCategories,
} from "@/types/ragDocument";

export default function RagDocumentManager({
  initialDocuments,
  locale,
}: {
  initialDocuments: RagDocument[];
  locale: string;
}) {
  const t = getRagAdminMessages(locale);
  const [documents, setDocuments] = useState(initialDocuments);
  const [category, setCategory] = useState<RagCategory>("AGB");
  const [editing, setEditing] = useState<RagDocument | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [failed, setFailed] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  function selectDocument(document: RagDocument | null) {
    setEditing(document);
    setCategory(document?.category ?? "AGB");
    setFile(null);
    setStatus("");
    if (fileInput.current) fileInput.current.value = "";
  }

  function errorMessage(status: number, code?: string) {
    if (status === 401) return t.loginExpired;
    if (status === 403) return t.forbidden;
    if (status === 409 && code === "DOCUMENT_ALREADY_EXISTS")
      return t.duplicate;
    if (status === 409) return t.conflict;
    if (status === 413) return t.tooLarge;
    const errors: Record<string, string> = {
      INVALID_PDF: t.invalidPdf,
      PDF_TOO_LARGE: t.tooLarge,
      ENCRYPTED_PDF: t.encrypted,
      PDF_NO_TEXT: t.noText,
      PDF_TOO_MANY_PAGES: t.tooManyPages,
      PDF_TOO_MUCH_TEXT: t.tooMuchText,
      DOCUMENT_NOT_FOUND: t.missing,
    };
    return errors[code ?? ""] ?? t.requestError;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file || busy) return;

    const data = new FormData();
    data.set("file", file);
    data.set("category", category);
    if (editing) data.set("version", String(editing.version));

    setBusy(true);
    setFailed(false);
    setStatus(t.processing);
    try {
      const response = await fetch(
        editing
          ? `/api/admin/rag/documents/${editing.id}`
          : "/api/admin/rag/documents",
        { method: editing ? "PUT" : "POST", body: data },
      );
      if (!response.ok) {
        const problem = await response.json().catch(() => null);
        setFailed(true);
        setStatus(
          errorMessage(response.status, problem?.detail ?? problem?.code),
        );
        return;
      }
      const saved: RagDocument = await response.json();
      setDocuments((current) => [
        saved,
        ...current.filter((document) => document.id !== saved.id),
      ]);
      setStatus(editing?.version === saved.version ? t.unchanged : t.saved);
      setEditing(null);
      setFile(null);
      if (fileInput.current) fileInput.current.value = "";
    } catch {
      setFailed(true);
      setStatus(t.requestError);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Stack spacing={4}>
      <Box component="form" onSubmit={handleSubmit} aria-busy={busy}>
        <Stack spacing={2}>
          <Typography component="h2" variant="h6">
            {editing ? t.replaceDocument : t.newDocument}
          </Typography>
          {editing && (
            <Alert severity="info">
              {editing.filename} · {t.id}: {editing.id}
              <br />
              {t.replaceHint}
            </Alert>
          )}
          <TextField
            select
            label={t.category}
            value={category}
            disabled={busy}
            onChange={(event) => setCategory(event.target.value as RagCategory)}
            sx={{ maxWidth: 400 }}
          >
            {ragCategories.map((value) => (
              <MenuItem key={value} value={value}>
                {t.categories[value]}
              </MenuItem>
            ))}
          </TextField>
          <Box>
            <Typography
              component="label"
              htmlFor="rag-pdf-upload"
              sx={{ display: "block", mb: 1 }}
            >
              {editing ? t.chooseReplacement : t.chooseFile}
            </Typography>
            <input
              id="rag-pdf-upload"
              ref={fileInput}
              type="file"
              accept=".pdf,application/pdf"
              required
              disabled={busy}
              aria-describedby="rag-pdf-limits"
              onChange={(event) => {
                setFile(event.target.files?.[0] ?? null);
                setStatus("");
              }}
            />
            <Typography
              id="rag-pdf-limits"
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              {t.limits}
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button type="submit" variant="contained" disabled={busy || !file}>
              {editing ? t.replace : t.upload}
            </Button>
            {editing && (
              <Button disabled={busy} onClick={() => selectDocument(null)}>
                {t.cancel}
              </Button>
            )}
          </Stack>
          {status && (
            <Alert
              severity={failed ? "error" : busy ? "info" : "success"}
              role="status"
            >
              {status}
            </Alert>
          )}
        </Stack>
      </Box>
      <Box>
        <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
          {t.documents} ({documents.length})
        </Typography>
        {documents.length === 0 && <Typography>{t.empty}</Typography>}
        <Stack spacing={2}>
          {documents.map((document) => (
            <Paper
              key={document.id}
              variant="outlined"
              sx={{ p: 2, overflowWrap: "anywhere" }}
            >
              <Typography component="h3" variant="subtitle1">
                {document.filename}
              </Typography>
              <Typography variant="body2">
                {t.categories[document.category]} · {t.version}{" "}
                {document.version}
              </Typography>
              <Typography variant="body2">
                {t.id}: {document.id}
              </Typography>
              <Box component="details" sx={{ my: 1 }}>
                <summary>{t.metadata}</summary>
                <Typography variant="body2">
                  {t.pages}: {document.pageCount} · {t.chunks}:{" "}
                  {document.chunkCount}
                </Typography>
                <Typography variant="body2">
                  SHA-256: {document.sha256}
                </Typography>
              </Box>
              <Button disabled={busy} onClick={() => selectDocument(document)}>
                {t.replaceDocument}
              </Button>
            </Paper>
          ))}
        </Stack>
      </Box>
    </Stack>
  );
}
