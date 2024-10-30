import { fromLonLat } from 'ol/proj';
import { TypeEPSG } from './Map.enums';

const { EPSG3857 } = TypeEPSG;

export const API_KEY = '33e67a9b2d05b12d29b27e39b1d4719a';

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
