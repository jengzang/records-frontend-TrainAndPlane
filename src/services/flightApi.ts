import axios from 'axios';
import type { Flight, FlightSummary, AirlineStatistics, SearchFilters } from '../types/flight';

const API_BASE = 'http://localhost:8080/api/v1/flights';

export const flightApi = {
  // Get all flights
  getFlights: async (): Promise<Flight[]> => {
    const response = await axios.get(`${API_BASE}`);
    return response.data;
  },

  // Search flights with filters
  searchFlights: async (filters: SearchFilters): Promise<Flight[]> => {
    const response = await axios.get(`${API_BASE}/search`, { params: filters });
    return response.data;
  },

  // Get flight by ID with route points
  getFlightById: async (id: number): Promise<Flight> => {
    const response = await axios.get(`${API_BASE}/${id}`);
    return response.data;
  },

  // Get flight route points
  getFlightRoute: async (id: number): Promise<Flight> => {
    const response = await axios.get(`${API_BASE}/${id}/route`);
    return response.data;
  },

  // Get summary statistics
  getSummary: async (): Promise<FlightSummary> => {
    const response = await axios.get(`${API_BASE}/summary`);
    return response.data;
  },

  // Get list of airlines
  getAirlines: async (): Promise<string[]> => {
    const response = await axios.get(`${API_BASE}/airlines`);
    return response.data;
  },

  // Get date range
  getDateRange: async (): Promise<{ earliest: string; latest: string }> => {
    const response = await axios.get(`${API_BASE}/date-range`);
    return response.data;
  },

  // Get airline statistics
  getAirlineStatistics: async (): Promise<AirlineStatistics[]> => {
    const response = await axios.get(`${API_BASE}/statistics/airlines`);
    return response.data;
  },

  // Get travel footprint
  getTravelFootprint: async (): Promise<any> => {
    const response = await axios.get(`${API_BASE}/travel-footprint`);
    return response.data;
  },

  // Get enhanced travel statistics
  getTravelStatisticsEnhanced: async (): Promise<any> => {
    const response = await axios.get(`${API_BASE}/statistics/enhanced`);
    return response.data;
  },

  // Get carbon emission analysis
  getCarbonEmission: async (): Promise<any> => {
    const response = await axios.get(`${API_BASE}/carbon-emission`);
    return response.data;
  },
};
