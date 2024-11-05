import { OSM, XYZ } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import { ButtonsControl, MapButtonsTooltip } from './MapControls.enums';
import { ISidebarConfig } from './MapControls.models';
import { API_KEY } from 'common/map/map.constants';
import { FaHome, FaPlusCircle, FaMinusCircle } from 'react-icons/fa';
import { IconType } from 'react-icons';

const { BTN_HOME, BTN_ZOOM_IN, BTN_ZOOM_OUT } = ButtonsControl;
const { HOME_TOOLTIP, ZOOM_IN_TOOLTIP, ZOOM_OUT_TOOLTIP } = MapButtonsTooltip;

export const icons: { [name: string]: IconType | JSX.Element } = {
  home: <FaHome />,
  plus: <FaPlusCircle />,
  minus: <FaMinusCircle />,
};

export const MapsTilleLayers = [
  {
    name: 'precipitation',
    tile: new TileLayer({
      source: new XYZ({
        url: `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
        attributions: '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>',
      }),
      opacity: 1,
    }),
  },
  {
    name: 'temp',
    tile: new TileLayer({
      source: new XYZ({
        url: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
        attributions: '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>',
      }),
      opacity: 1,
    }),
  },
  {
    name: 'wind',
    tile: new TileLayer({
      source: new XYZ({
        url: `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
        attributions: '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>',
      }),
      opacity: 1,
    }),
  },
  {
    name: 'clouds',
    tile: new TileLayer({
      source: new XYZ({
        url: `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
        attributions: '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>',
      }),
      opacity: 1,
    }),
  },
  {
    name: 'pressure',
    tile: new TileLayer({
      source: new XYZ({
        url: `https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
        attributions: '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>',
      }),
      opacity: 1,
    }),
  },
];

export const TileLayerBackground: ISidebarConfig[] = [
  {
    value: 0,
    checked: false,
    name: 'OSM',
    source: new OSM(),
    type: 'radio-item',
  },
  {
    value: 1,
    checked: true,
    name: 'Light',
    source: new OSM({
      url: 'https://cartodb-basemaps-1.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png',
    }),
    type: 'radio-item',
  },
  {
    value: 2,
    checked: false,
    name: 'Dark',
    source: new OSM({
      url: 'https://cartodb-basemaps-1.global.ssl.fastly.net/dark_all/{z}/{x}/{y}{r}.png',
    }),
    type: 'radio-item',
  },
];

export const controlConfig: ISidebarConfig[] = [
  {
    name: BTN_HOME,
    id: BTN_HOME,
    tooltipTitle: HOME_TOOLTIP,
    iconType: 'home',
    tooltipPlacement: 'top',
  },
  {
    name: BTN_ZOOM_IN,
    id: BTN_ZOOM_IN,
    tooltipTitle: ZOOM_IN_TOOLTIP,
    iconType: 'plus',
    tooltipPlacement: 'top',
  },
  {
    name: BTN_ZOOM_OUT,
    id: BTN_ZOOM_OUT,
    tooltipTitle: ZOOM_OUT_TOOLTIP,
    iconType: 'minus',
    tooltipPlacement: 'top',
  },
];

export const sidebarConfig = (): ISidebarConfig[] => [
  {
    title: 'common.mapData.sidebar.controls',
    type: 'button',
    children: controlConfig,
  },
  { title: 'common.mapData.sidebar.weatherConditions', type: 'radio-item', typeCheckbox: 'weather', children: MapsTilleLayers },
  { title: 'common.mapData.sidebar.styleTile', type: 'radio-item', typeCheckbox: 'tile', children: TileLayerBackground },
];
