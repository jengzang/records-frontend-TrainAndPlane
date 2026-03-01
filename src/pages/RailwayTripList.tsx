import React, { useEffect, useState } from 'react';
import { railwayApi } from '../services/railwayApi';
import type { RailwayTrip } from '../types/railway';

const RailwayTripList: React.FC = () => {
  const [trips, setTrips] = useState<RailwayTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTrip, setNewTrip] = useState<Partial<RailwayTrip>>({
    train_number: '',
    departure_station: '',
    arrival_station: '',
    departure_time: '',
    arrival_time: '',
    seat_type: '',
    notes: '',
  });

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    setLoading(true);
    try {
      const data = await railwayApi.getTrips();
      setTrips(data);
    } catch (error) {
      console.error('Failed to load railway trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTrip.train_number || !newTrip.departure_station || !newTrip.arrival_station ||
        !newTrip.departure_time || !newTrip.arrival_time) {
      alert('请填写必填字段');
      return;
    }

    try {
      // Calculate duration
      const depTime = new Date(newTrip.departure_time);
      const arrTime = new Date(newTrip.arrival_time);
      const durationMinutes = Math.floor((arrTime.getTime() - depTime.getTime()) / 60000);

      await railwayApi.createTrip({
        ...newTrip,
        duration_minutes: durationMinutes,
      });

      alert('乘车记录添加成功!');
      setShowAddForm(false);
      setNewTrip({
        train_number: '',
        departure_station: '',
        arrival_station: '',
        departure_time: '',
        arrival_time: '',
        seat_type: '',
        notes: '',
      });
      loadTrips();
    } catch (error) {
      console.error('Failed to create trip:', error);
      alert('添加失败: ' + (error as any).message);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}小时${mins}分钟`;
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">乘车记录</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {showAddForm ? '取消' : '添加记录'}
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">添加乘车记录</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  车次 *
                </label>
                <input
                  type="text"
                  value={newTrip.train_number}
                  onChange={(e) => setNewTrip({ ...newTrip, train_number: e.target.value })}
                  placeholder="例如: G1234"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  座位类型
                </label>
                <input
                  type="text"
                  value={newTrip.seat_type}
                  onChange={(e) => setNewTrip({ ...newTrip, seat_type: e.target.value })}
                  placeholder="例如: 二等座"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  出发站 *
                </label>
                <input
                  type="text"
                  value={newTrip.departure_station}
                  onChange={(e) => setNewTrip({ ...newTrip, departure_station: e.target.value })}
                  placeholder="例如: 广州南"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  到达站 *
                </label>
                <input
                  type="text"
                  value={newTrip.arrival_station}
                  onChange={(e) => setNewTrip({ ...newTrip, arrival_station: e.target.value })}
                  placeholder="例如: 深圳北"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  出发时间 *
                </label>
                <input
                  type="datetime-local"
                  value={newTrip.departure_time}
                  onChange={(e) => setNewTrip({ ...newTrip, departure_time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  到达时间 *
                </label>
                <input
                  type="datetime-local"
                  value={newTrip.arrival_time}
                  onChange={(e) => setNewTrip({ ...newTrip, arrival_time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  票价 (元)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newTrip.ticket_price || ''}
                  onChange={(e) => setNewTrip({ ...newTrip, ticket_price: parseFloat(e.target.value) })}
                  placeholder="例如: 75.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  距离 (km)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newTrip.distance || ''}
                  onChange={(e) => setNewTrip({ ...newTrip, distance: parseFloat(e.target.value) })}
                  placeholder="例如: 102.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                备注
              </label>
              <textarea
                value={newTrip.notes}
                onChange={(e) => setNewTrip({ ...newTrip, notes: e.target.value })}
                placeholder="其他备注信息"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                保存
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Trips List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      ) : trips.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600">暂无乘车记录</p>
          <p className="text-sm text-gray-500 mt-2">点击"添加记录"按钮创建第一条记录</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {trips.map(trip => (
            <div
              key={trip.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {trip.train_number}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {trip.departure_station} → {trip.arrival_station}
                  </p>
                </div>
                {trip.seat_type && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    {trip.seat_type}
                  </span>
                )}
              </div>

              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">出发时间</p>
                  <p className="font-semibold text-gray-800">
                    {formatDateTime(trip.departure_time)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">到达时间</p>
                  <p className="font-semibold text-gray-800">
                    {formatDateTime(trip.arrival_time)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">行程时长</p>
                  <p className="font-semibold text-gray-800">
                    {formatDuration(trip.duration_minutes)}
                  </p>
                </div>
                {trip.distance && (
                  <div>
                    <p className="text-gray-500">行程距离</p>
                    <p className="font-semibold text-gray-800">
                      {trip.distance.toFixed(0)} km
                    </p>
                  </div>
                )}
                {trip.ticket_price && (
                  <div>
                    <p className="text-gray-500">票价</p>
                    <p className="font-semibold text-gray-800">
                      ¥{trip.ticket_price.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>

              {trip.notes && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">{trip.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RailwayTripList;
