import React, { useCallback, useEffect, useState } from 'react';
import { Map as OlMap } from 'ol';
import { fromLonLat } from 'ol/proj';
import HttpService from 'core/http/http.service';
import { MdClear } from 'react-icons/md';
import { debounce } from 'lodash';

interface MapSearchProps {
  viewMap: OlMap;
}

interface ISuggestion {
  displayName: string;
  lon: string;
  lat: string;
}

const BASE_URL = 'https://nominatim.openstreetmap.org';

const MapSearch: React.FC<MapSearchProps> = ({ viewMap }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<ISuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const http = new HttpService(BASE_URL);

  const fetchSuggestions = useCallback(
    debounce(async (searchTerm: string) => {
      setLoading(true);
      setError('');
      const params = {
        q: searchTerm,
        format: 'json',
      };
      http
        .get<any[]>(`${BASE_URL}/search`, params)
        .then((data) => {
          setSuggestions?.(data?.map((el) => ({ ...el, displayName: el.display_name })) ?? []);
        })
        .catch((error) => {
          console.error('Error fetching location data:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 300),
    []
  );

  useEffect(() => {
    if (query?.length > 2) {
      fetchSuggestions?.(query);
    } else {
      setSuggestions?.([]);
    }
  }, [query, fetchSuggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery?.(e.target.value);
  };

  const handleSelectSuggestion = (suggestion: any) => {
    const { lon, lat } = suggestion || {};
    viewMap.getView().setCenter(fromLonLat([parseFloat(lon), parseFloat(lat)]));
    viewMap.getView().setZoom(12);
    setSuggestions([]);
    setQuery(suggestion.displayName);
  };

  const handleClearInput = () => {
    setQuery?.('');
    setSuggestions?.([]);
  };

  return (
    <div className="map-search">
      <div className="input-container">
        <input type="text" value={query} onChange={handleInputChange} placeholder="Search for a city..." />
        {query && <MdClear className="clear-icon" onClick={handleClearInput} />}
      </div>
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}
      {suggestions?.length > 0 && (
        <ul className="suggestions-list scroll">
          {suggestions?.map((suggestion, index) => (
            <li key={index} onClick={() => handleSelectSuggestion(suggestion)}>
              {suggestion.displayName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MapSearch;
