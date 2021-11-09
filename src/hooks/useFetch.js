import { useEffect, useState } from "react";

const useFetch = ({ url, options, initData }) => {
  const [response, setResponse] = useState(null || initData);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const res = await fetch(url, options);
        const json = await res.json();

        setResponse(json);
        setIsLoading(false);
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
  }, []);

  return { response, error, isLoading };
};

export default useFetch