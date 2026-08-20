package com.movieflix.controller;

import com.movieflix.dto.CreateRentalRequest;
import com.movieflix.dto.RentalAccessResponse;
import com.movieflix.dto.RentalResponse;
import com.movieflix.service.RentalService;

import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rentals")
public class RentalController {

    private final RentalService rentalService;

    public RentalController(RentalService rentalService) {
        this.rentalService = rentalService;
    }

    @PostMapping
	public ResponseEntity<RentalResponse> createRental(
			@Valid @RequestBody CreateRentalRequest request,
			Authentication authentication) {

		String email = authentication.getName();

		RentalResponse response =
				rentalService.createRental(request, email);

		return ResponseEntity
				.status(HttpStatus.CREATED)
				.body(response);
	}

    @GetMapping("/my")
	public ResponseEntity<List<RentalResponse>> getMyRentals(
			Authentication authentication) {

		String email = authentication.getName();

		return ResponseEntity.ok(
				rentalService.getUserRentals(email)
		);
	}

    @GetMapping("/{rentalId}/access")
    public ResponseEntity<RentalAccessResponse> checkAccess(
            @PathVariable Long rentalId,
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                rentalService.checkAccess(rentalId, email)
        );
    }
}