package com.movieflix.service;

import com.movieflix.client.TmdbClient;
import com.movieflix.dto.CreateRentalRequest;
import com.movieflix.dto.RentalAccessResponse;
import com.movieflix.dto.RentalResponse;
import com.movieflix.dto.TmdbMovieDetails;
import com.movieflix.entity.Rental;
import com.movieflix.entity.User;
import com.movieflix.exception.BusinessException;
import com.movieflix.exception.ResourceNotFoundException;
import com.movieflix.repository.RentalRepository;
import com.movieflix.repository.UserRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RentalService {

    private final RentalRepository rentalRepository;
    private final UserRepository userRepository;
    private final TmdbClient tmdbClient;

    @Value("${movieflix.rental.duration-hours}")
    private int rentalDurationHours;

    public RentalService(
            RentalRepository rentalRepository,
            UserRepository userRepository,
            TmdbClient tmdbClient) {

        this.rentalRepository = rentalRepository;
        this.userRepository = userRepository;
        this.tmdbClient = tmdbClient;
    }

    public RentalResponse createRental(
            CreateRentalRequest request,
            String email) {

        // 1. Get user from JWT email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"));

        LocalDateTime now = LocalDateTime.now();

        // 2. Check movie exists in TMDB
        TmdbMovieDetails movie;

        try {
            movie = tmdbClient.getMovieDetails(
                    request.getMovieId());
        } catch (Exception exception) {
            throw new BusinessException(
                    "Unable to verify movie with TMDB");
        }

        if (movie == null || movie.getId() == null) {
            throw new ResourceNotFoundException(
                    "Movie not found");
        }

        // 3. Check if movie is already rented
        boolean alreadyRented =
                rentalRepository
                        .existsByUserAndTmdbMovieIdAndExpiresAtAfter(
                                user,
                                request.getMovieId(),
                                now);

        if (alreadyRented) {
            throw new BusinessException(
                    "Movie is already rented");
        }

        // 4. Calculate rental expiration
        LocalDateTime expiresAt =
                now.plusHours(rentalDurationHours);

        // 5. Create rental
        Rental rental = new Rental(
                user,
                request.getMovieId(),
                now,
                expiresAt
        );

        Rental savedRental =
                rentalRepository.save(rental);

        // 6. Return response
        return new RentalResponse(
                savedRental.getId(),
                user.getId(),
                savedRental.getTmdbMovieId(),
                savedRental.getRentedAt(),
                savedRental.getExpiresAt()
        );
    }

    public List<RentalResponse> getUserRentals(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"));

        return rentalRepository
                .findByUserOrderByRentedAtDesc(user)
                .stream()
                .map(rental -> new RentalResponse(
                        rental.getId(),
                        user.getId(),
                        rental.getTmdbMovieId(),
                        rental.getRentedAt(),
                        rental.getExpiresAt()
                ))
                .toList();
        }

    public RentalAccessResponse checkAccess(
            Long rentalId,
            String email) {

        // 1. Find rental
        Rental rental = rentalRepository.findById(rentalId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Rental not found"));

        // 2. Find logged-in user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"));

        // 3. Make sure rental belongs to logged-in user
        if (!rental.getUser().getId().equals(user.getId())) {
            throw new BusinessException(
                    "You do not have access to this rental");
        }

        // 4. Check rental expiration
        LocalDateTime now = LocalDateTime.now();

        boolean allowed =
                now.isBefore(rental.getExpiresAt());

        // 5. Return access result
        return new RentalAccessResponse(
                rental.getId(),
                user.getId(),
                rental.getTmdbMovieId(),
                allowed,
                rental.getExpiresAt()
        );
    }
}