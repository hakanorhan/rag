"use client";

import {
  AssistantRuntimeProvider,
  type ChatModelAdapter,
  ComposerPrimitive,
  ErrorPrimitive,
  MessagePartPrimitive,
  MessagePrimitive,
  type SourceMessagePartProps,
  ThreadPrimitive,
  useLocalRuntime,
} from "@assistant-ui/react";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { keyframes } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useLocale, useTranslations } from "next-intl";
import { getProblemMessage, type ProblemDetail } from "@/lib/problemDetails";

function createChatModelAdapter(
  locale: string,
  getErrorMessage: (problem: ProblemDetail) => string,
): ChatModelAdapter {
  return {
    async *run({ messages, abortSignal }) {
      const latestMessage = messages.at(-1);
      if (latestMessage?.role !== "user") return;

      const message = latestMessage.content
        .filter((part) => part.type === "text")
        .map((part) => part.text)
        .join("");
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, locale }),
        signal: abortSignal,
      });

      if (!response.ok) {
        const problem = (await response.json()) as ProblemDetail;
        throw new Error(getErrorMessage(problem));
      }
      if (!response.body) {
        throw new Error("Response stream is missing");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let text = "";
      let buffer = "";
      const sources: Array<{
        type: "source";
        sourceType: "url";
        id: string;
        url: string;
        title: string;
      }> = [];

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split(/\r?\n\r?\n/);
        buffer = events.pop() ?? "";

        for (const event of events) {
          let eventName = "message";
          let data = "";
          for (const line of event.split(/\r?\n/)) {
            if (line.startsWith("event:")) eventName = line.slice(6).trim();
            if (line.startsWith("data:")) data += line.slice(5);
          }
          if (eventName === "source" && data) {
            sources.push({
              type: "source",
              sourceType: "url",
              id: data,
              url: data,
              title: data.split("/").pop() ?? data,
            });
          } else if (eventName === "message") {
            text += data;
            yield {
              content: [...sources, { type: "text", text }],
            };
          }
        }
      }
    },
  };
}

const bounce = keyframes`
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30% { transform: translateY(-4px); opacity: 1; }
`;

function TypingIndicator({ label }: { label: string }) {
  return (
    <Box role="status" aria-label={label} sx={{ display: "flex", gap: 0.5 }}>
      {[0, 1, 2].map((index) => (
        <Box
          component="span"
          key={index}
          sx={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            bgcolor: "text.secondary",
            animation: `${bounce} 1.2s ${index * 0.15}s infinite`,
          }}
        />
      ))}
    </Box>
  );
}

const messageParts = {
  Text: () => <MessagePartPrimitive.Text />,
  Source: ({ url, title }: SourceMessagePartProps) =>
    url ? (
      <Typography component="div" sx={{ display: "block", mb: 0.5 }}>
        <Box
          component="a"
          href={url}
          target="_blank"
          rel="noreferrer"
          sx={{ color: "primary.main", textDecoration: "underline" }}
        >
          {title ?? url}
        </Box>
      </Typography>
    ) : null,
};

export default function Chat() {
  const locale = useLocale();
  const t = useTranslations("Chat");
  const problemT = useTranslations("Problems");
  const runtime = useLocalRuntime(
    createChatModelAdapter(locale, (problem) =>
      getProblemMessage(problem, problemT),
    ),
  );

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <ThreadPrimitive.Root asChild>
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

          <ThreadPrimitive.Viewport asChild>
            <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
              <Stack spacing={2} aria-live="polite">
                <ThreadPrimitive.Messages>
                  {({ message }) => {
                    const isUser = message.role === "user";
                    const isWaiting =
                      !isUser &&
                      message.status?.type === "running" &&
                      message.content.length === 0;

                    return (
                      <MessagePrimitive.Root asChild>
                        <Stack
                          spacing={0.5}
                          sx={{
                            alignItems: isUser ? "flex-end" : "flex-start",
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            {isUser ? t("userLabel") : t("assistantLabel")}
                          </Typography>
                          <Box
                            sx={{
                              maxWidth: "90%",
                              p: 1.25,
                              borderRadius: 2,
                              bgcolor: isUser
                                ? "action.selected"
                                : "transparent",
                              whiteSpace: "pre-wrap",
                            }}
                          >
                            {isWaiting ? (
                              <TypingIndicator label={t("sending")} />
                            ) : null}
                            <MessagePrimitive.Parts components={messageParts} />
                            <MessagePrimitive.Error>
                              <ErrorPrimitive.Root>
                                <Typography variant="body2" color="error">
                                  <ErrorPrimitive.Message />
                                </Typography>
                              </ErrorPrimitive.Root>
                            </MessagePrimitive.Error>
                          </Box>
                        </Stack>
                      </MessagePrimitive.Root>
                    );
                  }}
                </ThreadPrimitive.Messages>
              </Stack>
            </Box>
          </ThreadPrimitive.Viewport>

          <ComposerPrimitive.Root asChild>
            <Box
              component="form"
              sx={{
                display: "flex",
                gap: 1,
                p: 1.5,
                borderTop: 1,
                borderColor: "divider",
                "& textarea": {
                  flex: 1,
                  width: "100%",
                  px: 1.5,
                  py: 1,
                  resize: "none",
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 1,
                  outline: "none",
                  font: "inherit",
                  color: "text.primary",
                  bgcolor: "background.paper",
                },
                "& textarea:focus": {
                  borderColor: "primary.main",
                },
              }}
            >
              <ComposerPrimitive.Input
                minRows={1}
                maxRows={3}
                placeholder={t("messagePlaceholder")}
                aria-label={t("messageLabel")}
              />
              <ComposerPrimitive.Send asChild>
                <IconButton color="primary" aria-label={t("send")}>
                  <SendRoundedIcon />
                </IconButton>
              </ComposerPrimitive.Send>
            </Box>
          </ComposerPrimitive.Root>
        </Paper>
      </ThreadPrimitive.Root>
    </AssistantRuntimeProvider>
  );
}
