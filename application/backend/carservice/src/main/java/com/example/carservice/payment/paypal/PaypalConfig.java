package com.example.carservice.payment.paypal;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class PaypalConfig {

    private final String clientId;
    private final String clientSecret;
    private final boolean sandbox;

    public PaypalConfig(
            @Value("${paypal.client-id:}") String clientId,
            @Value("${paypal.client-secret:}") String clientSecret,
            @Value("${paypal.sandbox:true}") boolean sandbox
    ) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.sandbox = sandbox;
    }

    public String getClientId() {
        return clientId;
    }

    public String getClientSecret() {
        return clientSecret;
    }

    public boolean isSandbox() {
        return sandbox;
    }

    public boolean isConfigured() {
        return !clientId.isBlank() && !clientSecret.isBlank();
    }
}
