package com.movieflix.client;

import com.movieflix.dto.TmdbMovieDetails;
import com.movieflix.dto.TmdbSearchResponse;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class TmdbClient {

    private final RestClient restClient;
    private final String apiKey;

    public TmdbClient(
            @Value("${tmdb.base-url}") String baseUrl,
            @Value("${tmdb.api.key}") String apiKey) {

        this.apiKey = apiKey;

        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .build();
    }

    public TmdbSearchResponse searchMovies(String query, int page) {

        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search/movie")
                        .queryParam("api_key", apiKey)
                        .queryParam("query", query)
                        .queryParam("page", page)
                        .build())
                .retrieve()
                .body(TmdbSearchResponse.class);
    }

    public TmdbMovieDetails getMovieDetails(Long movieId) {

        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/movie/{id}")
                        .queryParam("api_key", apiKey)
                        .build(movieId))
                .retrieve()
                .body(TmdbMovieDetails.class);
    }

    public TmdbSearchResponse getPopularMovies(int page) {

        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/movie/popular")
                        .queryParam("api_key", apiKey)
                        .queryParam("page", page)
                        .build())
                .retrieve()
                .body(TmdbSearchResponse.class);
    }

    public TmdbSearchResponse getMoviesByGenre(Long genreId, int page) {

        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/discover/movie")
                        .queryParam("api_key", apiKey)
                        .queryParam("with_genres", genreId)
                        .queryParam("page", page)
                        .build())
                .retrieve()
                .body(TmdbSearchResponse.class);
    }

    public TmdbSearchResponse getMoviesByGenres(List<Long> genreIds, int page) {

        String joinedGenres = genreIds.stream()
                .map(String::valueOf)
                .collect(Collectors.joining(","));

        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/discover/movie")
                        .queryParam("api_key", apiKey)
                        .queryParam("with_genres", joinedGenres)
                        .queryParam("page", page)
                        .build())
                .retrieve()
                .body(TmdbSearchResponse.class);
    }
}
