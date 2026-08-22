package com.movieflix.controller;

import com.movieflix.dto.PaymentRequest;
import com.movieflix.dto.PaymentResponse;
import com.movieflix.service.PaymentService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(
            PaymentService paymentService) {

        this.paymentService = paymentService;
    }

    @PostMapping("/mock")
    public ResponseEntity<PaymentResponse> createMockPayment(
            @Valid @RequestBody PaymentRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        PaymentResponse response =
                paymentService.createMockPayment(
                        request,
                        email);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
}