import { useEffect, useState } from 'react';
import { flightApi } from '../services/flightApi';

interface TravelStatisticsEnhanced {
  mileageRankings: {
    byYear: Array<{
      year: string;
      totalMileage: number;
      flightCount: number;
      averageMileage: number;
      rank: number;
    }>;
    byMonth: Array<{
      yearMonth: string;
      totalMileage: number;
      flightCount: number;
      rank: number;
    }>;
    topRoutes: Array<{
      route: string;
      flightCount: number;
      totalMileage: number;
      rank: number;
    }>;
  };
  recordFlights: {
    farthestFlight: {
      flightNumber: string;
      date: string;
      departureCity: string;
      arrivalCity: string;
      distance: number;
      airline: string;
    };
    shortestFlight: {
      flightNumber: string;
      date: string;
      departureCity: string;
      arrivalCity: string;
      distance: number;
      airline: string;
    };
    mostFrequentRoute: {
      route: string;
      flightCount: number;
      firstFlight: string;
      lastFlight: string;
    };
  };
  visitStatistics: {
    totalCities: number;
    totalCountries: number;
    domesticFlights: number;
    internationalFlights: number;
    topCities: Array<{
      cityName: string;
      visitCount: number;
      firstVisit: string;
      lastVisit: string;
    }>;
  };
  travelTrends: {
    yearOverYearGrowth: number;
    peakTravelMonth: string;
    peakTravelQuarter: string;
    averageFlightsPerMonth: number;
    trendDirection: string;
  };
  monthlyBreakdown: Array<{
    yearMonth: string;
    flightCount: number;
    totalMileage: number;
    uniqueRoutes: number;
  }>;
  quarterlyBreakdown: Array<{
    yearQuarter: string;
    flightCount: number;
    totalMileage: number;
    uniqueRoutes: number;
  }>;
  achievements: Array<{
    title: string;
    description: string;
    value: string;
    date?: string;
    type: string;
  }>;
}

