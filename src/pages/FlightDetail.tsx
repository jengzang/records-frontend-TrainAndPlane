import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import { flightApi } from '../services/flightApi';
import type { Flight } from '../types/flight';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const FlightDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadFlight(parseInt(id));
    }
  }, [id]);

  const loadFlight = async (flightId: number) => {
    setLoading(true);
    try {
      const data = await flightApi.getFlightRoute(flightId);
      setFlight(data);
    } catch (error) {
      console.error('Failed to load flight:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}小时${mins}分钟`;
  };

  const formatDistance = (meters: number) => {
    return `${(meters / 1000).toFixed(2)} 公里`;
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

  if (!flight) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600">航班不存在</p>
          <button
            onClick={() => navigate('/flights')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            返回列表
          </button>
        </div>
      </div>
    );
  }

  const routeCoordinates = flight.points?.map(p => [p.latitude, p.longitude] as [number, number]) || [];
  const center = routeCoordinates.length > 0
    ? routeCoordinates[Math.floor(routeCoordinates.length / 2)]
    : [39.9, 116.4] as [number, number];

  const startPoint = flight.points?.[0];
  const endPoint = flight.points?.[flight.points.length - 1];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/flights')}
          className="text-blue-500 hover:text-blue-600 mb-4 flex items-center"
        >
          <span className="mr-2">←</span> 返回列表
        </button>
        <h1 className="text-3xl font-bold text-gray-800">
          {flight.flight_number}
        </h1>
        <p className="text-gray-600 mt-2">
          {flight.airline} · {flight.aircraft_number}
        </p>
      </div>

      {/* Flight Info */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">航班信息</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">起飞时间</p>
            <p className="font-semibold text-gray-800">
              {new Date(flight.departure_time).toLocaleString('zh-CN')}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">降落时间</p>
            <p className="font-semibold text-gray-800">
              {new Date(flight.arrival_time).toLocaleString('zh-CN')}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">飞行时长</p>
            <p className="font-semibold text-gray-800">
              {formatDuration(flight.duration_minutes)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">飞行距离</p>
            <p className="font-semibold text-gray-800">
              {formatDistance(flight.total_distance)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">最高速度</p>
            <p className="font-semibold text-gray-800">
              {flight.max_speed} km/h
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">平均速度</p>
            <p className="font-semibold text-gray-800">
              {flight.avg_speed.toFixed(0)} km/h
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">最高高度</p>
            <p className="font-semibold text-gray-800">
              {flight.max_altitude} 米
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">轨迹点数</p>
            <p className="font-semibold text-gray-800">
              {flight.point_count} 个
            </p>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">飞行路线</h2>
        <div className="h-[600px] rounded-lg overflow-hidden">
          <MapContainer
            center={center}
            zoom={6}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {routeCoordinates.length > 0 && (
              <Polyline
                positions={routeCoordinates}
                color="blue"
                weight={3}
                opacity={0.7}
              />
            )}
            {startPoint && (
              <Marker position={[startPoint.latitude, startPoint.longitude]}>
                <Popup>
                  <div>
                    <p className="font-semibold">起点</p>
                    <p className="text-sm">{new Date(startPoint.utc_time).toLocaleString('zh-CN')}</p>
                    <p className="text-sm">高度: {startPoint.altitude}m</p>
                  </div>
                </Popup>
              </Marker>
            )}
            {endPoint && (
              <Marker position={[endPoint.latitude, endPoint.longitude]}>
                <Popup>
                  <div>
                    <p className="font-semibold">终点</p>
                    <p className="text-sm">{new Date(endPoint.utc_time).toLocaleString('zh-CN')}</p>
                    <p className="text-sm">高度: {endPoint.altitude}m</p>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default FlightDetail;
