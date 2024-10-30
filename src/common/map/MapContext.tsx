import React, { createContext, useContext, useState } from 'react';

interface MapContextProps {
  selectedTileLayerBackground: string;
  setSelectedTileLayerBackground: (layerName: string) => void;
  selectedTileLayer: string;
  setSelectedTileLayer: (layerName: string) => void;
}

export const MapContext = createContext<MapContextProps | undefined>(undefined);

export const MapProvider: React.FC<any> = ({ children }) => {
  const [selectedTileLayerBackground, setSelectedTileLayerBackground] = useState('Light');
  const [selectedTileLayer, setSelectedTileLayer] = useState('precipitation');

  return (
    <MapContext.Provider
      value={{
        selectedTileLayerBackground,
        setSelectedTileLayerBackground,
        selectedTileLayer,
        setSelectedTileLayer,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) throw new Error('useMapContext must be used within a MapProvider');
  return context;
};
