import { useState, useEffect } from 'react';
import useSWR from 'swr';
import localforage from 'localforage';

export function usePersistentSWR(key, fn, config) {
  let handleSuccess;
  if (config !== undefined && config.onSuccess !== undefined) {
    const { onSuccess } = config;
    handleSuccess = (data, key, config) => {
      storeData(data, key);
      onSuccess(data, key, config);
    };
  } else {
    handleSuccess = storeData;
  }

  let otherConfig;
  if (config !== undefined) {
    const { onSuccess, ...restOfConfig } = config;
    otherConfig = restOfConfig;
  }

  const result = useSWR(key, fn, { onSuccess: handleSuccess, ...otherConfig });

  const [localResult, setLocalResult] = useState(undefined);
  useEffect(() => {
    async function getLocalResult() {
      if (key && (result.data === undefined || result.data === null)) {
        const localItem = await localforage.getItem(key);
        if (
          key &&
          (result.data === undefined || result.data === null) &&
          localItem !== undefined &&
          localItem !== null
        ) {
          setLocalResult(localItem);
        }
      }
    }
    getLocalResult();
  }, [key, result.data]);

  if (
    (result.data === undefined || result.data === null) &&
    localResult !== undefined &&
    localResult !== null
  ) {
    result.mutate(localResult);
  }

  return result;
}

function storeData(data, key) {
  localforage.setItem(key, data);
}
