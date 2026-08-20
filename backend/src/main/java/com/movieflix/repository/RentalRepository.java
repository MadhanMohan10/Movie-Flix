package com.movieflix.repository;

import com.movieflix.entity.Rental;
import com.movieflix.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface RentalRepository
        extends JpaRepository<Rental, Long> {

    List<Rental> findByUserOrderByRentedAtDesc(User user);

    boolean existsByUserAndTmdbMovieIdAndExpiresAtAfter(
            User user,
            Long tmdbMovieId,
            LocalDateTime now);
}