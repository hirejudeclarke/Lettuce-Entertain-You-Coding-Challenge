"use client";
import { createContext, useState, useContext, ReactNode } from "react";

export interface SelectedLocation {
  street: string;
  city: string;
  state: string;
  postalCode?: string;
  email?: string;
  phone: string;
  hours: {
    days: string;
    time: string;
  }[];
}
const locations: SelectedLocation[] = [
  {
    street: "7239 Woodmont Ave",
    city: "Bethesda",
    state: "MD",
    email: "info@monamigabi.com",
    phone: "301.654.1234",
    hours: [
      { days: "Mon-Thu", time: "4:00pm - 9:30pm" },
      { days: "Fri-Sat", time: "4:00pm - 10:30pm" },
      { days: "Sunday", time: "1:00pm - 8:30pm" },
    ],
  },
  {
    street: "N. Lincoln Park West",
    city: "Chicago",
    state: "IL",
    postalCode: "60614",
    email: "info@monamigabi.com",
    phone: "773.348.8886",
    hours: [
      { days: "Mon-Thu", time: "5:00pm - 9:30pm" },
      { days: "Fri-Sat", time: "5:00pm - 10:30pm" },
      { days: "Sun Brunch", time: "10:00am - 2:00pm" },
      { days: "Sunday", time: "5:00pm - 8:30pm" },
    ],
  },
  {
    street: "3655 S Las Vegas Blvd",
    city: "Las Vegas",
    state: "NV",
    email: "info@monamigabi.com",
    phone: "702.944.4224",
    hours: [
      { days: "Mon-Thu", time: "10:00am - 10:00pm" },
      { days: "Fri-Sat", time: "5:00pm - 11:00pm" },
      { days: "Sunday", time: "2:00pm - 10:00pm" },
    ],
  },
];

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
