import { fromLonLat } from 'ol/proj';
import { TypeEPSG } from './Map.enums';

const { EPSG3857 } = TypeEPSG;

export const API_KEY = '2a4f75e7ac73979b61b5469c8447c642';

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
