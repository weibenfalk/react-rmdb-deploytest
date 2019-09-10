import { useState, useEffect } from 'react';
import { POPULAR_BASE_URL } from '../../config';

export const useHomeFetch = () => {
  const [state, setState] = useState({ movies: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchMovies = async endpoint => {
    setError(false);
    setLoading(true);

    const isLoadMore = endpoint.search('page');

    try {
      const result = await (await fetch(endpoint)).json();
      setState(prev => ({
        ...prev,
        movies:
          isLoadMore !== -1
        ? [...prev.movies, ...result.results]
        : [...result.results],
        heroImage: prev.heroImage || result.results[0],
        currentPage: result.page,
        totalPages: result.total_pages
      }))

    } catch (error) {
      setError(true);
      console.log(error);
    }
    setLoading(false);
  }

  // Fetch popular movies initially on mount
  useEffect(() => {
    if (sessionStorage.homeState) {
      setState(JSON.parse(sessionStorage.homeState));
      setLoading(false)
    } else {
      fetchMovies(POPULAR_BASE_URL);
    }
  }, [])

  useEffect(() => {
    if(!state.searchTerm) {
      sessionStorage.setItem('homeState', JSON.stringify(state));
    }
  }, [state])

  return [{ state, loading, error}, fetchMovies];
}