import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { flightApi } from '../services/flightApi';
import type { FlightSummary, AirlineStatistics } from '../types/flight';

const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<FlightSummary | null>(null);
  const [airlines, setAirlines] = useState<AirlineStatistics[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [summaryData, airlinesData] = await Promise.all([
        flightApi.getSummary(),
        flightApi.getAirlineStatistics(),
      ]);
      setSummary(summaryData);
      setAirlines(airlinesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    return `${hours}小时`;
  };

  const formatDistance = (meters: number) => {
    return `${(meters / 1000).toFixed(0)} 公里`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">飞行统计</h1>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-500 mb-2">总航班数</p>
            <p className="text-3xl font-bold text-blue-600">{summary.total_flights}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-500 mb-2">总飞行距离</p>
            <p className="text-3xl font-bold text-green-600">
              {formatDistance(summary.total_distance)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-500 mb-2">总飞行时长</p>
            <p className="text-3xl font-bold text-purple-600">
              {formatDuration(summary.total_duration)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-500 mb-2">航空公司数</p>
            <p className="text-3xl font-bold text-orange-600">{summary.unique_airlines}</p>
          </div>
        </div>
      )}

      {/* Date Range */}
      {summary && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">数据范围</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">最早航班</p>
              <p className="font-semibold text-gray-800">
                {new Date(summary.date_range.earliest).toLocaleDateString('zh-CN')}
              </p>
            </div>
            <div className="text-gray-400">→</div>
            <div>
              <p className="text-sm text-gray-500">最近航班</p>
              <p className="font-semibold text-gray-800">
                {new Date(summary.date_range.latest).toLocaleDateString('zh-CN')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Airline Statistics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">航空公司统计</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  航空公司
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  航班数
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  总距离
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  总时长
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  平均距离
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  平均时长
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {airlines.map((airline, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/flights?airline=${airline.airline}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{airline.airline}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{airline.flight_count}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDistance(airline.total_distance)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDuration(airline.total_duration)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDistance(airline.avg_distance)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDuration(airline.avg_duration)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
