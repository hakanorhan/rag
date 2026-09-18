"use client";

import SendRoundedIcon from "@mui/icons-material/SendRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useTranslations } from "next-intl";
import {
  type KeyboardEvent,
  type SubmitEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { askChat } from "@/app/actions/chat";
import { getProblemMessage, type ProblemDetail } from "@/lib/problemDetails";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

export default function Chat() {
  const t = useTranslations("Chat");
  const problemT = useTranslations("Problems");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isBusy, setIsBusy] = useState(false);
  const [requestFailure, setRequestFailure] = useState<{
    problem: ProblemDetail;
  } | null>(null);
  const lastFailedMessage = useRef("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const latestMessage = messages.at(-1);

  useEffect(() => {
    if (latestMessage !== undefined || requestFailure) {
      messagesEndRef.current?.scrollIntoView({ block: "end" });
    }
  }, [latestMessage, requestFailure]);

  async function requestAnswer(message: string) {
    setIsBusy(true);
    setRequestFailure(null);

    try {
      const response = await askChat(message);
      if (response.status === "error") {
        lastFailedMessage.current = message;
        setRequestFailure({ problem: response.problem });
        return;
      }
      setMessages((currentMessages) => [
        ...currentMessages,
        { id: crypto.randomUUID(), role: "assistant", text: response.answer },
      ]);
      lastFailedMessage.current = "";
    } finally {
      setIsBusy(false);
    }
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const message = input.trim();
    if (!message || isBusy) {
      return;
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      { id: crypto.randomUUID(), role: "user", text: message },
    ]);
    setInput("");
    void requestAnswer(message);
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <Paper
      elevation={8}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: { xs: 320, sm: 420 },
        overflow: "hidden",
        borderRadius: 3,
      }}
    >
      <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {t("title")}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {t("assistantLabel")}
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        <Stack spacing={2} aria-live="polite">
          {messages.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {t("messagePlaceholder")}
            </Typography>
          ) : null}

          {messages.map((message) => (
            <Stack
              key={message.id}
              spacing={0.5}
              sx={{
                alignItems: message.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {message.role === "user" ? t("userLabel") : t("assistantLabel")}
              </Typography>
              <Box
                sx={{
                  maxWidth: "90%",
                  p: 1.25,
                  borderRadius: 2,
                  bgcolor:
                    message.role === "user" ? "action.selected" : "transparent",
                }}
              >
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                  {message.text}
                </Typography>
              </Box>
            </Stack>
          ))}

          {isBusy ? (
            <CircularProgress size={20} aria-label={t("sending")} />
          ) : null}

          {requestFailure ? (
            <Box>
              <Typography variant="body2" color="error">
                {getProblemMessage(requestFailure.problem, problemT)}
              </Typography>
              <Button
                size="small"
                disabled={isBusy || !lastFailedMessage.current}
                onClick={() => void requestAnswer(lastFailedMessage.current)}
              >
                {t("retry")}
              </Button>
            </Box>
          ) : null}
          <Box ref={messagesEndRef} aria-hidden="true" />
        </Stack>
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          gap: 1,
          p: 1.5,
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        <TextField
          fullWidth
          multiline
          maxRows={3}
          size="small"
          placeholder={t("messagePlaceholder")}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          slotProps={{
            htmlInput: { "aria-label": t("messageLabel") },
            input: { onKeyDown: handleKeyDown },
          }}
          disabled={isBusy}
        />
        <IconButton
          type="submit"
          color="primary"
          aria-label={t("send")}
          disabled={!input.trim() || isBusy}
        >
          <SendRoundedIcon />
        </IconButton>
      </Box>
    </Paper>
  );
}
