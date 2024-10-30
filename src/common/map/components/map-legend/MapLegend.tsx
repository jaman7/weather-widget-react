import React, { useMemo } from 'react';
import { ILegend } from './MapLegend.models';
import { LegendConfig } from './MapLegend.config';

interface MapLegendProps {
  legend: string;
}

const MapLegend: React.FC<MapLegendProps> = ({ legend }) => {
  const scaleDetails = useMemo<ILegend | null>(() => LegendConfig[legend] || null, [legend]);

  if (!scaleDetails) return null;

  return (
    <div className="legend-container">
      <span className="legend-title">{scaleDetails.title}</span>
      <div className="legend-gradient" style={{ width: '260px' }}>
        <div className="horizontal-gradient-line" style={{ backgroundImage: scaleDetails?.gradient }}></div>
        <div className="legend-dividers">
          {scaleDetails?.dividers?.map((divider, index) => (
            <span key={index} className="dividers">
              {divider}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapLegend;
