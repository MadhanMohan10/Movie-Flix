package com.movieflix.repository;

import com.movieflix.entity.Payment;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface PaymentRepository
        extends JpaRepository<Payment, Long> {
}
