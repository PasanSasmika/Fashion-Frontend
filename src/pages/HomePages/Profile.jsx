// src/pages/HomePages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaUser, FaEnvelope, FaPhone, FaEdit, FaHistory, FaFilePdf, FaEnvelopeOpenText } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';

function Profile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        
        // Fetch user data
        const userRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setUser(userRes.data);
        setFormData({
          firstName: userRes.data.firstName,
          lastName: userRes.data.lastName,
          email: userRes.data.email,
          phone: userRes.data.phone || '',
        });
        
        // Fetch user orders
        const ordersRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/user/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setOrders(ordersRes.data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load profile data');
        console.error('Error fetching profile:', error);
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/profile`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setUser(res.data);
      toast.success('Profile updated successfully');
      setEditMode(false);
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleSendEmail = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}/send-email`,
        { email: user.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('Order confirmation sent to your email');
    } catch (error) {
      toast.error('Failed to send email');
      console.error('Error sending email:', error);
    }
  };

  const handleDownloadPDF = async (orderId) => {
    try {
      window.open(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}/generate-pdf`,
        '_blank'
      );
    } catch (error) {
      toast.error('Failed to download PDF');
      console.error('Error downloading PDF:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">Please login to view your profile</p>
          <button 
            onClick={() => navigate('/login')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 flex items-center justify-center">
                <FaUser className="text-4xl text-gray-400" />
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
                <h1 className="text-2xl font-bold">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-blue-100 mt-1">{user.email}</p>
                <div className="mt-4 flex flex-wrap gap-3 justify-center sm:justify-start">
                  <button 
                    onClick={() => setEditMode(!editMode)}
                    className="bg-white text-blue-600 hover:bg-blue-50 py-1 px-4 rounded-full flex items-center font-medium"
                  >
                    <FaEdit className="mr-2" />
                    {editMode ? 'Cancel Edit' : 'Edit Profile'}
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="bg-transparent border border-white hover:bg-white/20 py-1 px-4 rounded-full flex items-center font-medium"
                  >
                    <FiLogOut className="mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-4 px-1 text-sm font-medium border-b-2 ${
                    activeTab === 'profile'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`py-4 px-1 text-sm font-medium border-b-2 ${
                    activeTab === 'orders'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Order History
                </button>
              </nav>
            </div>

            {/* Profile Information */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800">Personal Details</h2>
                
                {editMode ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        disabled
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Contact support to change your email
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Add your phone number"
                      />
                    </div>
                    
                    <div className="flex justify-end pt-4">
                      <button
                        onClick={() => setEditMode(false)}
                        className="mr-3 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <FaUser className="text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <FaEnvelope className="text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <FaPhone className="text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">
                          {user.phone || 'Not provided'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <FaHistory className="text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Member Since</p>
                        <p className="font-medium">
                          {formatDate(user.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Order History */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Your Orders</h2>
                
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <FaHistory className="mx-auto text-4xl" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      You haven't placed any orders. Start shopping to see your order history here.
                    </p>
                    <button
                      onClick={() => navigate('/products')}
                      className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Browse Products
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Order ID
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Items
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map(order => (
                          <tr key={order._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                              #{order.orderId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(order.createdAt)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              LKR {order.totalAmount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                order.status === 'Delivered' 
                                  ? 'bg-green-100 text-green-800'
                                  : order.status === 'Cancelled'
                                    ? 'bg-red-100 text-red-800'
                                    : order.status === 'Pending'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-blue-100 text-blue-800'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => navigate(`/ordered-items/${order.orderId}`)}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="View Details"
                                >
                                  View
                                </button>
                                <button
                                  onClick={() => handleSendEmail(order.orderId)}
                                  className="text-gray-600 hover:text-gray-900"
                                  title="Email Receipt"
                                >
                                  <FaEnvelopeOpenText />
                                </button>
                                <button
                                  onClick={() => handleDownloadPDF(order.orderId)}
                                  className="text-gray-600 hover:text-gray-900"
                                  title="Download PDF"
                                >
                                  <FaFilePdf />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;