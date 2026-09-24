"use client";

import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { capturePaypalOrder, createPaypalOrder } from "@/app/actions/payment";
import { getProblemMessage } from "@/lib/problemDetails";

type Props = {
  clientId: string;
  reservationId: number;
  disabled: boolean;
  paid: boolean;
};

export default function PaypalButton({
  clientId,
  reservationId,
  disabled,
  paid,
}: Props) {
  const t = useTranslations("Reservation");
  const problemT = useTranslations("Problems");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [processing, setProcessing] = useState(false);

  if (paid || completed)
    return <Alert severity="success">{t("paymentComplete")}</Alert>;
  if (processing)
    return <Alert severity="info">{problemT("PAYMENT_PENDING")}</Alert>;
  if (!clientId)
    return <Typography variant="body2">{t("paymentUnavailable")}</Typography>;
  if (disabled)
    return <Typography variant="body2">{t("saveBeforePayment")}</Typography>;

  return (
    <>
      <PayPalScriptProvider
        options={{
          clientId,
          currency: "EUR",
          components: "buttons",
          intent: "capture",
        }}
      >
        <PayPalButtons
          fundingSource="paypal"
          createOrder={async () => {
            setError(null);
            const result = await createPaypalOrder(reservationId);
            if (result.status === "error") {
              if (result.problem.code === "PAYMENT_PENDING")
                setProcessing(true);
              else setError(getProblemMessage(result.problem, problemT));
              throw new Error("PayPal order creation failed");
            }
            return result.orderId;
          }}
          onApprove={async ({ orderID }) => {
            const result = await capturePaypalOrder(orderID);
            if (result.status === "error") {
              if (result.problem.code === "PAYMENT_PENDING")
                setProcessing(true);
              else setError(getProblemMessage(result.problem, problemT));
              return;
            }
            setCompleted(true);
            router.refresh();
          }}
          onError={() =>
            setError((current) => current ?? problemT("PROVIDER_ERROR"))
          }
          onCancel={() => setError(null)}
        >
          <Typography variant="body2">{t("paymentUnavailable")}</Typography>
        </PayPalButtons>
      </PayPalScriptProvider>
      {error ? <Alert severity="error">{error}</Alert> : null}
    </>
  );
}
