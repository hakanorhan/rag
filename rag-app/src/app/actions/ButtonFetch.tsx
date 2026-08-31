"use client";

import SendRoundedIcon from "@mui/icons-material/SendRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useTranslations } from "next-intl";
import { type SubmitEvent, useState } from "react";
import handleFetch from "./handleFetch";

export default function ButtonFetch() {
  const t = useTranslations("Faq");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const message = question.trim();
    if (!message || isLoading) {
      return;
    }

    setIsLoading(true);
    setAnswer("");

    try {
      setAnswer(await handleFetch(message));
    } catch {
      setAnswer(t("requestError"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField
          label={t("questionLabel")}
          multiline
          minRows={4}
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          disabled={isLoading}
          required
          fullWidth
        />

        <Button
          type="submit"
          variant="contained"
          startIcon={<SendRoundedIcon />}
          disabled={!question.trim() || isLoading}
          sx={{ alignSelf: "flex-start", minWidth: 140 }}
        >
          {isLoading ? t("submitting") : t("submit")}
        </Button>

        <TextField
          label={t("answerLabel")}
          multiline
          minRows={6}
          value={answer}
          disabled
          fullWidth
        />
      </Stack>
    </Box>
  );
}
