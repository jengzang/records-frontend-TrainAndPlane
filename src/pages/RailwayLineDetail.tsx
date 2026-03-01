import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import { railwayApi } from '../services/railwayApi';
import type { RailwayLine } from '../types/railway';
import 'leaflet/dist/leaflet.css';

const RailwayLineDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [line, setLine] = useState<RailwayLine | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadLine(parseInt(id));
    }
  }, [id]);

  const loadLine = async (lineId: number) => {
    setLoading(true);
    try {
      const data = await railwayApi.getLineRoute(lineId);
      setLine(data);
    } catch (error) {
      console.error('Failed to load railway line:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLineTypeColor = (type: string) => {
    switch (type) {
      case '高速':
        return 'text-red-600';
      case '城际':
        return 'text-blue-600';
      case '普速':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getMapLineColor = (type: string) => {
    switch (type) {
      case '高速':
        return 'red';
      case '城际':
        return 'blue';
      case '普速':
        return 'green';
      default:
        return 'gray';
    }
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

  if (!line) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600">线路不存在</p>
          <button
            onClick={() => navigate('/railway/lines')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            返回列表
          </button>
        </div>
      </div>
    );
  }

  // Collect all coordinates from all segments
  const allCoordinates: [number, number][] = [];
  line.segments?.forEach(segment => {
    segment.points?.forEach(point => {
      allCoordinates.push([point.latitude, point.longitude]);
    });
  });

  const center = allCoordinates.length > 0
    ? allCoordinates[Math.floor(allCoordinates.length / 2)]
    : [39.9, 116.4] as [number, number];

  const startPoint = allCoordinates[0];
  const endPoint = allCoordinates[allCoordinates.length - 1];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/railway/lines')}
          className="text-blue-500 hover:text-blue-600 mb-4 flex items-center"
        >
          <span className="mr-2">←</span> 返回列表
        </button>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-800">
            {line.line_name}
          </h1>
          <span className={`text-lg font-semibold ${getLineTypeColor(line.line_type)}`}>
            {line.line_type}
          </span>
        </div>
        {line.line_code && (
          <p className="text-gray-600 mt-2">线路代码: {line.line_code}</p>
        )}
      </div>

      {/* Line Info */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">线路信息</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {line.start_station && (
            <div>
              <p className="text-sm text-gray-500">起点站</p>
              <p className="font-semibold text-gray-800">{line.start_station}</p>
            </div>
          )}
          {line.end_station && (
            <div>
              <p className="text-sm text-gray-500">终点站</p>
              <p className="font-semibold text-gray-800">{line.end_station}</p>
            </div>
          )}
          {line.total_distance && (
            <div>
              <p className="text-sm text-gray-500">总里程</p>
              <p className="font-semibold text-gray-800">
                {line.total_distance.toFixed(0)} km
              </p>
            </div>
          )}
          {line.max_speed && (
            <div>
              <p className="text-sm text-gray-500">最高速度</p>
              <p className="font-semibold text-gray-800">{line.max_speed} km/h</p>
            </div>
          )}
          {line.opened_date && (
            <div>
              <p className="text-sm text-gray-500">开通日期</p>
              <p className="font-semibold text-gray-800">{line.opened_date}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-500">数据来源</p>
            <p className="font-semibold text-gray-800">{line.source}</p>
          </div>
          {line.segments && (
            <div>
              <p className="text-sm text-gray-500">线路段数</p>
              <p className="font-semibold text-gray-800">{line.segments.length} 段</p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-500">坐标点数</p>
            <p className="font-semibold text-gray-800">{allCoordinates.length} 个</p>
          </div>
        </div>
      </div>

      {/* Segments Info */}
      {line.segments && line.segments.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">线路段</h2>
          <div className="space-y-2">
            {line.segments.map((segment, index) => (
              <div key={segment.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                <span className="text-sm font-medium text-gray-500">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">
                    {segment.start_station} → {segment.end_station}
                  </p>
                  {segment.segment_name && (
                    <p className="text-sm text-gray-600">{segment.segment_name}</p>
                  )}
                </div>
                {segment.distance && (
                  <span className="text-sm text-gray-600">
                    {segment.distance.toFixed(0)} km
                  </span>
                )}
                <span className="text-sm text-gray-500">
                  {segment.points?.length || 0} 点
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Map */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">线路地图</h2>
        <div className="h-[600px] rounded-lg overflow-hidden">
          {allCoordinates.length > 0 ? (
            <MapContainer
              center={center}
              zoom={8}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Polyline
                positions={allCoordinates}
                color={getMapLineColor(line.line_type)}
                weight={4}
                opacity={0.7}
              />
              {startPoint && (
                <Marker position={startPoint}>
                  <Popup>
                    <div>
                      <p className="font-semibold">起点</p>
                      <p className="text-sm">{line.start_station}</p>
                    </div>
                  </Popup>
                </Marker>
              )}
              {endPoint && (
                <Marker position={endPoint}>
                  <Popup>
                    <div>
                      <p className="font-semibold">终点</p>
                      <p className="text-sm">{line.end_station}</p>
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-100">
              <p className="text-gray-600">暂无地图数据</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RailwayLineDetail;
