import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Navigation,
  Search,
  X,
  Check,
  Compass,
  AlertCircle,
  Loader2,
  Building,
} from 'lucide-react';
import { theme } from '../theme';
import { resolveCityFromLocation } from '../utils/locationUtils';
import { merchantApi } from '../services/api';

export interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  area: string;
  city: string;
  pincode: string;
}

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLat?: number | string;
  initialLng?: number | string;
  initialAddress?: string;
  initialPincode?: string;
  initialCity?: string;
  onLocationSelected: (location: LocationData) => void;
}

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isOpen,
  onClose,
  initialLat,
  initialLng,
  initialAddress = '',
  initialPincode = '',
  initialCity = '',
  onLocationSelected,
}) => {
  // Default fallback coords: Tiruppur Hub (11.1085, 77.3411)
  const defaultLat = parseFloat(String(initialLat)) || 11.1085;
  const defaultLng = parseFloat(String(initialLng)) || 77.3411;

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: defaultLat,
    lng: defaultLng,
  });

  const [locating, setLocating] = useState<boolean>(false);
  const [geocoding, setGeocoding] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searching, setSearching] = useState<boolean>(false);

  const [pickedAddress, setPickedAddress] = useState<string>(initialAddress);
  const [pickedArea, setPickedArea] = useState<string>('');
  const [pickedCity, setPickedCity] = useState<string>(initialCity);
  const [pickedPincode, setPickedPincode] = useState<string>(initialPincode);
  const [locationStatus, setLocationStatus] = useState<string>('');

  // Create Custom SVG Map Pin
  const createPinIcon = () => {
    return L.divIcon({
      className: 'prinkout-custom-map-pin',
      html: `
        <div style="position: relative; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;">
          <div style="width: 34px; height: 34px; border-radius: 50% 50% 50% 0; background: linear-gradient(135deg, #EF4444 0%, #B91C1C 100%); transform: rotate(-45deg); box-shadow: 0 6px 18px rgba(239, 68, 68, 0.55); display: flex; align-items: center; justify-content: center; border: 2.5px solid #FFFFFF;">
            <div style="width: 10px; height: 10px; background-color: #FFFFFF; border-radius: 50%; transform: rotate(45deg);"></div>
          </div>
          <div style="position: absolute; bottom: -4px; left: 50%; transform: translateX(-50%); width: 14px; height: 4px; background: rgba(0,0,0,0.25); border-radius: 50%; filter: blur(1.5px);"></div>
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 36],
    });
  };

  // Reverse geocode latitude and longitude to street, area, city, pincode
  const handleReverseGeocode = async (lat: number, lng: number) => {
    setGeocoding(true);
    setLocationStatus('Resolving address details...');
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: { 'Accept-Language': 'en' },
        }
      );
      const data = await res.json();
      if (data && data.address) {
        const addr = data.address;
        const street = addr.road || addr.pedestrian || addr.suburb || addr.neighbourhood || '';
        const area = addr.suburb || addr.neighbourhood || addr.city_district || addr.county || '';
        const rawCity = addr.city || addr.town || addr.municipality || addr.village || addr.state_district || '';
        const postcode = (addr.postcode || '').replace(/\D/g, '').slice(0, 6);

        const fullStreet = [addr.house_number, street, area].filter(Boolean).join(', ');
        const resolvedCityName = resolveCityFromLocation(postcode, data.display_name, rawCity);

        setPickedAddress(fullStreet || data.display_name?.split(',').slice(0, 3).join(',') || 'Storefront Location');
        setPickedArea(area || '');
        setPickedCity(resolvedCityName || initialCity || '');
        if (postcode && postcode.length === 6) {
          setPickedPincode(postcode);
        } else if (initialPincode) {
          setPickedPincode(initialPincode);
        }

        setLocationStatus('Location identified');
      } else {
        setLocationStatus('Coordinates updated');
      }
    } catch (e) {
      // Fallback: preserve initial details if reverse geocode fails
      setPickedCity(initialCity || '');
      setPickedPincode(initialPincode || '');
      setLocationStatus('Coordinates captured');
    } finally {
      setGeocoding(false);
    }
  };

  // Browser GPS Geolocation Request
  const detectBrowserLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser');
      return;
    }

    setLocating(true);
    setLocationStatus('Detecting your GPS location...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCoords({ lat, lng });

        if (mapRef.current && markerRef.current) {
          mapRef.current.flyTo([lat, lng], 16, { duration: 1.2 });
          markerRef.current.setLatLng([lat, lng]);
        }

        handleReverseGeocode(lat, lng);
        setLocating(false);
      },
      (error) => {
        console.warn('Browser geolocation error:', error.message);
        setLocating(false);
        setLocationStatus('GPS permission not granted. Move the pin manually.');
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  // Search address / area
  const handleSearchLocation = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setLocationStatus('Searching location...');
    try {
      // Prioritize Tamil Nadu / India search
      const queryWithRegion = searchQuery.toLowerCase().includes('india')
        ? searchQuery
        : `${searchQuery}, Tamil Nadu, India`;

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryWithRegion)}&limit=1&addressdetails=1`
      );
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const first = data[0];
        const lat = parseFloat(first.lat);
        const lng = parseFloat(first.lon);
        setCoords({ lat, lng });

        if (mapRef.current && markerRef.current) {
          mapRef.current.flyTo([lat, lng], 16, { duration: 1.2 });
          markerRef.current.setLatLng([lat, lng]);
        }

        handleReverseGeocode(lat, lng);
      } else {
        setLocationStatus('No matching location found. Try searching with pincode or area.');
      }
    } catch (err) {
      setLocationStatus('Search unavailable. Please click on the map directly.');
    } finally {
      setSearching(false);
    }
  };

  // Initialize Leaflet Map on open
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    // Slight delay to ensure DOM container has rendered with proper dimensions
    const timer = setTimeout(() => {
      if (!mapContainerRef.current) return;

      if (!mapRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [coords.lat, coords.lng],
          zoom: 15,
          zoomControl: false,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        const marker = L.marker([coords.lat, coords.lng], {
          icon: createPinIcon(),
          draggable: true,
          autoPan: true,
        }).addTo(map);

        // Map Click: Move marker to clicked location
        map.on('click', (e: L.LeafletMouseEvent) => {
          const { lat, lng } = e.latlng;
          setCoords({ lat, lng });
          marker.setLatLng([lat, lng]);
          handleReverseGeocode(lat, lng);
        });

        // Marker Drag: Update coordinates on release
        marker.on('dragend', () => {
          const pos = marker.getLatLng();
          setCoords({ lat: pos.lat, lng: pos.lng });
          handleReverseGeocode(pos.lat, pos.lng);
        });

        mapRef.current = map;
        markerRef.current = marker;

        // Auto-request browser location on initial open if not already customized
        if (!initialLat) {
          detectBrowserLocation();
        } else {
          handleReverseGeocode(coords.lat, coords.lng);
        }
      } else {
        mapRef.current.invalidateSize();
        mapRef.current.setView([coords.lat, coords.lng], 15);
      }
    }, 150);

    return () => {
      clearTimeout(timer);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onLocationSelected({
      latitude: coords.lat,
      longitude: coords.lng,
      address: pickedAddress || `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`,
      area: pickedArea || '',
      city: pickedCity || initialCity || '',
      pincode: pickedPincode || initialPincode || '',
    });
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        backgroundColor: 'rgba(15, 23, 42, 0.78)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        animation: 'fadeIn 0.2s ease-in-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 780,
          backgroundColor: '#FFFFFF',
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.35)',
          border: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '16px 22px',
            borderBottom: '1px solid #E2E8F0',
            backgroundColor: '#F8FAFC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: '#EEF2FF',
                color: '#4F46E5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MapPin size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Pick Shop Location on Map
              </h3>
              <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 0 0' }}>
                Move the pin or click on the map to set your store coordinates.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: 'none',
              backgroundColor: '#E2E8F0',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Search Bar & Auto-Locate Button */}
        <div
          style={{
            padding: '12px 20px',
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <form
            onSubmit={handleSearchLocation}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: '#F8FAFC',
              border: '1px solid #CBD5E1',
              borderRadius: 10,
              padding: '7px 12px',
            }}
          >
            <Search size={16} color="#64748B" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search area, street name, or pincode (e.g. Avinashi Road, 641601)..."
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: 13,
                color: '#0F172A',
              }}
            />
            <button
              type="submit"
              disabled={searching}
              style={{
                padding: '4px 10px',
                borderRadius: 6,
                backgroundColor: '#1E293B',
                color: '#FFFFFF',
                border: 'none',
                fontSize: 11.5,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {searching ? 'Searching...' : 'Search'}
            </button>
          </form>

          {/* Browser GPS Locate Button */}
          <button
            type="button"
            onClick={detectBrowserLocation}
            disabled={locating}
            title="Detect current GPS location from browser"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 10,
              backgroundColor: '#EEF2FF',
              border: '1px solid #C7D2FE',
              color: '#4338CA',
              fontSize: 12.5,
              fontWeight: 700,
              cursor: locating ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 6px rgba(99, 102, 241, 0.15)',
            }}
          >
            {locating ? <Loader2 size={15} className="animate-spin" /> : <Navigation size={15} />}
            <span>{locating ? 'Locating...' : 'Use My GPS'}</span>
          </button>
        </div>

        {/* Map Viewport Area */}
        <div style={{ position: 'relative', width: '100%', height: 360, backgroundColor: '#E2E8F0' }}>
          <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

          {/* Instruction Badge */}
          <div
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              zIndex: 400,
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              color: '#FFFFFF',
              borderRadius: 8,
              padding: '6px 12px',
              fontSize: 11.5,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              backdropFilter: 'blur(4px)',
              pointerEvents: 'none',
            }}
          >
            <Compass size={13} color="#38BDF8" />
            <span>Click anywhere or drag the red pin to set location</span>
          </div>

          {/* Live Coordinates Pill */}
          <div
            style={{
              position: 'absolute',
              bottom: 12,
              left: 12,
              zIndex: 400,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: 8,
              padding: '4px 10px',
              fontSize: 11,
              fontWeight: 700,
              color: '#334155',
              boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
              border: '1px solid #E2E8F0',
            }}
          >
            📍 {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
          </div>
        </div>

        {/* Bottom Picked Address Summary & Actions */}
        <div
          style={{
            padding: '16px 22px',
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>
                Selected Address & Area
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A', lineHeight: 1.35 }}>
                {geocoding ? 'Resolving street & area...' : pickedAddress || 'Selected Map Location'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4, fontSize: 12, color: '#475569' }}>
                <span>
                  City: <strong style={{ color: '#0F172A' }}>{pickedCity || initialCity || 'Not detected'}</strong>
                </span>
                <span>•</span>
                <span>
                  Pincode: <strong style={{ color: '#0F172A' }}>{pickedPincode || initialPincode || 'Not detected'}</strong>
                </span>
                {locationStatus && (
                  <>
                    <span>•</span>
                    <span style={{ color: '#6366F1', fontWeight: 600 }}>{locationStatus}</span>
                  </>
                )}
              </div>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '4px 10px',
                borderRadius: 20,
                backgroundColor: '#DCFCE7',
                color: '#15803D',
                fontSize: 11.5,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              <Check size={13} strokeWidth={3} />
              <span>Active Hub</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, paddingTop: 4 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 18px',
                borderRadius: 10,
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                color: '#475569',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 22px',
                borderRadius: 10,
                border: 'none',
                backgroundColor: '#10B981',
                color: '#FFFFFF',
                fontSize: 13.5,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
              }}
            >
              <Check size={16} strokeWidth={2.5} />
              <span>Confirm & Set Location</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
