"use client";

import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import {
  INSTANCE_LOADING_STATE,
  PayPalOneTimePaymentButton,
  PayPalProvider,
  usePayPal,
} from "@paypal/react-paypal-js/sdk-v6";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { capturePaypalOrder, createPaypalOrder } from "@/app/actions/payment";
import { getProblemMessage, type ProblemDetail } from "@/lib/problemDetails";

type PaypalConfig = {
  clientId: string;
  environment: "sandbox" | "production";
};

type Props = {
  reservationId: number;
  disabled: boolean;
  paid: boolean;
};

export default function PaypalButton({ reservationId, disabled, paid }: Props) {
  const t = useTranslations("Reservation");
  const [config, setConfig] = useState<PaypalConfig | null>();

  useEffect(() => {
    if (paid || disabled) return;
    const controller = new AbortController();

    fetch("/api/paypal/config", { signal: controller.signal })
      .then((response) => {
        if (!response.ok)
          throw new Error("Could not load PayPal configuration");
        return response.json() as Promise<PaypalConfig>;
      })
      .then(setConfig)
      .catch(() => {
        if (!controller.signal.aborted) setConfig(null);
      });

    return () => controller.abort();
  }, [paid, disabled]);

  if (paid)
    return <Typography variant="body2">{t("paymentComplete")}</Typography>;
  if (disabled)
    return <Typography variant="body2">{t("saveBeforePayment")}</Typography>;
  if (config === undefined) return null;
  if (!config?.clientId)
    return <Typography variant="body2">{t("paymentUnavailable")}</Typography>;

  return (
    <PayPalProvider
      clientId={config.clientId}
      environment={config.environment}
      pageType="checkout"
    >
      <PaypalCheckout reservationId={reservationId} />
    </PayPalProvider>
  );
}

function PaypalCheckout({ reservationId }: { reservationId: number }) {
  const t = useTranslations("Reservation");
  const problemT = useTranslations("Problems");
  const router = useRouter();
  const { loadingStatus } = usePayPal();
  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [completed, setCompleted] = useState(false);

  if (completed)
    return <Typography variant="body2">{t("paymentComplete")}</Typography>;
  if (problem?.code === "PAYMENT_PENDING")
    return <Alert severity="info">{problemT("PAYMENT_PENDING")}</Alert>;
  if (loadingStatus === INSTANCE_LOADING_STATE.REJECTED)
    return <Typography variant="body2">{t("paymentUnavailable")}</Typography>;

  return (
    <>
      <PayPalOneTimePaymentButton
        createOrder={async () => {
          setProblem(null);
          const result = await createPaypalOrder(reservationId);
          if (result.status === "error") {
            setProblem(result.problem);
            throw new Error("PayPal order creation failed");
          }
          return { orderId: result.orderId };
        }}
        onApprove={async ({ orderId }) => {
          const result = await capturePaypalOrder(orderId);
          if (result.status === "error") {
            setProblem(result.problem);
            throw new Error("PayPal order capture failed");
          }
          setCompleted(true);
          toast.success(t("paymentComplete"), {
            id: "paypal-payment-complete",
          });
          router.refresh();
        }}
        onError={() =>
          setProblem((current) => current ?? { code: "PROVIDER_ERROR" })
        }
        onCancel={() => setProblem(null)}
      />
      {problem ? (
        <Alert severity="error">{getProblemMessage(problem, problemT)}</Alert>
      ) : null}
    </>
  );
}
