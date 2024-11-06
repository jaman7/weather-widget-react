import { fromLonLat } from 'ol/proj';
import { TypeEPSG } from './Map.enums';

const { EPSG3857 } = TypeEPSG;

export const API_KEY = 'ae98d58d517252f2065829367d320dbb';

export const ViewOptions = {
  center: fromLonLat([-73.935242, 40.73061]),
  zoom: 7,
  smoothResolutionConstraint: false,
  constrainResolution: true,
  showFullExtent: true,
  projection: EPSG3857,
  pixelRatio: 1,
};

export const MapConsts = {
  targetClassName: 'ol-map',
  paddingOfCenterCluster: { padding: [30, 30, 30, 30] },
  noPadding: { padding: [0, 0, 0, 0] },
  tileLayerIndex: 1,
};

export const Colors = {
  orange: '#eb6e4b',
  blue: '#0834c4',
};
