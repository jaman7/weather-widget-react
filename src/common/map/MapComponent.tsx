import React, { useEffect, useRef, useState } from 'react';
import { Map as OlMap } from 'ol';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorImageLayer from 'ol/layer/VectorImage';
import { OSM } from 'ol/source';
import VectorSource from 'ol/source/Vector';
import { defaults as defaultControls } from 'ol/control';
import { ISearchData, MapProvider, useMapContext } from './MapContext';
import CoordinatePosition from './components/CoordinatePosition';
import Scaleline from './components/Scaleline';
import MapLegend from './components/map-legend/MapLegend';
import MapControls from './components/btn-controls/MapControls';
import { TileLayerBackground } from './components/btn-controls/MapControls.config';
import MapPopup from './components/MapPopup';
import MapSearch from './components/MapSearch';
import { ViewOptions } from './map.constants';

interface MapComponentProps {
  height?: string;
  setSearchData?: (data: ISearchData) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ setSearchData, height = '50vh' }) => {
  const [viewMap, setMapView] = useState<OlMap | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const { selectedTileLayerBackground, selectedTileLayer } = useMapContext();

  const tileLayer = new TileLayer({ source: new OSM() });

  const vectorSource = new VectorSource();

  const vectorLayerTop = new VectorImageLayer({ source: vectorSource });

  const { searchData } = useMapContext();

  useEffect(() => {
    if (mapRef.current && !viewMap) {
      tileLayer.set('id', 1);
      const newMapView = new OlMap({
        view: new View({
          ...ViewOptions,
        }),
        controls: defaultControls({ attribution: false }),
        layers: [tileLayer, vectorLayerTop],
        target: mapRef.current,
      });

      setMapView(newMapView);
    }

    if (viewMap) {
      viewMap?.updateSize();
      setTimeout(() => {
        viewMap?.updateSize();
      }, 300);
    }

    return () => {
      if (viewMap) {
        viewMap.setTarget(undefined);
        vectorSource.clear();
      }
    };
  }, [mapRef, viewMap]);

  useEffect(() => {
    if (viewMap && selectedTileLayerBackground !== '') {
      const tileSource = TileLayerBackground?.find((el) => el?.name === selectedTileLayerBackground)?.source ?? undefined;
      const layersTile = viewMap?.getLayers()?.getArray()?.[0] as TileLayer;
      const id = layersTile.get('id');
      if (layersTile && id === 1) {
        layersTile?.setSource?.(tileSource as OSM);
        viewMap?.updateSize?.();
      }
    }
  }, [selectedTileLayerBackground, viewMap]);

  useEffect(() => {
    if (searchData) {
      setSearchData?.(searchData);
    }
  }, [searchData]);

  return (
    <div className="map-component" style={{ height }}>
      <MapControls mapView={viewMap!} />
      <div className="map-container">
        <div ref={mapRef} className="map-view"></div>
        {viewMap && (
          <>
            <CoordinatePosition viewMap={viewMap} />
            <Scaleline viewMap={viewMap} />
            <MapPopup viewMap={viewMap} />
            <MapLegend legend={selectedTileLayer} />
            <MapSearch viewMap={viewMap} />
          </>
        )}
      </div>
    </div>
  );
};

const WrappedMapComponent = (props: MapComponentProps) => (
  <MapProvider>
    <MapComponent {...props} />
  </MapProvider>
);

export default WrappedMapComponent;
