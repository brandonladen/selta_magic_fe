import React, { useState } from 'react';
import { Order } from '@/types/delivery';
import { mapService, Coordinates } from '@/services/mapService';

export interface MapDisplayProps {
  coordinates: Coordinates;
  address: Order['address'];
  width?: string;
  height?: string;
  showExternalButton?: boolean;
}

export const MapDisplay: React.FC<MapDisplayProps> = ({ 
  coordinates, 
  address, 
  width = '100%', 
  height = '300px',
  showExternalButton = true
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const mapUrl = mapService.getMapUrl(coordinates, address);
  const fullAddress = `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;
  
  return (
    <div className="border rounded-lg overflow-hidden bg-gray-100">
      <div className="p-3 bg-gray-50 border-b flex items-center justify-between">
        <div>
          <h4 className="font-medium text-sm">📍 Delivery Location</h4>
          <p className="text-xs text-gray-600">{fullAddress}</p>
          <p className="text-xs text-gray-500">
            Coordinates: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
          </p>
        </div>
        <button
          onClick={() => mapService.openMap(coordinates, address)}
          className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          title="Open in external maps app"
        >
          🔗 External
        </button>
      </div>
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Loading map...</p>
            </div>
          </div>
        )}
        <iframe
          src={mapUrl}
          width={width}
          height={height}
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Map showing ${fullAddress}`}
          onLoad={() => setIsLoading(false)}
        />
      </div>
      {showExternalButton && (
        <div className="p-2 bg-gray-50 border-t">
          <button
            onClick={() => mapService.openMap(coordinates, address)}
            className="w-full px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
          >
            🗺️ Open in External Maps App
          </button>
        </div>
      )}
    </div>
  );
};
