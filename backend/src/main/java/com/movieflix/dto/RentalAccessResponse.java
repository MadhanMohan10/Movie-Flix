package com.movieflix.dto;

import java.time.LocalDateTime;

public class RentalAccessResponse {

    private Long rentalId;
    private Long userId;
    private Long movieId;
    private boolean allowed;
    private LocalDateTime expiresAt;

    public RentalAccessResponse(
            Long rentalId,
            Long userId,
            Long movieId,
            boolean allowed,
            LocalDateTime expiresAt) {

        this.rentalId = rentalId;
        this.userId = userId;
        this.movieId = movieId;
        this.allowed = allowed;
        this.expiresAt = expiresAt;
    }

    public Long getRentalId() {
        return rentalId;
    }

    public Long getUserId() {
        return userId;
    }

    public Long getMovieId() {
        return movieId;
    }

    public boolean isAllowed() {
        return allowed;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }
}