# 飞机火车路线

飞机和火车路线数据管理与可视化平台前端

## 项目简介

本项目是个人数据分析平台的飞机火车路线模块，用于管理和可视化飞机和火车路线数据。

## 技术栈

- **框架**: React 18 + TypeScript
- **路由**: React Router v6
- **地图**: Leaflet + React-Leaflet
- **HTTP客户端**: Axios
- **样式**: Tailwind CSS
- **构建工具**: Vite

## 数据说明

### 数据来源
- 飞机航线数据
- 火车路线数据（OpenRailMap SHP格式）
- 轨迹补全数据

### 数据存储
- SQLite数据库
- WAL模式开启

## 核心功能

### 航班模块 ✅
1. ✅ 航班列表展示
2. ✅ 高级搜索和筛选（航班号/航空公司/日期范围/距离范围）
3. ✅ 航班详情页面
4. ✅ 飞行路线地图可视化（Leaflet）
5. ✅ 统计仪表盘（总航班数/总距离/总时长/航空公司统计）

### 火车模块 ✅
1. ✅ 铁路线路管理
2. ✅ KML文件上传和导入
3. ✅ 线路地图可视化（Leaflet）
4. ✅ 线路类型筛选（高速/普速/城际）
5. ✅ 乘车记录管理（CRUD操作）
6. ✅ 统计仪表盘（线路数/乘车次数/总距离/总时长）

## 运行方式

### 开发环境
```bash
npm install
npm run dev
```

### 生产构建
```bash
npm run build
npm run preview
```

## 部署说明

- 部署路径：record.yzup.top/flights
- 基础路径配置：/flights/

## 更新日志

### 2026-03-02 (项目完成总结)
- ✅ **模块完成度: 100%**
- ✅ 后端API全部实现并测试通过
  - 航班管理API (8个端点)
  - 铁路线路API (6个端点)
  - 乘车记录API (5个端点)
- ✅ 前端功能全部完成
  - 航班模块: 列表/详情/搜索/地图可视化/统计仪表盘
  - 火车模块: 线路管理/KML导入/地图可视化/乘车记录CRUD/统计仪表盘
- ✅ 数据清理完成
  - 清理85个已导入的原始数据文件 (flight/*.kml, flight/*.csv, flight/*.json, 铁路/*.kml)
  - 数据已完整导入SQLite数据库
- 📊 **状态**: 生产就绪，可直接使用
- 🚀 **部署**: 可部署至 record.yzup.top/flights

### 2026-03-01 (Phase 5)
- ✅ 实现铁路线路列表页面（RailwayLineList）
- ✅ 实现铁路线路详情页面（RailwayLineDetail）
- ✅ 实现乘车记录管理页面（RailwayTripList）
- ✅ 集成KML文件上传功能
- ✅ 实现线路类型筛选（高速/普速/城际）
- ✅ 地图可视化铁路线路（颜色区分类型）
- ✅ 乘车记录CRUD操作
- ✅ 更新统计仪表盘添加铁路数据
- ✅ 创建railwayApi服务层
- ✅ 定义railway类型系统

### 2026-03-01 (Phase 3)
- ✅ 实现航班列表页面（FlightList）
- ✅ 实现航班详情页面（FlightDetail）
- ✅ 实现统计仪表盘（Dashboard）
- ✅ 集成Leaflet地图可视化
- ✅ 实现高级搜索和筛选功能
- ✅ 添加React Router路由导航
- ✅ 创建API服务层（flightApi）
- ✅ 定义TypeScript类型系统

### 2026-02-19
- 初始化项目结构
- 配置 React + TypeScript + Tailwind CSS
- 创建基础项目框架
