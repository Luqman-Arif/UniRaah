export interface KarachiLocationOption {
  value: string
  label: string
  zone: string
}

export const KARACHI_LOCATIONS: KarachiLocationOption[] = [
  { value: 'Gulshan-e-Iqbal', label: 'Gulshan-e-Iqbal (Blocks 1–19)', zone: 'Gulshan' },
  { value: 'University Road', label: 'University Road / Mosamiyat / Scheme 33', zone: 'University Road Corridor' },
  { value: 'Gulistan-e-Jauhar', label: 'Gulistan-e-Jauhar (Blocks 1–20)', zone: 'Gulistan-e-Jauhar / Airport' },
  { value: 'North Nazimabad', label: 'North Nazimabad (Blocks A–T)', zone: 'North Nazimabad' },
  { value: 'Nazimabad', label: 'Nazimabad / Golimar / Liaquatabad', zone: 'Central' },
  { value: 'Federal B Area', label: 'Federal B. Area / Mansoorah', zone: 'Central' },
  { value: 'Clifton / Defence', label: 'DHA / Clifton (Phases 1–8)', zone: 'Clifton / Defence' },
  { value: 'PECHS / Tariq Road', label: 'PECHS / Tariq Road / Bahadurabad', zone: 'PECHS' },
  { value: 'Saddar', label: 'Saddar / MA Jinnah Road / Garden', zone: 'Saddar & City' },
  { value: 'Malir', label: 'Malir Cantt / Model Colony / Shah Latif Town', zone: 'National Highway / Malir' },
  { value: 'North Karachi', label: 'North Karachi / Surjani / New Karachi', zone: 'North' },
  { value: 'Korangi', label: 'Korangi / Landhi Industrial Area', zone: 'Korangi' },
]

// Approximate real-world transit distances in kilometres between Karachi student areas and campus zones
const DISTANCE_MATRIX: Record<string, Record<string, number>> = {
  'Gulshan-e-Iqbal': {
    'University Road Corridor': 2.5,
    'National Highway / Malir': 17.5,
    'Gulistan-e-Jauhar / Airport': 5.8,
    'Saddar & Scheme 33': 11.2,
    'M.A. Jinnah Corridor': 7.4,
    'University Road & Saddar': 3.8,
  },
  'University Road': {
    'University Road Corridor': 1.5,
    'National Highway / Malir': 15.0,
    'Gulistan-e-Jauhar / Airport': 4.5,
    'Saddar & Scheme 33': 7.0,
    'M.A. Jinnah Corridor': 8.5,
    'University Road & Saddar': 2.0,
  },
  'Gulistan-e-Jauhar': {
    'University Road Corridor': 4.8,
    'National Highway / Malir': 13.5,
    'Gulistan-e-Jauhar / Airport': 2.0,
    'Saddar & Scheme 33': 12.0,
    'M.A. Jinnah Corridor': 10.5,
    'University Road & Saddar': 5.0,
  },
  'North Nazimabad': {
    'University Road Corridor': 8.5,
    'National Highway / Malir': 24.0,
    'Gulistan-e-Jauhar / Airport': 13.0,
    'Saddar & Scheme 33': 10.5,
    'M.A. Jinnah Corridor': 9.0,
    'University Road & Saddar': 9.2,
  },
  'Nazimabad': {
    'University Road Corridor': 7.5,
    'National Highway / Malir': 22.0,
    'Gulistan-e-Jauhar / Airport': 12.0,
    'Saddar & Scheme 33': 8.0,
    'M.A. Jinnah Corridor': 6.5,
    'University Road & Saddar': 7.8,
  },
  'Federal B Area': {
    'University Road Corridor': 6.0,
    'National Highway / Malir': 21.0,
    'Gulistan-e-Jauhar / Airport': 10.5,
    'Saddar & Scheme 33': 9.5,
    'M.A. Jinnah Corridor': 8.0,
    'University Road & Saddar': 6.8,
  },
  'Clifton / Defence': {
    'University Road Corridor': 16.5,
    'National Highway / Malir': 22.5,
    'Gulistan-e-Jauhar / Airport': 17.0,
    'Saddar & Scheme 33': 6.5,
    'M.A. Jinnah Corridor': 7.8,
    'University Road & Saddar': 9.0,
  },
  'PECHS / Tariq Road': {
    'University Road Corridor': 7.8,
    'National Highway / Malir': 18.0,
    'Gulistan-e-Jauhar / Airport': 9.5,
    'Saddar & Scheme 33': 6.5,
    'M.A. Jinnah Corridor': 5.0,
    'University Road & Saddar': 7.0,
  },
  'Saddar': {
    'University Road Corridor': 11.5,
    'National Highway / Malir': 23.0,
    'Gulistan-e-Jauhar / Airport': 14.0,
    'Saddar & Scheme 33': 2.5,
    'M.A. Jinnah Corridor': 2.0,
    'University Road & Saddar': 5.5,
  },
  'Malir': {
    'University Road Corridor': 14.5,
    'National Highway / Malir': 4.2,
    'Gulistan-e-Jauhar / Airport': 8.0,
    'Saddar & Scheme 33': 18.0,
    'M.A. Jinnah Corridor': 17.0,
    'University Road & Saddar': 13.5,
  },
  'North Karachi': {
    'University Road Corridor': 11.0,
    'National Highway / Malir': 26.0,
    'Gulistan-e-Jauhar / Airport': 15.0,
    'Saddar & Scheme 33': 12.5,
    'M.A. Jinnah Corridor': 11.5,
    'University Road & Saddar': 11.5,
  },
  'Korangi': {
    'University Road Corridor': 16.0,
    'National Highway / Malir': 12.0,
    'Gulistan-e-Jauhar / Airport': 14.0,
    'Saddar & Scheme 33': 13.5,
    'M.A. Jinnah Corridor': 12.0,
    'University Road & Saddar': 15.0,
  },
}

/**
 * Calculates estimated distance in km between a student's home area and a university zone.
 * Returns null if studentLocation is unspecified or not recognized.
 */
export function calculateKarachiDistanceKm(
  studentLocation: string | undefined | null,
  campusZone: string
): number | null {
  if (!studentLocation || studentLocation.trim() === '' || studentLocation === 'unspecified') {
    return null
  }

  const areaRecord = DISTANCE_MATRIX[studentLocation]
  if (!areaRecord) {
    return null
  }

  // Find exact or closest zone match
  if (areaRecord[campusZone] !== undefined) {
    return areaRecord[campusZone]
  }

  // Fallback zone matching
  for (const zoneKey of Object.keys(areaRecord)) {
    if (campusZone.toLowerCase().includes(zoneKey.toLowerCase()) || zoneKey.toLowerCase().includes(campusZone.toLowerCase())) {
      return areaRecord[zoneKey]
    }
  }

  return 12.0 // Default reasonable distance within Karachi if specific zone not indexed
}

/**
 * Normalizes distance into a proximity score (0-100).
 * Closer campuses receive higher scores.
 * Returns null if distance is not calculable.
 */
export function calculateDistanceScore(distanceKm: number | null): number | null {
  if (distanceKm === null) {
    return null
  }

  if (distanceKm <= 3.0) return 100
  if (distanceKm <= 6.0) return 92
  if (distanceKm <= 10.0) return 82
  if (distanceKm <= 15.0) return 70
  if (distanceKm <= 20.0) return 55
  if (distanceKm <= 25.0) return 40
  return Math.max(20, Math.round(100 - distanceKm * 3))
}
