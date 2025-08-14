import React, { useState, useEffect } from 'react';

function Profile() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view your orders');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusStyles = {
      Delivered: 'bg-green-100 text-green-800 border-green-300',
      Shipped: 'bg-blue-100 text-blue-800 border-blue-300',
      Processing: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      Pending: 'bg-orange-100 text-orange-800 border-orange-300',
      Cancelled: 'bg-red-100 text-red-800 border-red-300',
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusStyles[status] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Order History</h1>
        <p className="text-gray-600">View and manage all your previous orders</p>
      </div>
      
      {loading && (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
              <div className="flex justify-between mb-4">
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-100 rounded w-1/3"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                <div className="h-4 bg-gray-100 rounded w-1/4 mt-4"></div>
                <div className="space-y-2 mt-3">
                  <div className="h-12 bg-gray-100 rounded"></div>
                  <div className="h-12 bg-gray-100 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-center">
          <div className="text-red-700 font-medium flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}
      
      {!loading && !error && orders.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h3>
          <p className="text-gray-500 max-w-md mx-auto">Your order history will appear here once you make purchases</p>
        </div>
      )}
      
      {!loading && !error && orders.length > 0 && (
        <div className="space-y-6">
          {orders.map((order) => (
            <div 
              key={order.orderId} 
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-5">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Order #: {order.orderId}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(order.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <StatusBadge status={order.status} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                      <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                    </svg>
                    Payment Summary
                  </h4>
                  <p className="text-gray-700">
                    <span className="font-medium">Total:</span> LKR {order.totalAmount.toFixed(2)}
                  </p>
                </div>
                
               
              </div>
              
              <h4 className="text-md font-medium text-gray-700 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Order Items
              </h4>
              
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200 transition-colors hover:bg-gray-100"
                  >
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                    <div className="ml-4 flex-1">
                      <h5 className="font-medium text-gray-800">{item.productName}</h5>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">Size: {item.size}</span>
                        <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">LKR {item.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-500 mt-1">LKR {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;