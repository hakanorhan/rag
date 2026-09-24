package com.example.carservice.payment.paypal;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

import com.paypal.sdk.Environment;
import com.paypal.sdk.PaypalServerSdkClient;
import com.paypal.sdk.authentication.ClientCredentialsAuthModel;
import com.paypal.sdk.controllers.OrdersController;
import com.paypal.sdk.exceptions.ApiException;
import com.paypal.sdk.models.AmountWithBreakdown;
import com.paypal.sdk.models.CaptureOrderInput;
import com.paypal.sdk.models.CheckoutPaymentIntent;
import com.paypal.sdk.models.CreateOrderInput;
import com.paypal.sdk.models.GetOrderInput;
import com.paypal.sdk.models.Order;
import com.paypal.sdk.models.OrderStatus;
import com.paypal.sdk.models.OrderRequest;
import com.paypal.sdk.models.PurchaseUnitRequest;
import org.springframework.stereotype.Component;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Component
public class PaypalGateway {

    private final PaypalServerSdkClient client;

    public PaypalGateway(PaypalConfig config) {
        client = config.isConfigured()
                ? new PaypalServerSdkClient.Builder()
                        .environment(config.isSandbox() ? Environment.SANDBOX : Environment.PRODUCTION)
                        .clientCredentialsAuth(new ClientCredentialsAuthModel.Builder(
                                config.getClientId(), config.getClientSecret()).build())
                        .build()
                : null;
    }

    public String createOrder(long reservationId, BigDecimal amount, String transactionId) {
        PurchaseUnitRequest purchaseUnit = new PurchaseUnitRequest.Builder(
                new AmountWithBreakdown.Builder("EUR", amount.toPlainString()).build())
                .customId(Long.toString(reservationId))
                .build();
        OrderRequest request = new OrderRequest.Builder(CheckoutPaymentIntent.CAPTURE, List.of(purchaseUnit)).build();
        try {
            Order order = configuredClient().getOrdersController().createOrder(
                    new CreateOrderInput.Builder("application/json", request)
                            .paypalRequestId(transactionId)
                            .build()).getResult();
            if (order == null || order.getId() == null || order.getId().isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "PROVIDER_ERROR");
            }
            return order.getId();
        } catch (ApiException | IOException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "PROVIDER_ERROR", exception);
        }
    }

    public Order captureOrder(String orderId, String transactionId) {
        try {
            OrdersController orders = configuredClient().getOrdersController();
            Order current = getOrder(orderId);
            if (current != null && current.getStatus() == OrderStatus.COMPLETED) {
                return current;
            }
            return orders.captureOrder(new CaptureOrderInput.Builder(orderId, "application/json")
                    .paypalRequestId(transactionId + "-capture").build()).getResult();
        } catch (ApiException | IOException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "PROVIDER_ERROR", exception);
        }
    }

    public Order getOrder(String orderId) {
        try {
            return configuredClient().getOrdersController()
                    .getOrder(new GetOrderInput.Builder(orderId).build()).getResult();
        } catch (ApiException exception) {
            if (exception.getHttpContext() != null
                    && exception.getHttpContext().getResponse() != null
                    && exception.getHttpContext().getResponse().getStatusCode() == 404) return null;
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "PROVIDER_ERROR", exception);
        } catch (IOException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "PROVIDER_ERROR", exception);
        }
    }

    private PaypalServerSdkClient configuredClient() {
        if (client == null) throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "NOT_CONFIGURED");
        return client;
    }
}
