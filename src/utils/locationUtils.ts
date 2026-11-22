/**
 * Location and City Resolution Utilities for Prinkout
 * Resolves accurate city names from pincodes, geolocation, and address strings.
 * Guarantees that city is never populated with placeholder values like "General".
 */

export const ACTIVE_LAUNCH_PINCODES: string[] = [
  // Tiruppur Core Hubs
  '641601',
  '641602',
  '641603',
  '641604',
  '641605',
  '641606',
  '641607',
  '641608',
  '641652',
  // Chennai Hubs
  '600028',
  '600036',
  '600040',
  '600037',
  '600038',
  '600020',
  '600025',
  '600113',
];

export const isKnownServiceablePincode = (pincode?: string): boolean => {
  if (!pincode) return false;
  const cleanPin = String(pincode).trim().replace(/\D/g, '');
  return ACTIVE_LAUNCH_PINCODES.includes(cleanPin);
};

export const resolveCityFromLocation = (
  pincode?: string,
  address?: string,
  currentCity?: string
): string => {
  // If currentCity is already a valid specific city (not "General" or empty), keep it
  if (currentCity && currentCity.trim() && currentCity.trim().toLowerCase() !== 'general') {
    return currentCity.trim();
  }

  const cleanPin = String(pincode || '').replace(/\D/g, '');

  if (cleanPin.length === 6) {
    // Chennai & Metro Region
    if (
      cleanPin.startsWith('600') ||
      cleanPin.startsWith('601') ||
      cleanPin.startsWith('602') ||
      cleanPin.startsWith('603')
    ) {
      return 'Chennai';
    }

    // Tiruppur Hubs
    if (
      ['641601', '641602', '641603', '641604', '641605', '641606', '641607', '641608', '641652'].includes(cleanPin)
    ) {
      return 'Tiruppur';
    }

    // Coimbatore
    if (cleanPin.startsWith('641')) {
      return 'Coimbatore';
    }

    // Pollachi
    if (cleanPin.startsWith('642')) {
      return 'Pollachi';
    }

    // Madurai
    if (cleanPin.startsWith('625')) {
      return 'Madurai';
    }

    // Trichy
    if (cleanPin.startsWith('620') || cleanPin.startsWith('621')) {
      return 'Trichy';
    }

    // Salem
    if (cleanPin.startsWith('636')) {
      return 'Salem';
    }

    // Erode
    if (cleanPin.startsWith('638')) {
      return 'Erode';
    }

    // Tirunelveli
    if (cleanPin.startsWith('627')) {
      return 'Tirunelveli';
    }

    // Kanyakumari
    if (cleanPin.startsWith('629')) {
      return 'Kanyakumari';
    }

    // Vellore
    if (cleanPin.startsWith('632')) {
      return 'Vellore';
    }

    // Bengaluru
    if (cleanPin.startsWith('560')) {
      return 'Bengaluru';
    }

    // Hyderabad
    if (cleanPin.startsWith('500')) {
      return 'Hyderabad';
    }

    // Delhi
    if (cleanPin.startsWith('110')) {
      return 'New Delhi';
    }

    // Mumbai
    if (cleanPin.startsWith('400')) {
      return 'Mumbai';
    }
  }

  // Address text matching
  const addrLower = String(address || '').toLowerCase();
  if (addrLower.includes('tiruppur') || addrLower.includes('tirupur') || addrLower.includes('avinashi') || addrLower.includes('valipalayam')) {
    return 'Tiruppur';
  }
  if (addrLower.includes('chennai') || addrLower.includes('madras') || addrLower.includes('ambattur') || addrLower.includes('adyar') || addrLower.includes('mogappair') || addrLower.includes('anna nagar')) {
    return 'Chennai';
  }
  if (addrLower.includes('coimbatore') || addrLower.includes('kovai') || addrLower.includes('peelamedu') || addrLower.includes('gandhipuram')) {
    return 'Coimbatore';
  }
  if (addrLower.includes('bangalore') || addrLower.includes('bengaluru')) {
    return 'Bengaluru';
  }
  if (addrLower.includes('madurai')) {
    return 'Madurai';
  }
  if (addrLower.includes('trichy') || addrLower.includes('tiruchirappalli')) {
    return 'Trichy';
  }
  if (addrLower.includes('salem')) {
    return 'Salem';
  }
  if (addrLower.includes('erode')) {
    return 'Erode';
  }

  return '';
};

export const cleanCityName = (city?: string): string => {
  if (!city) return '';
  const trimmed = city.trim();
  if (trimmed.toLowerCase() === 'general') return '';
  return trimmed;
};
