import { Map as OlMap } from 'ol';
import { ScaleLine } from 'ol/control';
import { useEffect, useRef } from 'react';

export interface IProps {
  viewMap: OlMap | null;
}

const Scaleline = ({ viewMap }: IProps) => {
  const scalelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewMap) {
      const mousePositionControl = new ScaleLine({
        bar: true,
        text: true,
        minWidth: 125,
        target: scalelineRef.current!,
      });

      viewMap.addControl(mousePositionControl);

      return () => {
        viewMap.removeControl(mousePositionControl);
      };
    }
  }, [viewMap]);

  return <div ref={scalelineRef} className="scaleline-control"></div>;
};

export default Scaleline;
