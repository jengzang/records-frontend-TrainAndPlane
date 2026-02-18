# 飞机火车路线

飞机和火车路线数据管理与可视化平台前端

## 项目简介

本项目是个人数据分析平台的飞机火车路线模块，用于管理和可视化飞机和火车路线数据。

## 技术栈

- React 18
- TypeScript
- Tailwind CSS
- Vite

## 数据说明

### 数据来源
- 飞机航线数据
- 火车路线数据（OpenRailMap SHP格式）
- 轨迹补全数据

### 数据存储
- SQLite数据库
- WAL模式开启

## 核心功能（规划中）

1. 飞机航线管理
2. 火车路线管理
3. 路线数据导入（SHP格式）
4. 路线可视化展示
5. 轨迹补全功能
6. 路线统计分析

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

### 2026-02-19
- 初始化项目结构
- 配置 React + TypeScript + Tailwind CSS
- 创建基础项目框架
