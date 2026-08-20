package com.movieflix.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "rentals")
public class Rental {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "tmdb_movie_id", nullable = false)
    private Long tmdbMovieId;

    @Column(nullable = false)
    private LocalDateTime rentedAt;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    public Rental() {
    }

    public Rental(
            User user,
            Long tmdbMovieId,
            LocalDateTime rentedAt,
            LocalDateTime expiresAt) {

        this.user = user;
        this.tmdbMovieId = tmdbMovieId;
        this.rentedAt = rentedAt;
        this.expiresAt = expiresAt;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public Long getTmdbMovieId() {
        return tmdbMovieId;
    }

    public LocalDateTime getRentedAt() {
        return rentedAt;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }
}