import axios from 'axios';
import type { RailwayLine, RailwayTrip, RailwayStatistics } from '../types/railway';

const API_BASE = 'http://localhost:8080/api/v1/railway';

export const railwayApi = {
  // Lines
  getLines: async (): Promise<RailwayLine[]> => {
    const response = await axios.get(`${API_BASE}/lines`);
    return response.data;
  },

  getLineById: async (id: number): Promise<RailwayLine> => {
    const response = await axios.get(`${API_BASE}/lines/${id}`);
    return response.data;
  },

  getLineRoute: async (id: number): Promise<RailwayLine> => {
    const response = await axios.get(`${API_BASE}/lines/${id}/route`);
    return response.data;
  },

  // Trips
  getTrips: async (): Promise<RailwayTrip[]> => {
    const response = await axios.get(`${API_BASE}/trips`);
    return response.data;
  },

  getTripById: async (id: number): Promise<RailwayTrip> => {
    const response = await axios.get(`${API_BASE}/trips/${id}`);
    return response.data;
  },

  createTrip: async (trip: Partial<RailwayTrip>): Promise<RailwayTrip> => {
    const response = await axios.post(`${API_BASE}/trips`, trip);
    return response.data;
  },

  // Statistics
  getStatistics: async (): Promise<RailwayStatistics> => {
    const response = await axios.get(`${API_BASE}/statistics`);
    return response.data;
  },

  // Upload KML
  uploadKML: async (file: File, lineType: string): Promise<{ message: string; line: RailwayLine }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('line_type', lineType);

    const response = await axios.post(`${API_BASE}/upload-kml`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
