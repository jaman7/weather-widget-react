import React, { useCallback, useEffect, useState, useMemo } from 'react';
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
import { useMapContext } from '../MapContext';

interface MapSearchProps {
  viewMap: OlMap;
}

const BASE_URL = 'https://api.mapbox.com/search/geocode/v6/forward';
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_API_KEY;

const MapSearch: React.FC<MapSearchProps> = ({ viewMap }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [isSelecting, setIsSelecting] = useState(false);

  const http = useMemo(() => new HttpService(BASE_URL), []);
  const { setSearchData } = useMapContext();

  const getCurrentVectorImageLayer = useCallback((): VectorImageLayer | null => {
    return (
      viewMap
        .getLayers()
        .getArray()
        .find((layer) => layer instanceof VectorImageLayer) || null
    );
  }, [viewMap]);

  const fetchSuggestions = useCallback(
    debounce(async (searchTerm: string) => {
      if (!isSelecting) {
        setLoading(true);
        setError('');
        const params = {
          q: searchTerm,
          limit: 10,
          access_token: MAPBOX_TOKEN,
        };
        if (searchTerm) {
          http
            .get<any>(`${BASE_URL}`, params)
            .then((data: any) => {
              const { features } = data || {};
              const preData =
                features?.map((item: any) => {
                  const { id, geometry, properties } = item || {};
                  return {
                    id,
                    geometry,
                    properties,
                    displayName: properties?.full_address,
                  };
                }) ?? [];
              setSuggestions(preData ?? []);
            })
            .catch(() => {
              setError('Failed to fetch suggestions.');
            })
            .finally(() => {
              setLoading(false);
            });
        }
      }
    }, 300),
    [isSelecting]
  );

  useEffect(() => {
    if (query?.length > 2) {
      fetchSuggestions?.(query);
    } else {
      setSuggestions?.([]);
    }
  }, [query, fetchSuggestions, isSelecting]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSelecting(false);
    setQuery?.(e.target.value);
  };

  const handleSelectSuggestion = (suggestion: any) => {
    const { longitude, latitude } = suggestion?.properties?.coordinates || {};
    const view = viewMap.getView();
    const targetCoordinates = fromLonLat([parseFloat(longitude), parseFloat(latitude)]);
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

    setIsSelecting(true);
    setQuery(suggestion.displayName);
    setSearchData({ longitude, latitude, city: suggestion?.properties?.name ?? '' });
    setSuggestions([]);
  };

  const handleClearInput = () => {
    setQuery?.('');
    setSuggestions?.([]);
    setSearchData?.(null);
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
          {suggestions?.map((suggestion) => (
            <li key={suggestion?.id} onClick={() => handleSelectSuggestion(suggestion)}>
              {suggestion.displayName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MapSearch;
