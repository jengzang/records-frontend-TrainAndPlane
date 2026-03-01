import { useEffect, useState } from 'react';
import { flightApi } from '../services/flightApi';

interface YearEmission {
  year: number;
  flight_emission: number;
  railway_emission: number;
  total_emission: number;
  flight_count: number;
  railway_count: number;
}

interface AirlineEmission {
  airline: string;
  emission: number;
  count: number;
}

interface EmissionComparison {
  flight_vs_railway: number;
  avg_flight_emission: number;
  avg_railway_emission: number;
  emission_saved: number;
}

interface CarbonFootprint {
  annual_average: number;
  trees_needed: number;
  equivalent_cars: number;
  global_percentile: number;
}

interface CarbonEmissionData {
  total_emission: number;
  flight_emission: number;
  railway_emission: number;
  emission_by_year: YearEmission[];
  emission_by_airline: AirlineEmission[];
  emission_comparison: EmissionComparison;
  carbon_footprint: CarbonFootprint;
  recommendations: string[];
}

export default function CarbonEmission() {
  const [data, setData] = useState<CarbonEmissionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const result = await flightApi.getCarbonEmission();
      setData(result);
    } catch (error) {
      console.error('Failed to load carbon emission data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className=\"flex items-center justify-center min-h-screen\">
        <div className=\"text-gray-600\">加载中...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className=\"flex items-center justify-center min-h-screen\">
        <div className=\"text-gray-600\">暂无数据</div>
      </div>
    );
  }

  return (
    <div className=\"container mx-auto px-4 py-8\">
      <h1 className=\"text-3xl font-bold text-gray-800 mb-8\">碳排放分析</h1>

      {/* 总览卡片 */}
      <div className=\"grid grid-cols-1 md:grid-cols-3 gap-6 mb-8\">
        <div className=\"bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white\">
          <div className=\"text-sm opacity-90 mb-2\">总碳排放</div>
          <div className=\"text-3xl font-bold\">{(data.total_emission / 1000).toFixed(2)}</div>
          <div className=\"text-sm opacity-90 mt-1\">吨 CO₂</div>
        </div>

        <div className=\"bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white\">
          <div className=\"text-sm opacity-90 mb-2\">航班排放</div>
          <div className=\"text-3xl font-bold\">{(data.flight_emission / 1000).toFixed(2)}</div>
          <div className=\"text-sm opacity-90 mt-1\">吨 CO₂</div>
        </div>

        <div className=\"bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white\">
          <div className=\"text-sm opacity-90 mb-2\">铁路排放</div>
          <div className=\"text-3xl font-bold\">{(data.railway_emission / 1000).toFixed(2)}</div>
          <div className=\"text-sm opacity-90 mt-1\">吨 CO₂</div>
        </div>
      </div>

      {/* 碳足迹报告 */}
      <div className=\"bg-white rounded-lg shadow-md p-6 mb-8\">
        <h2 className=\"text-xl font-bold text-gray-800 mb-4\">碳足迹报告</h2>
        <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4\">
          <div className=\"border-l-4 border-orange-500 pl-4\">
            <div className=\"text-sm text-gray-600\">年均排放</div>
            <div className=\"text-2xl font-bold text-gray-800\">
              {(data.carbon_footprint.annual_average / 1000).toFixed(2)} 吨
            </div>
          </div>
          <div className=\"border-l-4 border-green-500 pl-4\">
            <div className=\"text-sm text-gray-600\">需种植树木</div>
            <div className=\"text-2xl font-bold text-gray-800\">
              {data.carbon_footprint.trees_needed} 棵
            </div>
          </div>
          <div className=\"border-l-4 border-blue-500 pl-4\">
            <div className=\"text-sm text-gray-600\">等效汽车里程</div>
            <div className=\"text-2xl font-bold text-gray-800\">
              {(data.carbon_footprint.equivalent_cars / 1000).toFixed(1)}k 公里
            </div>
          </div>
          <div className=\"border-l-4 border-purple-500 pl-4\">
            <div className=\"text-sm text-gray-600\">全球百分位</div>
            <div className=\"text-2xl font-bold text-gray-800\">
              {data.carbon_footprint.global_percentile.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* 排放对比 */}
      <div className=\"bg-white rounded-lg shadow-md p-6 mb-8\">
        <h2 className=\"text-xl font-bold text-gray-800 mb-4\">航空 vs 铁路对比</h2>
        <div className=\"grid grid-cols-1 md:grid-cols-2 gap-6\">
          <div>
            <div className=\"flex justify-between items-center mb-2\">
              <span className=\"text-gray-600\">排放比例</span>
              <span className=\"text-lg font-bold text-gray-800\">
                {data.emission_comparison.flight_vs_railway.toFixed(2)}:1
              </span>
            </div>
            <div className=\"w-full bg-gray-200 rounded-full h-4\">
              <div
                className=\"bg-blue-500 h-4 rounded-full\"
                style={{
                  width: `${(data.flight_emission / data.total_emission) * 100}%`,
                }}
              ></div>
            </div>
            <div className=\"flex justify-between text-sm text-gray-600 mt-1\">
              <span>航空 {((data.flight_emission / data.total_emission) * 100).toFixed(1)}%</span>
              <span>铁路 {((data.railway_emission / data.total_emission) * 100).toFixed(1)}%</span>
            </div>
          </div>

          <div>
            <div className=\"space-y-3\">
              <div className=\"flex justify-between\">
                <span className=\"text-gray-600\">平均航班排放</span>
                <span className=\"font-bold text-gray-800\">
                  {(data.emission_comparison.avg_flight_emission).toFixed(1)} kg
                </span>
              </div>
              <div className=\"flex justify-between\">
                <span className=\"text-gray-600\">平均铁路排放</span>
                <span className=\"font-bold text-gray-800\">
                  {(data.emission_comparison.avg_railway_emission).toFixed(1)} kg
                </span>
              </div>
              <div className=\"flex justify-between text-green-600\">
                <span>如全用铁路可节省</span>
                <span className=\"font-bold\">
                  {(data.emission_comparison.emission_saved / 1000).toFixed(2)} 吨
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 年度排放趋势 */}
      <div className=\"bg-white rounded-lg shadow-md p-6 mb-8\">
        <h2 className=\"text-xl font-bold text-gray-800 mb-4\">年度排放趋势</h2>
        <div className=\"overflow-x-auto\">
          <table className=\"min-w-full\">
            <thead>
              <tr className=\"border-b\">
                <th className=\"text-left py-3 px-4 text-gray-600\">年份</th>
                <th className=\"text-right py-3 px-4 text-gray-600\">航班排放</th>
                <th className=\"text-right py-3 px-4 text-gray-600\">铁路排放</th>
                <th className=\"text-right py-3 px-4 text-gray-600\">总排放</th>
                <th className=\"text-right py-3 px-4 text-gray-600\">航班次数</th>
                <th className=\"text-right py-3 px-4 text-gray-600\">铁路次数</th>
              </tr>
            </thead>
            <tbody>
              {data.emission_by_year.map((year) => (
                <tr key={year.year} className=\"border-b hover:bg-gray-50\">
                  <td className=\"py-3 px-4 font-medium\">{year.year}</td>
                  <td className=\"text-right py-3 px-4\">
                    {(year.flight_emission / 1000).toFixed(2)} 吨
                  </td>
                  <td className=\"text-right py-3 px-4\">
                    {(year.railway_emission / 1000).toFixed(2)} 吨
                  </td>
                  <td className=\"text-right py-3 px-4 font-bold\">
                    {(year.total_emission / 1000).toFixed(2)} 吨
                  </td>
                  <td className=\"text-right py-3 px-4\">{year.flight_count}</td>
                  <td className=\"text-right py-3 px-4\">{year.railway_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 航司排放排行 */}
      <div className=\"bg-white rounded-lg shadow-md p-6 mb-8\">
        <h2 className=\"text-xl font-bold text-gray-800 mb-4\">航司碳排放排行</h2>
        <div className=\"space-y-3\">
          {data.emission_by_airline
            .sort((a, b) => b.emission - a.emission)
            .slice(0, 10)
            .map((airline, index) => (
              <div key={airline.airline} className=\"flex items-center\">
                <div className=\"w-8 text-center font-bold text-gray-400\">
                  {index + 1}
                </div>
                <div className=\"flex-1\">
                  <div className=\"flex justify-between items-center mb-1\">
                    <span className=\"font-medium text-gray-800\">{airline.airline}</span>
                    <span className=\"text-sm text-gray-600\">
                      {(airline.emission / 1000).toFixed(2)} 吨 · {airline.count} 次
                    </span>
                  </div>
                  <div className=\"w-full bg-gray-200 rounded-full h-2\">
                    <div
                      className=\"bg-blue-500 h-2 rounded-full\"
                      style={{
                        width: `${(airline.emission / data.emission_by_airline[0].emission) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* 碳中和建议 */}
      <div className=\"bg-gradient-to-br from-green-50 to-blue-50 rounded-lg shadow-md p-6\">
        <h2 className=\"text-xl font-bold text-gray-800 mb-4\">💡 碳中和建议</h2>
        <div className=\"space-y-3\">
          {data.recommendations.map((rec, index) => (
            <div key={index} className=\"flex items-start\">
              <div className=\"w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold mr-3 mt-0.5\">
                {index + 1}
              </div>
              <div className=\"flex-1 text-gray-700\">{rec}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}