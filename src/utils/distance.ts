export function calculateDistance(
  lat1: number | null,
  lon1: number | null,
  lat2: number | null,
  lon2: number | null
): number | null {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;

  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c; // Distance in kilometers
  
  return d;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function formatDistance(distance: number | null): string {
  if (distance === null) return "Distance unknown";
  
  if (distance < 1) {
    // If less than 1 km, show in meters
    return `${Math.round(distance * 1000)}m away`;
  }
  // If more than 1 km, show in km with one decimal
  return `${distance.toFixed(1)}km away`;
}