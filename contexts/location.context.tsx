"use client";
import { createContext, useState, useContext, ReactNode } from "react";
import { locations, SelectedLocation } from "@/data/locations";

// Define the type for the context value
interface LocationContextType {
  location: SelectedLocation;
  updateLocation: () => void; // Function to update the location
}

// Create the context with a default value
const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

// Create the provider component
interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider = ({ children }: LocationProviderProps) => {
  const startingIndex: number = 1;
  const [locationIndex, setLocationIndex] = useState(startingIndex);
  const [location, setLocation] = useState<SelectedLocation>(
    locations[startingIndex]
  );

  const cycleLocation = () => {
    const nextIndex = (locationIndex + 1) % locations.length;
    setLocationIndex(nextIndex);
    setLocation(locations[nextIndex]);
  };

  return (
    <LocationContext.Provider
      value={{ location, updateLocation: cycleLocation }}
    >
      {children}
    </LocationContext.Provider>
  );
};

// Create a custom hook to access the context
export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
