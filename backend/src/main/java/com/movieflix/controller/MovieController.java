package com.movieflix.controller;

import com.movieflix.dto.TmdbMovieDetails;
import com.movieflix.dto.TmdbSearchResponse;
import com.movieflix.service.MovieService;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @GetMapping("/search")
    public TmdbSearchResponse searchMovies(
            @RequestParam String query,
            @RequestParam(defaultValue = "1") int page) {

        if (query == null || query.trim().isEmpty()) {
            throw new IllegalArgumentException("Search query cannot be empty");
        }

        if (page < 1 || page > 500) {
            throw new IllegalArgumentException("Page must be between 1 and 500");
        }

        return movieService.searchMovies(query.trim(), page);
    }

    @GetMapping("/{movieId}")
    public TmdbMovieDetails getMovieDetails(
            @PathVariable Long movieId) {

        if (movieId <= 0) {
            throw new IllegalArgumentException("Movie ID must be positive");
        }

        return movieService.getMovieDetails(movieId);
    }

    @GetMapping("/popular")
    public TmdbSearchResponse getPopularMovies(
            @RequestParam(defaultValue = "1") int page) {

        if (page < 1 || page > 500) {
            throw new IllegalArgumentException("Page must be between 1 and 500");
        }

        return movieService.getPopularMovies(page);
    }

    @GetMapping("/genre/{genreId}")
    public TmdbSearchResponse getMoviesByGenre(
            @PathVariable Long genreId,
            @RequestParam(defaultValue = "1") int page) {

        if (genreId <= 0) {
            throw new IllegalArgumentException("Genre ID must be positive");
        }

        if (page < 1 || page > 500) {
            throw new IllegalArgumentException("Page must be between 1 and 500");
        }

        return movieService.getMoviesByGenre(genreId, page);
    }

    @GetMapping("/genres")
    public TmdbSearchResponse getMoviesByGenres(
            @RequestParam String genreIds,
            @RequestParam(defaultValue = "1") int page) {

        if (genreIds == null || genreIds.trim().isEmpty()) {
            throw new IllegalArgumentException("Genre IDs cannot be empty");
        }

        if (page < 1 || page > 500) {
            throw new IllegalArgumentException("Page must be between 1 and 500");
        }

        List<Long> parsedGenreIds = Arrays.stream(genreIds.split(","))
                .map(String::trim)
                .filter(value -> !value.isEmpty())
                .map(Long::valueOf)
                .filter(value -> value > 0)
                .collect(Collectors.toList());

        if (parsedGenreIds.isEmpty()) {
            throw new IllegalArgumentException("Genre IDs must be positive");
        }

        return movieService.getMoviesByGenres(parsedGenreIds, page);
    }
}
