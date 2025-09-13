import { Order } from '@/types/delivery';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface MapService {
  geocodeAddress: (address: Order['address']) => Promise<Coordinates>;
  openMap: (coordinates: Coordinates, address: Order['address']) => void;
  getMapUrl: (coordinates: Coordinates, address: Order['address']) => string;
}

class DeliveryMapService implements MapService {
  
  /**
   * Geocode an address to get coordinates using OpenStreetMap Nominatim API (free)
   */
  async geocodeAddress(address: Order['address']): Promise<Coordinates> {
    const fullAddress = `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;
    
    try {
      // Using Nominatim API (free alternative to Google Geocoding)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding service unavailable');
      }
      
      const data = await response.json();
      
      if (data.length === 0) {
        throw new Error('Address not found');
      }
      
      const result = data[0];
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon)
      };
    } catch (error) {
      console.error('Geocoding error:', error);
      // Fallback to approximate coordinates for common cities
      return this.getFallbackCoordinates(address);
    }
  }
  
  /**
   * Get fallback coordinates for common cities when geocoding fails
   */
  private getFallbackCoordinates(address: Order['address']): Coordinates {
    const fallbackCoords: Record<string, Coordinates> = {
      'Los Angeles': { lat: 34.0522, lng: -118.2437 },
      'San Francisco': { lat: 37.7749, lng: -122.4194 },
      'New York': { lat: 40.7128, lng: -74.0060 },
      'Chicago': { lat: 41.8781, lng: -87.6298 },
      'Houston': { lat: 29.7604, lng: -95.3698 },
      'Phoenix': { lat: 33.4484, lng: -112.0740 },
      'Philadelphia': { lat: 39.9526, lng: -75.1652 },
      'San Antonio': { lat: 29.4241, lng: -98.4936 },
      'San Diego': { lat: 32.7157, lng: -117.1611 },
      'Dallas': { lat: 32.7767, lng: -96.7970 },
      'Nairobi': { lat: -1.286389, lng: 36.817223 }, // Added for Kenya
      'Roysambu': { lat: -1.2287, lng: 36.8755 } // Specific area in Nairobi
    };
    
    // Try to find coordinates by city name
    const cityKey = Object.keys(fallbackCoords).find(city => 
      address.city.toLowerCase().includes(city.toLowerCase()) ||
      address.street.toLowerCase().includes(city.toLowerCase())
    );
    
    if (cityKey) {
      return fallbackCoords[cityKey];
    }
    
    // Default to center of US if no match found
    return { lat: 39.8283, lng: -98.5795 };
  }
  
  /**
   * Open the location in an external map application
   */
  openMap(coordinates: Coordinates, address: Order['address']): void {
    const fullAddress = `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;
    
    // Try to open in various map applications
    const mapUrls = [
      // Google Maps (most common)
      `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`,
      // Apple Maps (iOS/macOS)
      `http://maps.apple.com/?q=${coordinates.lat},${coordinates.lng}`,
      // OpenStreetMap
      `https://www.openstreetmap.org/?mlat=${coordinates.lat}&mlon=${coordinates.lng}&zoom=15`
    ];
    
    // Open Google Maps by default
    window.open(mapUrls[0], '_blank');
  }
  
  /**
   * Get embeddable map URL for iframe - using Google Maps embed (more reliable)
   */
  getMapUrl(coordinates: Coordinates, address: Order['address']): string {
    const fullAddress = `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;
    
    // Use Google Maps embed (works without API key for basic embedding)
    return `https://maps.google.com/maps?q=${coordinates.lat},${coordinates.lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  }
}

export const mapService = new DeliveryMapService();
