import React, { createContext, useContext, useState } from 'react';

export interface ISearchData {
  city?: string;
  latitude?: number;
  longitude?: number;
}
interface MapContextProps {
  selectedTileLayerBackground: string;
  setSelectedTileLayerBackground: (layerName: string) => void;
  selectedTileLayer: string;
  setSelectedTileLayer: (layerName: string) => void;
  searchData: ISearchData | null;
  setSearchData: (data: ISearchData | null) => void;
}

export const MapContext = createContext<MapContextProps | undefined>(undefined);

export const MapProvider: React.FC<any> = ({ children }) => {
  const [selectedTileLayerBackground, setSelectedTileLayerBackground] = useState('Light');
  const [selectedTileLayer, setSelectedTileLayer] = useState('precipitation');
  const [searchData, setSearchData] = useState<ISearchData | null>(null);

  return (
    <MapContext.Provider
      value={{
        selectedTileLayerBackground,
        setSelectedTileLayerBackground,
        selectedTileLayer,
        setSelectedTileLayer,
        searchData,
        setSearchData,
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
