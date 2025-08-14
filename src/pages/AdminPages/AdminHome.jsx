import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';

function AdminHome() {
  const [selectedView, setSelectedView] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    
    if (!token || userType !== 'admin') {
      toast.error('Unauthorized access. Please login as admin');
      navigate('/login');
    } else {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, [navigate]);

  const renderContent = () => {
    switch (selectedView) {
      case 'dashboard':
        return <AdminProducts />;
      case 'orders':
        return <AdminOrders />;
      default:
        return <div className="p-6">Select a view</div>;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userType");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect due to useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold text-gray-800">
                Admin Dashboard
              </span>
            </div>

            {/* Navigation Tabs */}
            <div className="hidden md:flex space-x-8 mx-8">
              <button
                onClick={() => setSelectedView('dashboard')}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  selectedView === 'dashboard'
                    ? 'text-indigo-700 border-b-2 border-indigo-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Products
              </button>
              
              <button
                onClick={() => setSelectedView('orders')}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  selectedView === 'orders'
                    ? 'text-indigo-700 border-b-2 border-indigo-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Orders
              </button>
            </div>

            {/* Logout Button */}
            <div className="flex items-center">
              <button 
                onClick={handleLogout}
                className="text-gray-600 hover:text-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white shadow-md">
        <div className="flex justify-around p-4">
          <button
            onClick={() => setSelectedView('dashboard')}
            className={`px-4 py-2 text-sm font-medium ${
              selectedView === 'dashboard' 
                ? 'text-indigo-700 border-b-2 border-indigo-700' 
                : 'text-gray-500'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setSelectedView('orders')}
            className={`px-4 py-2 text-sm font-medium ${
              selectedView === 'orders' 
                ? 'text-indigo-700 border-b-2 border-indigo-700' 
                : 'text-gray-500'
            }`}
          >
            Orders
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;