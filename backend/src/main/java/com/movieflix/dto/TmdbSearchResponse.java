package com.movieflix.dto;

import java.util.List;

public class TmdbSearchResponse {

    private int page;

    private List<TmdbMovieResponse> results;

    private int total_pages;

    private int total_results;

    public TmdbSearchResponse() {
    }

    public int getPage() {
        return page;
    }

    public List<TmdbMovieResponse> getResults() {
        return results;
    }

    public int getTotal_pages() {
        return total_pages;
    }

    public int getTotal_results() {
        return total_results;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public void setResults(List<TmdbMovieResponse> results) {
        this.results = results;
    }

    public void setTotal_pages(int total_pages) {
        this.total_pages = total_pages;
    }

    public void setTotal_results(int total_results) {
        this.total_results = total_results;
    }
}