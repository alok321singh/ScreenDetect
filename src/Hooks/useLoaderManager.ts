import { useState, useCallback } from 'react';

// Define the type for the callback function in subscribe method
type LoaderStateCallback = (isLoading: boolean) => void;

// Create the custom hook for the singleton loader manager
const useLoaderManager = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false); // Type for isLoading is boolean
  const [subscribers, setSubscribers] = useState<LoaderStateCallback[]>([]); // subscribers is an array of callback functions

  // Show the loader
  const show = useCallback(() => {
    setIsLoading(true);
    notifySubscribers();
  }, []);

  // Hide the loader
  const hide = useCallback(() => {
    setIsLoading(false);
    notifySubscribers();
  }, []);

  // Subscribe to loader state changes (callback takes the loading state)
  const subscribe = useCallback((callback: LoaderStateCallback) => {
    setSubscribers((prevSubscribers) => [...prevSubscribers, callback]);
  }, []);

  // Notify all subscribers of the state change
  const notifySubscribers = () => {
    subscribers.forEach((callback) => callback(isLoading));
  };

  return {
    show,
    hide,
    subscribe,
  };
};

export default useLoaderManager;
