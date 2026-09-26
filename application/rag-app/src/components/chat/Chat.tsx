import { getLocale, getTranslations } from "next-intl/server";
import ChatClient, { type ChatLabels } from "./ChatClient";

export default async function Chat() {
  const [locale, t] = await Promise.all([getLocale(), getTranslations("Chat")]);
  const labels: ChatLabels = {
    title: t("title"),
    userLabel: t("userLabel"),
    assistantLabel: t("assistantLabel"),
    messageLabel: t("messageLabel"),
    messagePlaceholder: t("messagePlaceholder"),
    open: t("open"),
    close: t("close"),
    send: t("send"),
    sending: t("sending"),
  };

  return <ChatClient locale={locale} labels={labels} />;
}
