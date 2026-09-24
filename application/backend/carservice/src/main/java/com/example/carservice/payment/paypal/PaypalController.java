package com.example.carservice.payment.paypal;

import java.util.Map;

import com.example.carservice.payment.service.PaymentService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/paypal")
public class PaypalController {

    public record CreateOrderRequest(@NotNull Long reservationId) {}

    private final PaypalConfig config;
    private final PaymentService payments;

    public PaypalController(PaypalConfig config, PaymentService payments) {
        this.config = config;
        this.payments = payments;
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/config")
    public Map<String, String> getConfig() {
        return Map.of("clientId", config.isConfigured() ? config.getClientId() : "");
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/reservations/{reservationId}")
    public Map<String, Boolean> getPaymentStatus(@PathVariable Long reservationId,
                                                  Authentication authentication) {
        return Map.of("paid", payments.isPaid(reservationId, authentication.getName()));
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/orders")
    public Map<String, String> createOrder(@Valid @RequestBody CreateOrderRequest request,
                                           Authentication authentication) {
        return Map.of("orderId", payments.createPaymentForPayPal(request.reservationId(), authentication.getName()));
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/orders/{orderId}/capture")
    public Map<String, String> captureOrder(@PathVariable String orderId, Authentication authentication) {
        return Map.of("status", payments.completePaymentByProviderReference(orderId, authentication.getName()).name());
    }
}
