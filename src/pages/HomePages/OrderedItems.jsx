import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import NavBar from '../../components/NavBar';
import { saveCart } from '../../context/CartContext';

function OrderedItems() {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const finalOrderId = orderId || searchParams.get('order_id');

    if (searchParams.get('order_id') && orderId) {
      navigate(`/ordered-items/${orderId}`, { replace: true });
    }

    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please login to view order details');
          navigate('/login');
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/orders/${finalOrderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrder(response.data);
        setLoading(false);
        toast.success('Order placed successfully!');

        if (response.data.status === 'Paid') {
          saveCart([]);
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        toast.error('Failed to load order details');
        setLoading(false);
      }
    };

    if (finalOrderId) {
      fetchOrderDetails();
    } else {
      setLoading(false);
      toast.error('Invalid order ID');
    }
  }, [orderId, searchParams, navigate]);

  const formatPrice = (price) => {
    return `LKR ${parseFloat(price).toFixed(2)}`;
  };

  const handleSendEmail = async () => {
    if (!email) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}/send-email`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Order details emailed successfully!');
      setShowEmailModal(false);
      setEmail('');
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email');
    }
  };

  const handleGeneratePDF = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}/generate-pdf`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `order_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('PDF generated successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <svg
          className="animate-spin h-8 w-8 text-[#653c20]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Order not found</p>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <div className="min-h-screen w-full bg-primary py-8 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-6">Order Confirmation</h1>
          <div className="mb-6">
            <p className="text-lg font-medium">Order ID: {order.orderId}</p>
            <p className="text-lg font-medium">Status: {order.status}</p>
            <p className="text-lg font-medium">Total: {formatPrice(order.totalAmount)}</p>
          </div>
          <h2 className="text-xl font-semibold mb-4">Ordered Items</h2>
          <div className="divide-y divide-gray-200">
            {order.items.map((item, index) => (
              <div key={index} className="flex flex-col sm:flex-row py-6">
                <div className="flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-24 h-24 object-cover rounded"
                  />
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
                  <h3 className="text-lg font-semibold">{item.productName}</h3>
                  <p className="text-sm text-gray-500">Size: {item.size}</p>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatPrice(item.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex space-x-4">
            <button
              onClick={() => setShowEmailModal(true)}
              className="inline-block bg-[#653c20] text-white px-6 py-3 rounded-lg hover:bg-[#824b26] transition"
            >
              Send Email
            </button>
            <button
              onClick={handleGeneratePDF}
              className="inline-block bg-[#653c20] text-white px-6 py-3 rounded-lg hover:bg-[#824b26] transition"
            >
              Generate PDF
            </button>
            <Link
              to="/products"
              className="inline-block bg-[#653c20] text-white px-6 py-3 rounded-lg hover:bg-[#824b26] transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Send Order Details</h2>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowEmailModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                className="px-4 py-2 bg-[#653c20] text-white rounded hover:bg-[#824b26]"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderedItems;