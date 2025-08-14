import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/orders`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch orders: ${response.statusText}`);
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 text-center">
        Error: {error}. Please try again later.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Order Management</h1>
      
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Order ID</th>
              <th className="py-3 px-4 text-left">User</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Items</th>
              <th className="py-3 px-4 text-left">Total (LKR)</th>
              <th className="py-3 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-4 px-4 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-blue-600">
                    {order.orderId}
                  </td>
                  <td className="py-3 px-4">
                    {order.userId?.firstName} {order.userId?.lastName}
                  </td>
                  <td className="py-3 px-4">
                    {format(new Date(order.createdAt), 'MMM dd, yyyy HH:mm')}
                  </td>
                  <td className="py-3 px-4">
                    <div className="max-h-24 overflow-y-auto">
                      {order.items.map((item, index) => (
                        <div key={index} className="mb-1">
                          <div className="flex items-center">
                            <img 
                              src={item.image} 
                              alt={item.productName}
                              className="w-10 h-10 object-cover rounded mr-2"
                            />
                            <div>
                              <div className="font-medium">{item.productName}</div>
                              <div className="text-sm text-gray-500">
                                {item.size} | Qty: {item.quantity}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold">
                    {order.totalAmount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'Paid' || order.status === 'Delivered' 
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'Failed' || order.status === 'Cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;