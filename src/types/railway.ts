// Railway data types

export interface RailwayLine {
  id: number;
  line_name: string;
  line_code?: string;
  line_type: string; // 高速/普速/城际
  total_distance?: number;
  start_station?: string;
  end_station?: string;
  opened_date?: string;
  max_speed?: number;
  source: string;
  created_at: string;
  updated_at: string;
  segments?: RailwaySegment[];
}

export interface RailwaySegment {
  id: number;
  line_id: number;
  segment_name?: string;
  start_station: string;
  end_station: string;
  distance?: number;
  sequence: number;
  created_at: string;
  points?: RailwayPoint[];
}

export interface RailwayPoint {
  id: number;
  segment_id: number;
  longitude: number;
  latitude: number;
  altitude?: number;
  sequence: number;
  created_at: string;
}

export interface RailwayTrip {
  id: number;
  train_number: string;
  line_id?: number;
  departure_station: string;
  arrival_station: string;
  departure_time: string;
  arrival_time: string;
  duration_minutes: number;
  distance?: number;
  seat_type?: string;
  ticket_price?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  line?: RailwayLine;
}

export interface RailwayStatistics {
  id: number;
  total_lines: number;
  total_trips: number;
  total_distance: number;
  total_duration: number;
  unique_trains: number;
  date_range_start?: string;
  date_range_end?: string;
  updated_at: string;
}

export type LineType = '高速' | '普速' | '城际';
