package com.movieflix.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentResponse {

    private Long id;
    private Long userId;
    private Long movieId;
    private BigDecimal amount;
    private String currency;
    private String status;
    private LocalDateTime createdAt;

    public PaymentResponse(
            Long id,
            Long userId,
            Long movieId,
            BigDecimal amount,
            String currency,
            String status,
            LocalDateTime createdAt) {

        this.id = id;
        this.userId = userId;
        this.movieId = movieId;
        this.amount = amount;
        this.currency = currency;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public Long getMovieId() {
        return movieId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getCurrency() {
        return currency;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}