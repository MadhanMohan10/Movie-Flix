package com.movieflix.dto;

import jakarta.validation.constraints.NotNull;

public class CreateRentalRequest {

    @NotNull(message = "Movie ID is required")
    private Long movieId;

    public Long getMovieId() {
        return movieId;
    }

    public void setMovieId(Long movieId) {
        this.movieId = movieId;
    }
}