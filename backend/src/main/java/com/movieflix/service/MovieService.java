package com.movieflix.service;

import com.movieflix.client.TmdbClient;
import com.movieflix.dto.TmdbMovieDetails;
import com.movieflix.dto.TmdbSearchResponse;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class MovieService {

    private final TmdbClient tmdbClient;

    public MovieService(TmdbClient tmdbClient) {
        this.tmdbClient = tmdbClient;
    }

    public TmdbSearchResponse searchMovies(String query, int page) {
        return tmdbClient.searchMovies(query, page);
    }

    public TmdbMovieDetails getMovieDetails(Long movieId) {
        return tmdbClient.getMovieDetails(movieId);
    }

    public TmdbSearchResponse getPopularMovies(int page) {
        return tmdbClient.getPopularMovies(page);
    }

    public TmdbSearchResponse getMoviesByGenre(Long genreId, int page) {
        return tmdbClient.getMoviesByGenre(genreId, page);
    }

    public TmdbSearchResponse getMoviesByGenres(List<Long> genreIds, int page) {
        return tmdbClient.getMoviesByGenres(genreIds, page);
    }
}
