"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTranslations } from "next-intl";
import { useActionState, useEffect, useRef, useState } from "react";
import { saveRagDocumentAction } from "@/app/actions/ragAdmin";
import ButtonComponent from "@/components/ButtonComponent";
import SelectComponent from "@/components/SelectComponent";
import { getProblemMessage } from "@/lib/problemDetails";
import { getRagAdminMessages } from "@/lib/ragAdminMessages";
import {
  type RagAdminActionState,
  type RagCategory,
  type RagDocument,
  ragCategories,
} from "@/types/ragDocument";

const INITIAL_STATE: RagAdminActionState = { status: "idle" };

export default function RagDocumentManager({
  initialDocuments,
  locale,
}: {
  initialDocuments: RagDocument[];
  locale: string;
}) {
  const t = getRagAdminMessages(locale);
  const problemT = useTranslations("Problems");
  const [documents, setDocuments] = useState(initialDocuments);
  const [category, setCategory] = useState<RagCategory>("AGB");
  const [editing, setEditing] = useState<RagDocument | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [failed, setFailed] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const saveAction = saveRagDocumentAction.bind(null, editing?.id);
  const [actionState, formAction, pending] = useActionState(
    saveAction,
    INITIAL_STATE,
  );

  useEffect(() => {
    if (actionState.status === "success") {
      const saved = actionState.document;
      setDocuments((current) => [
        saved,
        ...current.filter((document) => document.id !== saved.id),
      ]);
      setStatus(
        actionState.previousVersion === saved.version ? t.unchanged : t.saved,
      );
      setFailed(false);
      setEditing(null);
      setFile(null);
      if (fileInput.current) fileInput.current.value = "";
      return;
    }
    if (actionState.status === "error") {
      setFailed(true);
      setStatus(getProblemMessage(actionState.problem, problemT));
    }
  }, [actionState, problemT, t]);

  function selectDocument(document: RagDocument | null) {
    setEditing(document);
    setCategory(document?.category ?? "AGB");
    setFile(null);
    setStatus("");
    if (fileInput.current) fileInput.current.value = "";
  }

  return (
    <Stack spacing={4}>
      <Box component="form" action={formAction} aria-busy={pending}>
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
          <Box sx={{ maxWidth: 400 }}>
            <SelectComponent
              name="category"
              label={t.category}
              value={category}
              disabled={pending}
              onChange={(value) => setCategory(value as RagCategory)}
            >
              {ragCategories.map((value) => (
                <MenuItem key={value} value={value}>
                  {t.categories[value]}
                </MenuItem>
              ))}
            </SelectComponent>
          </Box>
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
              name="file"
              accept=".pdf,application/pdf"
              required
              disabled={pending}
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
          {editing && (
            <input type="hidden" name="version" value={editing.version} />
          )}
          <Stack direction="row" spacing={2}>
            <ButtonComponent type="submit" disabled={pending || !file}>
              {editing ? t.replace : t.upload}
            </ButtonComponent>
            {editing && (
              <ButtonComponent
                variant="text"
                size="medium"
                disabled={pending}
                onClick={() => selectDocument(null)}
              >
                {t.cancel}
              </ButtonComponent>
            )}
          </Stack>
          {(pending || status) && (
            <Alert
              severity={pending ? "info" : failed ? "error" : "success"}
              role="status"
            >
              {pending ? t.processing : status}
            </Alert>
          )}
        </Stack>
      </Box>
      <Box>
        <Typography component="h2" variant="h6">
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
              <ButtonComponent
                variant="text"
                size="medium"
                disabled={pending}
                onClick={() => selectDocument(document)}
              >
                {t.replaceDocument}
              </ButtonComponent>
            </Paper>
          ))}
        </Stack>
      </Box>
    </Stack>
  );
}
