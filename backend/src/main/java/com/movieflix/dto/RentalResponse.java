package com.movieflix.dto;

import java.time.LocalDateTime;

public class RentalResponse {

    private Long id;
    private Long userId;
    private Long movieId;
    private LocalDateTime rentedAt;
    private LocalDateTime expiresAt;

    public RentalResponse(
            Long id,
            Long userId,
            Long movieId,
            LocalDateTime rentedAt,
            LocalDateTime expiresAt) {

        this.id = id;
        this.userId = userId;
        this.movieId = movieId;
        this.rentedAt = rentedAt;
        this.expiresAt = expiresAt;
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

    public LocalDateTime getRentedAt() {
        return rentedAt;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }
}