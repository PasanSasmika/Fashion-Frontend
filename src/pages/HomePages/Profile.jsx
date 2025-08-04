// src/components/Profile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    profilepic: '',
    type: '',
    password: '',
    confirmPassword: ''
  });
  
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setMessage({ text: 'You are not logged in', type: 'error' });
        setIsLoading(false);
        return;
      }
      
      const response = await axios.get('/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setUserData({
        ...response.data,
        password: '',
        confirmPassword: ''
      });
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setMessage({ 
        text: error.response?.data?.message || 'Failed to fetch user data', 
        type: 'error' 
      });
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (userData.password && userData.password !== userData.confirmPassword) {
      setMessage({ text: 'Passwords do not match', type: 'error' });
      return;
    }
    
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const payload = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        profilepic: userData.profilepic,
        ...(userData.password && { password: userData.password })
      };
      
      const response = await axios.put('/api/users/me', payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      setUserData(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));
      setEditMode(false);
      
      // Update token if it's returned in response
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ 
        text: error.response?.data?.message || 'Failed to update profile', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    fetchUserData(); // Reset to original data
    setEditMode(false);
    setMessage({ text: '', type: '' });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

   const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    toast.success("Log Out successfully")
    navigate("/login");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">User Profile</h1>
        <button className="font-secondary text-gray-600 hover:text-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              onClick={handleLogout}>
                Logout
              </button>
        {!editMode && (
          <button 
            onClick={() => setEditMode(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>
      
      {message.text && (
        <div className={`mb-6 p-4 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3 flex flex-col items-center">
          <div className="relative">
            <img 
              src={userData.profilepic || "https://freesvg.org/img/abstract-user-flat-3.png"} 
              alt="Profile" 
              className="w-48 h-48 rounded-full object-cover border-4 border-blue-100"
            />
            {editMode && (
              <div className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md">
                <label className="cursor-pointer text-blue-600">
                  <input 
                    type="text"
                    name="profilepic"
                    value={userData.profilepic}
                    onChange={handleChange}
                    placeholder="Enter image URL"
                    className="text-sm p-1 border rounded w-full"
                  />
                  <span className="text-xs block mt-1 text-center">Change URL</span>
                </label>
              </div>
            )}
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-xl font-semibold">
              {userData.firstName} {userData.lastName}
            </p>
            <p className="text-gray-600">{userData.email}</p>
            <span className="inline-block mt-2 px-3 py-1 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full">
              {userData.type}
            </span>
          </div>
        </div>
        
        <div className="md:w-2/3">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">First Name</label>
                {editMode ? (
                  <input
                    type="text"
                    name="firstName"
                    value={userData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                ) : (
                  <p className="px-4 py-2 bg-gray-50 rounded-md">{userData.firstName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Last Name</label>
                {editMode ? (
                  <input
                    type="text"
                    name="lastName"
                    value={userData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                ) : (
                  <p className="px-4 py-2 bg-gray-50 rounded-md">{userData.lastName}</p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2">Email Address</label>
                {editMode ? (
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                ) : (
                  <p className="px-4 py-2 bg-gray-50 rounded-md">{userData.email}</p>
                )}
              </div>
              
              {editMode && (
                <>
                  <div>
                    <label className="block text-gray-700 mb-2">New Password</label>
                    <input
                      type="password"
                      name="password"
                      value={userData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Leave blank to keep current"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={userData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Confirm new password"
                    />
                  </div>
                </>
              )}
            </div>
            
            {editMode && (
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;