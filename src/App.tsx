import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import FlightList from './pages/FlightList';
import FlightDetail from './pages/FlightDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navigation */}
        <nav className="bg-white shadow-md">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-8">
                <Link to="/" className="text-xl font-bold text-gray-800">
                  飞机火车路线
                </Link>
                <div className="flex space-x-4">
                  <Link
                    to="/"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    统计
                  </Link>
                  <Link
                    to="/flights"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    航班列表
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/flights" element={<FlightList />} />
          <Route path="/flights/:id" element={<FlightDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
