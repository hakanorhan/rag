package com.example.notificationservice;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "company_info")
@Getter
@NoArgsConstructor
public class CompanyInfo {

    @Id
    private Long id;

    private String name;
    private String street;

    @Column(name = "postal_code")
    private String postalCode;

    private String city;
    private String country;

    @Column(name = "tax_number")
    private String taxNumber;

    @Column(name = "vat_id")
    private String vatId;

    @Column(name = "vat_rate")
    private BigDecimal vatRate;
}
