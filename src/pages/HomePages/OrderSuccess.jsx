import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../../components/NavBar';
import { toast } from 'react-hot-toast';

function OrderSuccess() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Please login to view this order');
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
       
        
        setOrder(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load order details');
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId]);

  const formatPrice = (price) => {
    return `LKR ${parseFloat(price).toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#653c20]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <NavBar />
        <div className="min-h-screen bg-primary py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
            <svg
              className="w-16 h-16 mx-auto text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h1 className="text-2xl font-bold text-gray-900 mt-4">Error Loading Order</h1>
            <p className="text-gray-600 mt-2">{error}</p>
            <Link
              to="/products"
              className="mt-6 inline-block bg-[#653c20] text-white px-6 py-3 rounded-lg hover:bg-[#824b26] transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <div className="min-h-screen bg-primary py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-[#653c20] p-6 text-white">
            <h1 className="text-2xl font-bold">Order Confirmation</h1>
            <p className="mt-2">Thank you for your purchase!</p>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold">Order #{order.orderId}</h2>
                <p className="text-gray-600">
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'Paid'
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold mb-4">Order Details</h3>
              <div className="space-y-6">
                {order.items.map((item, index) => (
                  <div key={index} className="flex">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="ml-4 flex-1">
                      <h4 className="font-medium">{item.productName}</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Size: {item.size} | Qty: {item.quantity}
                      </p>
                      <p className="text-gray-900 mt-1">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 mt-6 pt-6">
              <h3 className="text-lg font-semibold mb-4">Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>LKR 0.00</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-3">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 mt-6 pt-6">
              <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
              {order.paymentId ? (
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-gray-700">
                    Payment ID: <span className="font-medium">{order.paymentId}</span>
                  </p>
                  <p className="text-gray-700 mt-2">
                    Paid with: <span className="font-medium">Credit/Debit Card</span>
                  </p>
                </div>
              ) : (
                <p className="text-gray-600">Payment not completed</p>
              )}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/products"
                className="flex-1 bg-[#653c20] text-white px-6 py-3 rounded-md text-center font-medium hover:bg-[#824b26] transition"
              >
                Continue Shopping
              </Link>
              <Link
                to={`/orders/${order.orderId}`}
                className="flex-1 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-md text-center font-medium hover:bg-gray-50 transition"
              >
                View Order Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;