export default function TravelStatistics() {
  const [stats, setStats] = useState<TravelStatisticsEnhanced | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const data = await flightApi.getTravelStatisticsEnhanced();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load statistics');
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

  if (!stats) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          暂无统计数据
        </div>
      </div>
    );
  }

  const { mileageRankings, recordFlights, visitStatistics, travelTrends, monthlyBreakdown, quarterlyBreakdown, achievements } = stats;

  const getTrendColor = (direction: string) => {
    if (direction === 'increasing') return 'text-green-600';
    if (direction === 'decreasing') return 'text-red-600';
    return 'text-gray-600';
  };

  const getTrendIcon = (direction: string) => {
    if (direction === 'increasing') return '↗';
    if (direction === 'decreasing') return '↘';
    return '→';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">旅行统计增强</h1>

      {/* Travel Trends */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 mb-8 text-white">
        <h2 className="text-2xl font-bold mb-4">旅行趋势</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <div className="text-sm opacity-90 mb-1">年度增长率</div>
            <div className={`text-3xl font-bold ${getTrendColor(travelTrends.trendDirection)}`}>
              {travelTrends.yearOverYearGrowth > 0 ? '+' : ''}
              {travelTrends.yearOverYearGrowth.toFixed(1)}%
            </div>
            <div className="text-sm opacity-75 mt-1">
              {getTrendIcon(travelTrends.trendDirection)} {travelTrends.trendDirection}
            </div>
          </div>
          <div>
            <div className="text-sm opacity-90 mb-1">高峰月份</div>
            <div className="text-2xl font-bold">{travelTrends.peakTravelMonth}</div>
          </div>
          <div>
            <div className="text-sm opacity-90 mb-1">高峰季度</div>
            <div className="text-2xl font-bold">{travelTrends.peakTravelQuarter}</div>
          </div>
          <div>
            <div className="text-sm opacity-90 mb-1">月均航班</div>
            <div className="text-2xl font-bold">{travelTrends.averageFlightsPerMonth.toFixed(1)}</div>
          </div>
        </div>
      </div>

      {/* Record Flights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="text-3xl mr-3">🏆</div>
            <h3 className="text-lg font-bold text-gray-800">最远航班</h3>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-blue-600">
              {recordFlights.farthestFlight.distance.toFixed(0)} km
            </div>
            <div className="text-sm text-gray-700">
              {recordFlights.farthestFlight.flightNumber}
            </div>
            <div className="text-sm text-gray-600">
              {recordFlights.farthestFlight.departureCity} → {recordFlights.farthestFlight.arrivalCity}
            </div>
            <div className="text-xs text-gray-500">
              {recordFlights.farthestFlight.date?.split('T')[0]}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="text-3xl mr-3">⚡</div>
            <h3 className="text-lg font-bold text-gray-800">最短航班</h3>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-green-600">
              {recordFlights.shortestFlight.distance.toFixed(0)} km
            </div>
            <div className="text-sm text-gray-700">
              {recordFlights.shortestFlight.flightNumber}
            </div>
            <div className="text-sm text-gray-600">
              {recordFlights.shortestFlight.departureCity} → {recordFlights.shortestFlight.arrivalCity}
            </div>
            <div className="text-xs text-gray-500">
              {recordFlights.shortestFlight.date?.split('T')[0]}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="text-3xl mr-3">🔄</div>
            <h3 className="text-lg font-bold text-gray-800">最常航线</h3>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-purple-600">
              {recordFlights.mostFrequentRoute.flightCount} 次
            </div>
            <div className="text-sm text-gray-700">
              {recordFlights.mostFrequentRoute.route}
            </div>
            <div className="text-xs text-gray-500">
              首次: {recordFlights.mostFrequentRoute.firstFlight?.split('T')[0]}
            </div>
            <div className="text-xs text-gray-500">
              最近: {recordFlights.mostFrequentRoute.lastFlight?.split('T')[0]}
            </div>
          </div>
        </div>
      </div>

      {/* Visit Statistics */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">访问统计</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600">{visitStatistics.totalCities}</div>
            <div className="text-sm text-gray-600 mt-1">访问城市</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600">{visitStatistics.totalCountries}</div>
            <div className="text-sm text-gray-600 mt-1">访问国家</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600">{visitStatistics.domesticFlights}</div>
            <div className="text-sm text-gray-600 mt-1">国内航班</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-600">{visitStatistics.internationalFlights}</div>
            <div className="text-sm text-gray-600 mt-1">国际航班</div>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-3">访问最多的城市</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {visitStatistics.topCities.slice(0, 6).map((city, index) => (
            <div key={index} className="border border-gray-200 rounded p-3">
              <div className="flex items-center justify-between mb-1">
                <div className="font-semibold text-gray-800">{city.cityName}</div>
                <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                  {city.visitCount}次
                </div>
              </div>
              <div className="text-xs text-gray-500">
                首次: {city.firstVisit?.split('T')[0]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mileage Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Yearly Mileage */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">年度里程排行</h2>
          <div className="space-y-3">
            {mileageRankings.byYear.slice(0, 5).map((year) => (
              <div key={year.year} className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div className="flex items-center">
                  <div className="text-2xl font-bold text-gray-400 w-8">#{year.rank}</div>
                  <div className="ml-3">
                    <div className="font-semibold text-gray-800">{year.year}年</div>
                    <div className="text-xs text-gray-500">{year.flightCount} 个航班</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">
                    {year.totalMileage.toFixed(0)} km
                  </div>
                  <div className="text-xs text-gray-500">
                    平均 {year.averageMileage.toFixed(0)} km
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Routes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">热门航线</h2>
          <div className="space-y-3">
            {mileageRankings.topRoutes.slice(0, 5).map((route) => (
              <div key={route.route} className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div className="flex items-center">
                  <div className="text-2xl font-bold text-gray-400 w-8">#{route.rank}</div>
                  <div className="ml-3">
                    <div className="font-semibold text-gray-800">{route.route}</div>
                    <div className="text-xs text-gray-500">
                      {route.totalMileage.toFixed(0)} km
                    </div>
                  </div>
                </div>
                <div className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded">
                  {route.flightCount}次
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">月度统计</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">月份</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">航班数</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">总里程</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">航线数</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {monthlyBreakdown.slice(0, 12).map((month) => (
                <tr key={month.yearMonth} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm font-medium text-gray-900">{month.yearMonth}</td>
                  <td className="px-4 py-2 text-sm text-right text-gray-700">{month.flightCount}</td>
                  <td className="px-4 py-2 text-sm text-right text-gray-700">
                    {month.totalMileage.toFixed(0)} km
                  </td>
                  <td className="px-4 py-2 text-sm text-right text-gray-700">{month.uniqueRoutes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">旅行成就</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="border-2 border-yellow-400 rounded-lg p-4 bg-gradient-to-br from-yellow-50 to-orange-50"
              >
                <div className="flex items-start">
                  <div className="text-3xl mr-3">🏅</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-1">{achievement.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                    <div className="text-lg font-semibold text-orange-600">{achievement.value}</div>
                    {achievement.date && (
                      <div className="text-xs text-gray-500 mt-1">{achievement.date}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
