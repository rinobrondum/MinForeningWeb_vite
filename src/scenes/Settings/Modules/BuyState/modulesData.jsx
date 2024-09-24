import React, { useState, useEffect } from 'react';
import fetchData from './fetchData';

export const useModuleData = (title) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDataAsync = async () => {
      const fetchedData = await fetchData(title);
      setData(fetchedData);
    };
  
    fetchDataAsync();
  }, [title]);

  return data;
};
