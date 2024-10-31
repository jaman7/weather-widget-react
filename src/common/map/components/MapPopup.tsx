import React, { useEffect, useRef, useState } from 'react';
import { Map as OlMap } from 'ol';
import Overlay from 'ol/Overlay';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import { toLonLat } from 'ol/proj';
import HttpService from 'core/http/http.service';
import { API_KEY } from 'common/map/map.constants';
import { IoMdClose } from 'react-icons/io';
import BaseLayer from 'ol/layer/Base';
import Button from 'common/button/Button';

interface MapPopupProps {
  viewMap: OlMap | null;
}

interface IWeatherData {
  id?: number;
  wind?: string;
  temp?: number;
  clouds?: number;
  pressure?: number;
}

const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

const MapPopup: React.FC<MapPopupProps> = ({ viewMap }) => {
  const popupEl = useRef<HTMLDivElement>(null);
  const [weatherData, setWeatherData] = useState<IWeatherData>({});
  const overlay = useRef<Overlay | null>(null);
  const markerLayer = useRef<VectorLayer<VectorSource> | null>(null);
  const currentMarker = useRef<Feature | null>(null);

  const http = new HttpService(BASE_URL);

  useEffect(() => {
    if (viewMap && popupEl.current) {
      overlay.current = new Overlay({
        element: popupEl.current,
        offset: [0, -13],
      });
      viewMap.addOverlay(overlay.current);

      markerLayer.current = new VectorLayer({
        source: new VectorSource(),
      });
      viewMap.addLayer(markerLayer.current);

      const handleMapClick = async (event: any) => {
        setWeatherData?.({});
        const { coordinate } = event;
        const [lon, lat] = toLonLat(coordinate);

        http
          .get<any>('', {
            lat,
            lon,
            appid: API_KEY,
            units: 'metric',
          })
          .then(data => {
            const { id, wind, main, clouds } = data || {};
            setWeatherData?.({
              id,
              wind: wind?.speed ?? null,
              temp: main?.temp ?? null,
              clouds: clouds?.all ?? null,
              pressure: main.pressure ?? null,
            } as IWeatherData);
          });

        addMarker?.(coordinate);
        overlay?.current?.setPosition?.(coordinate);

        if (popupEl.current) {
          const popupRect = popupEl?.current?.getBoundingClientRect();
          const offsetX = -popupRect?.width / 2;
          const offsetY = popupRect?.height + 30;
          overlay?.current?.setOffset?.([offsetX, -offsetY]);
        }
      };

      viewMap.on('singleclick', handleMapClick);

      return () => {
        viewMap?.removeOverlay?.(overlay?.current as Overlay);
        viewMap?.removeLayer?.(markerLayer?.current as BaseLayer);
        viewMap.un('singleclick', handleMapClick);
      };
    }
  }, [viewMap]);

  const addMarker = (coordinate: number[]) => {
    if (currentMarker.current) {
      markerLayer.current?.getSource()?.removeFeature(currentMarker.current);
    }

    const marker = new Feature({
      geometry: new Point(coordinate),
    });

    marker.setStyle(
      new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
          scale: 0.05,
        }),
      })
    );

    markerLayer.current?.getSource()?.addFeature(marker);
    currentMarker.current = marker;
  };

  const closePopup = () => {
    overlay.current?.setPosition(undefined);
    if (currentMarker.current) {
      markerLayer.current?.getSource()?.removeFeature(currentMarker.current);
      currentMarker.current = null;
    }
  };

  return (
    <div ref={popupEl} id="popup" className="ol-popup">
      <Button round={true} customClass="button-close" handleClick={closePopup}>
        <IoMdClose />
      </Button>
      {weatherData && (
        <div>
          <p className="text">
            Temperature: <span>{weatherData.temp}°C</span>
          </p>
          <p className="text">
            Wind: <span>{weatherData.wind} m/s</span>
          </p>
          <p className="text">
            Cloud cover: <span>{weatherData.clouds}%</span>
          </p>
          <p className="text">
            Pressure: <span>{weatherData.pressure} hPa</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default MapPopup;
