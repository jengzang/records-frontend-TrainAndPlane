// Flight data types

export interface FlightPoint {
  id: number;
  flight_id: number;
  timestamp: number;
  utc_time: string;
  longitude: number;
  latitude: number;
  altitude: number;
  speed: number;
  heading: number;
  sequence: number;
}

export interface Flight {
  id: number;
  flight_number: string;
  aircraft_number: string;
  airline: string;
  departure_time: string;
  arrival_time: string;
  duration_minutes: number;
  total_distance: number;
  max_altitude: number;
  max_speed: number;
  avg_speed: number;
  point_count: number;
  source: string;
  created_at: string;
  points?: FlightPoint[];
}

export interface FlightSummary {
  total_flights: number;
  total_distance: number;
  total_duration: number;
  unique_airlines: number;
  date_range: {
    earliest: string;
    latest: string;
  };
}

export interface AirlineStatistics {
  airline: string;
  flight_count: number;
  total_distance: number;
  total_duration: number;
  avg_distance: number;
  avg_duration: number;
}

export interface SearchFilters {
  flight_number?: string;
  airline?: string;
  date_from?: string;
  date_to?: string;
  min_distance?: number;
  max_distance?: number;
  sort_by?: 'date' | 'distance' | 'duration' | 'airline';
  sort_order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}
