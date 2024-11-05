import { Fill, Stroke } from 'ol/style';
import { RgbFnStrings } from './Map.enums';

export const hex2rgba = (hex: string, alpha = 1): string => {
  const tmpHex = hex.toLowerCase();
  const { PRE_DATA_RGBA, ALPHA_MSG_ERR } = RgbFnStrings;

  if (alpha > 1 || alpha < 0) {
    throw new Error(ALPHA_MSG_ERR);
  }
  const red = parseInt(tmpHex?.slice(1, 3), 16);
  const green = parseInt(tmpHex?.slice(3, 5), 16);
  const blue = parseInt(tmpHex?.slice(5, 7), 16);

  return `${PRE_DATA_RGBA}(${red},${green},${blue},${alpha})`;
};

export const styleFill = (color: string, transparency: number): Fill => {
  return new Fill({
    color: hex2rgba(color, transparency),
  });
};

export const styleStroke = (color: string, transparency = 1, width = 1): Stroke => {
  return new Stroke({
    color: hex2rgba(color, transparency),
    width,
    miterLimit: 0,
  });
};
