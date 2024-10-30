import { Map as OlMap } from 'ol';
import { MousePosition } from 'ol/control';
import { Coordinate, toStringXY } from 'ol/coordinate';
import { useEffect, useRef } from 'react';
import { MapSourceClass, TypeEPSG } from '../Map.enums';

const { EPSG4326 } = TypeEPSG;
const { MOUSE_POSITION_CONTROL } = MapSourceClass;

export interface IProps {
  viewMap: OlMap | null;
}

const CoordinatePosition = ({ viewMap }: IProps) => {
  const mousePositionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (viewMap) {
      const mousePositionControl = new MousePosition({
        projection: EPSG4326,
        coordinateFormat: (coordinates: Coordinate | undefined): string =>
          coordinates && coordinates.length === 2 ? toStringXY(coordinates, 6) : '',
        className: MOUSE_POSITION_CONTROL,
        target: mousePositionRef.current!,
      });

      viewMap.addControl(mousePositionControl);

      return () => {
        viewMap.removeControl(mousePositionControl);
      };
    }
  }, [viewMap]);

  return <div ref={mousePositionRef} className="mouse-position mouseposition-control"></div>;
};

export default CoordinatePosition;
