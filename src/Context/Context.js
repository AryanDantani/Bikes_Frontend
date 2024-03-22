import React, { createContext, useState, useContext } from "react";

export const ChannelIdContext = createContext();

export const ChannelIdContextProvider = ({ children }) => {
    const [bookedData, setBookedData] = useState([])
    const [isBooked, setIsBooked] = useState(false)
    const [isVisible, setIsVisible] = useState(true);
  
  return (
    <ChannelIdContext.Provider
      value={{
        bookedData,
        setBookedData,
        isBooked,
        setIsBooked,
        isVisible,
        setIsVisible
      }}
    >
      {children}
    </ChannelIdContext.Provider>
  );
};

export const UseChannelIdContext = () => {
  const context = useContext(ChannelIdContext);
  if (!context) {
    throw new Error("useChannelIdContext must be used within a ChannelIdContextProvider");
  }
  return context;
};
