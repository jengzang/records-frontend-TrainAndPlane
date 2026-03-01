import React, { useEffect, useState } from 'react';
import { flightApi } from '../services/flightApi';
import type { Flight, SearchFilters } from '../types/flight';
import { useNavigate } from 'react-router-dom';

const FlightList: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [airlines, setAirlines] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({
    sort_by: 'date',
    sort_order: 'desc',
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadAirlines();
  }, []);

  useEffect(() => {
    loadFlights();
  }, [filters]);

  const loadAirlines = async () => {
    try {
      const data = await flightApi.getAirlines();
      setAirlines(data);
    } catch (error) {
      console.error('Failed to load airlines:', error);
    }
  };

  const loadFlights = async () => {
    setLoading(true);
    try {
      const data = await flightApi.searchFlights(filters);
      setFlights(data);
    } catch (error) {
      console.error('Failed to load flights:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDistance = (meters: number) => {
    return `${(meters / 1000).toFixed(0)} km`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">航班记录</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">筛选条件</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              航班号
            </label>
            <input
              type="text"
              placeholder="例如: CA1332"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.flight_number || ''}
              onChange={(e) => handleFilterChange('flight_number', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              航空公司
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.airline || ''}
              onChange={(e) => handleFilterChange('airline', e.target.value)}
            >
              <option value="">全部</option>
              {airlines.map(airline => (
                <option key={airline} value={airline}>{airline}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              排序方式
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.sort_by || 'date'}
              onChange={(e) => handleFilterChange('sort_by', e.target.value)}
            >
              <option value="date">日期</option>
              <option value="distance">距离</option>
              <option value="duration">时长</option>
              <option value="airline">航空公司</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              开始日期
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.date_from || ''}
              onChange={(e) => handleFilterChange('date_from', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              结束日期
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.date_to || ''}
              onChange={(e) => handleFilterChange('date_to', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              排序顺序
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.sort_order || 'desc'}
              onChange={(e) => handleFilterChange('sort_order', e.target.value)}
            >
              <option value="asc">升序</option>
              <option value="desc">降序</option>
            </select>
          </div>
        </div>
      </div>

      {/* Flight List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      ) : flights.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600">暂无航班记录</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {flights.map(flight => (
            <div
              key={flight.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/flights/${flight.id}`)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {flight.flight_number}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {flight.airline} · {flight.aircraft_number}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {new Date(flight.departure_time).toLocaleDateString('zh-CN')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(flight.departure_time).toLocaleTimeString('zh-CN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">飞行时长</p>
                  <p className="font-semibold text-gray-800">
                    {formatDuration(flight.duration_minutes)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">飞行距离</p>
                  <p className="font-semibold text-gray-800">
                    {formatDistance(flight.total_distance)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">最高速度</p>
                  <p className="font-semibold text-gray-800">
                    {flight.max_speed} km/h
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">最高高度</p>
                  <p className="font-semibold text-gray-800">
                    {flight.max_altitude} m
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlightList;
