"use client";
import { baseURL } from "@/services/api/apiService";
import { useEffect, useState } from "react";

export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const updatePosition = () => {
      setScrollPosition(window.pageYOffset);
    };
    window.addEventListener("scroll", updatePosition);
    updatePosition();
    return () => window.removeEventListener("scroll", updatePosition);
  }, []);

  return scrollPosition;
};

export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [matches, query]);

  return matches;
};

export const useLoading = (initialLoading = false) => {
  const [isLoading, setLoading] = useState(initialLoading);

  const startLoading = () => {
    setLoading(true);
  };

  const stopLoading = () => {
    setLoading(false);
  };

  return { isLoading, startLoading, stopLoading };
};

export const useFetch = (initialUrl, options = {}) => {
  const [url, setUrl] = useState(initialUrl);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${baseURL}${url}`, {
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const jsonData = await response.json();
        setData(jsonData);
        setLoading(false);
        setError(null);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (url) {
      fetchData();
    }
    return () => {
      abortController.abort();
    };
  }, [url]);

  return { data, loading, error, setUrl };
};

export const useLocalStorage = (key, initialValue) => {
  const storedValue =
    typeof window != "undefined" ? localStorage.getItem(key) : "";
  const initial = storedValue ? JSON.parse(storedValue) : initialValue;
  const [value, setValue] = useState(initial);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};
