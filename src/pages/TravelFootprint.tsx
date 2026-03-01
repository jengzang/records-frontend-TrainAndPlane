import { useEffect, useState } from 'react';
import { flightApi } from '../services/flightApi';

interface TravelFootprint {
  summary: {
    totalFlights: number;
    totalRailwayTrips: number;
    totalDistance: number;
    citiesVisited: number;
    countriesVisited: number;
    mostVisitedCity: string;
    farthestFlight: string;
    totalTravelDays: number;
  };
  visitedCities: Array<{
    cityName: string;
    countryName: string;
    visitCount: number;
    firstVisit: string;
    lastVisit: string;
  }>;
  visitedCountries: Array<{
    countryName: string;
    countryCode: string;
    visitCount: number;
    citiesCount: number;
  }>;
  flightRoutes: Array<{
    flightNumber: string;
    date: string;
    departureCity: string;
    arrivalCity: string;
    distance: number;
    airline: string;
  }>;
  statistics: {
    flightsByAirline: Record<string, number>;
    flightsByYear: Record<string, number>;
    averageFlightDist: number;
    longestFlightDist: number;
    totalFlightDistance: number;
  };
}

export default function TravelFootprint() {
  const [footprint, setFootprint] = useState<TravelFootprint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFootprint();
  }, []);

  const loadFootprint = async () => {
    try {
      setLoading(true);
      const data = await flightApi.getTravelFootprint();
      setFootprint(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load travel footprint');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!footprint) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          暂无旅行数据
        </div>
      </div>
    );
  }

  const { summary, visitedCities, flightRoutes, statistics } = footprint;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">旅行足迹地图</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm text-gray-600 mb-2">总航班数</div>
          <div className="text-3xl font-bold text-blue-600">{summary.totalFlights}</div>
          <div className="text-xs text-gray-500 mt-2">
            铁路: {summary.totalRailwayTrips} 次
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm text-gray-600 mb-2">总里程</div>
          <div className="text-3xl font-bold text-green-600">
            {summary.totalDistance.toFixed(0)}
          </div>
          <div className="text-xs text-gray-500 mt-2">公里</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm text-gray-600 mb-2">访问城市</div>
          <div className="text-3xl font-bold text-purple-600">{summary.citiesVisited}</div>
          <div className="text-xs text-gray-500 mt-2">
            国家: {summary.countriesVisited}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm text-gray-600 mb-2">最常访问</div>
          <div className="text-2xl font-bold text-orange-600">
            {summary.mostVisitedCity || '暂无'}
          </div>
          <div className="text-xs text-gray-500 mt-2">城市</div>
        </div>
      </div>

      {/* Visited Cities */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">访问过的城市</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visitedCities.slice(0, 12).map((city, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-lg font-semibold text-gray-800">{city.cityName}</div>
                <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                  {city.visitCount}次
                </div>
              </div>
              <div className="text-sm text-gray-600">{city.countryName}</div>
              {city.firstVisit && (
                <div className="text-xs text-gray-500 mt-2">
                  首次: {city.firstVisit.split('T')[0]}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Flight Routes */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">航班路线</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  航班号
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  日期
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  出发地
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  目的地
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  距离
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  航司
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {flightRoutes.slice(0, 20).map((route, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {route.flightNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {route.date ? route.date.split('T')[0] : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {route.departureCity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {route.arrivalCity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {route.distance.toFixed(0)} km
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {route.airline}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Flights by Airline */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">航司统计</h2>
          <div className="space-y-3">
            {Object.entries(statistics.flightsByAirline)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 10)
              .map(([airline, count]) => (
                <div key={airline} className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">{airline}</div>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(count / Math.max(...Object.values(statistics.flightsByAirline))) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <div className="text-sm font-semibold text-gray-900 w-8 text-right">
                      {count}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Flights by Year */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">年度统计</h2>
          <div className="space-y-3">
            {Object.entries(statistics.flightsByYear)
              .sort(([a], [b]) => b.localeCompare(a))
              .map(([year, count]) => (
                <div key={year} className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">{year}年</div>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{
                          width: `${(count / Math.max(...Object.values(statistics.flightsByYear))) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <div className="text-sm font-semibold text-gray-900 w-8 text-right">
                      {count}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Distance Statistics */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">里程统计</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-gray-600 mb-1">总飞行里程</div>
            <div className="text-2xl font-bold text-blue-600">
              {statistics.totalFlightDistance.toFixed(0)} km
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">平均航程</div>
            <div className="text-2xl font-bold text-green-600">
              {statistics.averageFlightDist.toFixed(0)} km
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">最长航程</div>
            <div className="text-2xl font-bold text-purple-600">
              {statistics.longestFlightDist.toFixed(0)} km
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
