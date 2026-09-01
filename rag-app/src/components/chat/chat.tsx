"use client";

import { useChat } from "@ai-sdk/react";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import StopRoundedIcon from "@mui/icons-material/StopRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useTranslations } from "next-intl";
import {
  type KeyboardEvent,
  type SubmitEvent,
  useEffect,
  useRef,
  useState,
} from "react";

const transport = new DefaultChatTransport({
  api: "/api/ai/chat",
});

function getMessageText(message: UIMessage) {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

type ChatProps = {
  isVisible?: boolean;
};

export default function Chat({ isVisible = true }: ChatProps) {
  const t = useTranslations("Chat");
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, status, error, regenerate, stop } = useChat({
    transport,
  });

  const isBusy = status === "submitted" || status === "streaming";
  const latestMessage = messages.at(-1);
  const latestMessageText = latestMessage
    ? getMessageText(latestMessage)
    : undefined;

  useEffect(() => {
    if (isVisible && (latestMessageText !== undefined || status === "error")) {
      messagesEndRef.current?.scrollIntoView({ block: "end" });
    }
  }, [isVisible, latestMessageText, status]);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const message = input.trim();
    if (!message || isBusy) {
      return;
    }

    void sendMessage({ text: message });
    setInput("");
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
                  {getMessageText(message)}
                </Typography>
              </Box>
            </Stack>
          ))}

          {isBusy ? (
            <CircularProgress size={20} aria-label={t("sending")} />
          ) : null}

          {error ? (
            <Box>
              <Typography variant="body2" color="error">
                {t("requestError")}
              </Typography>
              <Button size="small" onClick={() => void regenerate()}>
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
        />
        {isBusy ? (
          <IconButton
            type="button"
            color="primary"
            aria-label={t("stop")}
            onClick={() => void stop()}
          >
            <StopRoundedIcon />
          </IconButton>
        ) : (
          <IconButton
            type="submit"
            color="primary"
            aria-label={t("send")}
            disabled={!input.trim()}
          >
            <SendRoundedIcon />
          </IconButton>
        )}
      </Box>
    </Paper>
  );
}
