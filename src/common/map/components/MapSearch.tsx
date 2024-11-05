import React, { useCallback, useEffect, useState } from 'react';
import { Map as OlMap } from 'ol';
import { fromLonLat } from 'ol/proj';
import HttpService from 'core/http/http.service';
import { MdClear } from 'react-icons/md';
import { debounce } from 'lodash';
import VectorImageLayer from 'ol/layer/VectorImage';
import { Feature } from 'ol';
import { Circle as CircleGeom } from 'ol/geom';
import { Style } from 'ol/style';
import { Colors } from '../map.constants';
import { styleFill, styleStroke } from '../map.helpers';

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

  const getCurrentVectorImageLayer = (): VectorImageLayer | null => {
    let currentLayer = null;
    viewMap.getLayers().forEach((layer) => {
      if (layer instanceof VectorImageLayer) {
        currentLayer = layer;
      }
    });
    return currentLayer;
  };

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

  const handleSelectSuggestion = (suggestion: ISuggestion) => {
    const { lon, lat } = suggestion || {};
    const view = viewMap.getView();
    const targetCoordinates = fromLonLat([parseFloat(lon), parseFloat(lat)]);

    const currentLayer = getCurrentVectorImageLayer();
    const vectorSource = currentLayer?.getSource();

    vectorSource?.clear();

    const radius = 500;
    const circleFeature = new Feature({
      geometry: new CircleGeom(targetCoordinates, radius),
    });

    circleFeature.setStyle(
      new Style({
        fill: styleFill(Colors.blue, 0.1),
        stroke: styleStroke(Colors.blue),
      })
    );

    vectorSource?.addFeature(circleFeature);

    view.animate({
      center: targetCoordinates,
      zoom: 15,
      duration: 1000,
      easing: (t) => t * (2 - t),
    });

    setSuggestions([]);
    setQuery(suggestion.displayName);
  };

  const handleClearInput = () => {
    setQuery?.('');
    setSuggestions?.([]);
    getCurrentVectorImageLayer()?.getSource()?.clear();
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
