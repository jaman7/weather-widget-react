import React, { useEffect, useState, useMemo } from 'react';
import { Map as OlMap, View } from 'ol';
import { icons, MapsTilleLayers, sidebarConfig } from './MapControls.config';
import Button from 'common/button/Button';
import { ButtonsControl, Direction } from './MapControls.enums';
import { useTranslation } from 'react-i18next';
import { RadioButton } from 'primereact/radiobutton';
import { TileTypes, TileTypesArray } from './MapControls.models';
import { ViewOptions } from 'common/map/map.constants';
import { easeOut } from 'ol/easing';
import { FaAngleDoubleLeft } from 'react-icons/fa';
import { useMapContext } from 'common/map/MapContext';
import TileLayer from 'ol/layer/Tile';
import { XYZ } from 'ol/source';

interface IMapControlsProps {
  mapView: OlMap | null;
}

const { IN, OUT } = Direction;

const MapControls: React.FC<IMapControlsProps> = ({ mapView }) => {
  const [collapsedSiedBar, setCollapsedSiedeBar] = useState(true);
  const sidebarConfigItems = useMemo(() => sidebarConfig(), []);
  const { t } = useTranslation();
  const { setSelectedTileLayerBackground, setSelectedTileLayer, selectedTileLayerBackground, selectedTileLayer } = useMapContext() || {};

  const isTileTypes = (value: any): value is TileTypes => {
    return TileTypesArray.includes(value);
  };

  useEffect(() => {
    if (mapView && selectedTileLayer) {
      const currentTileLayer = (MapsTilleLayers?.find((el) => el?.name === selectedTileLayer)?.tile as TileLayer<XYZ>) ?? undefined;
      currentTileLayer?.set?.('id', 10);
      if (currentTileLayer) {
        mapView?.addLayer?.(currentTileLayer);
        const intervalId = setInterval(updateSelectedTileLayer, 60000);
        return () => clearInterval(intervalId);
      }
    }
  }, [mapView]);

  const updateSelectedTileLayer = (): void => {
    const currentTileLayer = (MapsTilleLayers?.find((el) => el?.name === selectedTileLayer)?.tile as TileLayer<XYZ>) ?? undefined;
    mapView?.getLayers()?.forEach((layer) => {
      if (layer === currentTileLayer && layer.get('id') === 10 && layer instanceof TileLayer) {
        const source = layer.getSource();
        if (source instanceof XYZ) source.refresh();
      }
    });
  };

  const onLayerChange = (value: string): void => {
    if (value && isTileTypes(value)) {
      setSelectedTileLayerBackground(value);
    } else {
      setSelectedTileLayer(value);
      onWeatherLayerChange(value);
    }
  };

  const onWeatherLayerChange = (value: string): void => {
    const weatherTile = MapsTilleLayers.find((el) => el?.name === value)?.tile as TileLayer<XYZ>;

    MapsTilleLayers?.forEach((layer) => {
      if (mapView?.getLayers().getArray().includes(layer.tile)) mapView?.removeLayer(layer.tile);
    });

    mapView?.addLayer(weatherTile);
  };

  const handleBtn = (name: string): void => {
    if (name === ButtonsControl.BTN_HOME) resetMapPosition();
    else handleZoom(name === ButtonsControl.BTN_ZOOM_IN ? IN : OUT);
  };

  const handleZoom = (direction: 'in' | 'out'): void => {
    const view = mapView?.getView();
    const zoom = view?.getZoom() || 0;
    view?.animate({
      zoom: zoom + (direction === IN ? 1 : -1),
      duration: 500,
    });
  };

  const resetMapPosition = (): void => {
    const homeView = new View(ViewOptions);
    mapView?.getView().animate({
      center: homeView.getCenter(),
      zoom: homeView.getZoom(),
      duration: 1000,
      easing: easeOut,
    });
    mapView?.updateSize();
  };

  return (
    <div className={`map-sidebar ${collapsedSiedBar ? 'close' : 'open'}`}>
      <ul className={`sidebar-menu ${collapsedSiedBar ? 'close' : 'open'}`}>
        {sidebarConfigItems.map((item, index) => (
          <li key={index}>
            <p className="title">{t(item?.title as string)}</p>

            {item.type === 'button' && (
              <div className="btn-controls">
                {item?.children?.map((btn, idx) => (
                  <Button
                    key={`btn_${idx}`}
                    round={true}
                    className={`btn-root ${btn.additionalClass ?? ''}`}
                    tooltip={btn.tooltipTitle}
                    handleClick={() => handleBtn(btn?.id as string)}
                  >
                    {icons[btn?.iconType as string] as JSX.Element}
                  </Button>
                ))}
              </div>
            )}

            {item.type === 'radio-item' && (
              <div className="tile-list">
                {item?.children?.map((layer, i) => {
                  return (
                    <div key={`${layer.name}_${i}`} className="tile-item">
                      <RadioButton
                        inputId={layer.name}
                        name="category"
                        value={layer.name}
                        onChange={(e) => onLayerChange(e.value)}
                        checked={
                          (item.typeCheckbox === 'tile' && selectedTileLayerBackground === layer.name) ||
                          (item.typeCheckbox === 'weather' && selectedTileLayer === layer.name)
                        }
                        className="tile-radio"
                      />
                      <label htmlFor={layer.name} className="tile-name">
                        {layer.name}
                      </label>
                    </div>
                  );
                })}
              </div>
            )}
          </li>
        ))}
      </ul>

      <Button
        round
        customClass={`btn-mapsidebar ${collapsedSiedBar ? 'open' : ''}`}
        handleClick={() => setCollapsedSiedeBar(!collapsedSiedBar)}
      >
        <FaAngleDoubleLeft className={collapsedSiedBar ? 'open' : ''} />
      </Button>
    </div>
  );
};

export default MapControls;
