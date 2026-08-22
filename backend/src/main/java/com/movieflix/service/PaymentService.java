package com.movieflix.service;

import com.movieflix.dto.PaymentRequest;
import com.movieflix.dto.PaymentResponse;
import com.movieflix.entity.Payment;
import com.movieflix.entity.User;
import com.movieflix.exception.ResourceNotFoundException;
import com.movieflix.repository.PaymentRepository;
import com.movieflix.repository.UserRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Locale;

@Service
public class PaymentService {

    private static final String STATUS_COMPLETED = "COMPLETED";

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final MovieService movieService;
    private final BigDecimal rentalPrice;
    private final String currency;

    public PaymentService(
            PaymentRepository paymentRepository,
            UserRepository userRepository,
            MovieService movieService,
            @Value("${movieflix.payment.price}") BigDecimal rentalPrice,
            @Value("${movieflix.payment.currency}") String currency) {

        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
        this.movieService = movieService;
        this.rentalPrice = rentalPrice;
        this.currency = currency;
    }

    public PaymentResponse createMockPayment(
            PaymentRequest request,
            String email) {

        String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"));

        movieService.getMovieDetails(request.getMovieId());

        Payment payment = new Payment(
                user,
                request.getMovieId(),
                rentalPrice,
                currency,
                STATUS_COMPLETED,
                LocalDateTime.now()
        );

        Payment savedPayment =
                paymentRepository.save(payment);

        return new PaymentResponse(
                savedPayment.getId(),
                user.getId(),
                savedPayment.getTmdbMovieId(),
                savedPayment.getAmount(),
                savedPayment.getCurrency(),
                savedPayment.getStatus(),
                savedPayment.getCreatedAt()
        );
    }

    public PaymentResponse createPayment(
            PaymentRequest request,
            String email) {

        return createMockPayment(request, email);
    }
}
