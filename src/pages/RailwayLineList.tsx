import React, { useEffect, useState } from 'react';
import { railwayApi } from '../services/railwayApi';
import type { RailwayLine, LineType } from '../types/railway';
import { useNavigate } from 'react-router-dom';

const RailwayLineList: React.FC = () => {
  const [lines, setLines] = useState<RailwayLine[]>([]);
  const [filteredLines, setFilteredLines] = useState<RailwayLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState<LineType>('普速');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadLines();
  }, []);

  useEffect(() => {
    if (filterType === 'all') {
      setFilteredLines(lines);
    } else {
      setFilteredLines(lines.filter(line => line.line_type === filterType));
    }
  }, [filterType, lines]);

  const loadLines = async () => {
    setLoading(true);
    try {
      const data = await railwayApi.getLines();
      setLines(data);
      setFilteredLines(data);
    } catch (error) {
      console.error('Failed to load railway lines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      alert('请选择KML文件');
      return;
    }

    setUploading(true);
    try {
      await railwayApi.uploadKML(uploadFile, uploadType);
      alert('KML文件上传成功!');
      setUploadFile(null);
      loadLines(); // Reload lines
    } catch (error) {
      console.error('Failed to upload KML:', error);
      alert('上传失败: ' + (error as any).message);
    } finally {
      setUploading(false);
    }
  };

  const getLineTypeColor = (type: string) => {
    switch (type) {
      case '高速':
        return 'bg-red-100 text-red-800';
      case '城际':
        return 'bg-blue-100 text-blue-800';
      case '普速':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">铁路线路</h1>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">上传KML文件</h2>
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept=".kml"
            onChange={handleFileChange}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
          />
          <select
            value={uploadType}
            onChange={(e) => setUploadType(e.target.value as LineType)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="高速">高速</option>
            <option value="普速">普速</option>
            <option value="城际">城际</option>
          </select>
          <button
            onClick={handleUpload}
            disabled={!uploadFile || uploading}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {uploading ? '上传中...' : '上传'}
          </button>
        </div>
        {uploadFile && (
          <p className="mt-2 text-sm text-gray-600">
            已选择: {uploadFile.name}
          </p>
        )}
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">筛选</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-md ${
              filterType === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            全部 ({lines.length})
          </button>
          <button
            onClick={() => setFilterType('高速')}
            className={`px-4 py-2 rounded-md ${
              filterType === '高速'
                ? 'bg-red-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            高速 ({lines.filter(l => l.line_type === '高速').length})
          </button>
          <button
            onClick={() => setFilterType('城际')}
            className={`px-4 py-2 rounded-md ${
              filterType === '城际'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            城际 ({lines.filter(l => l.line_type === '城际').length})
          </button>
          <button
            onClick={() => setFilterType('普速')}
            className={`px-4 py-2 rounded-md ${
              filterType === '普速'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            普速 ({lines.filter(l => l.line_type === '普速').length})
          </button>
        </div>
      </div>

      {/* Lines List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      ) : filteredLines.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600">暂无铁路线路数据</p>
          <p className="text-sm text-gray-500 mt-2">请上传KML文件导入线路数据</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLines.map(line => (
            <div
              key={line.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/railway/lines/${line.id}`)}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-gray-800">
                  {line.line_name}
                </h3>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getLineTypeColor(line.line_type)}`}>
                  {line.line_type}
                </span>
              </div>

              {line.line_code && (
                <p className="text-sm text-gray-600 mb-2">
                  线路代码: {line.line_code}
                </p>
              )}

              <div className="space-y-1 text-sm text-gray-600">
                {line.start_station && line.end_station && (
                  <p>
                    {line.start_station} → {line.end_station}
                  </p>
                )}
                {line.total_distance && (
                  <p>
                    总里程: {line.total_distance.toFixed(0)} km
                  </p>
                )}
                {line.max_speed && (
                  <p>
                    最高速度: {line.max_speed} km/h
                  </p>
                )}
                {line.opened_date && (
                  <p>
                    开通日期: {line.opened_date}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  数据来源: {line.source}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RailwayLineList;
