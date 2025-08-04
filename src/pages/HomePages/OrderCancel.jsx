// src/pages/HomePages/OrderCancel.jsx
import React from 'react';
import NavBar from '../../components/NavBar';
import { Link } from 'react-router-dom';

function OrderCancel() {
  return (
    <div>
      <NavBar />
      <div className="min-h-screen bg-primary py-12 px-4">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">Payment Cancelled</h1>
          <p className="mb-6">Your payment was not completed. You can try again or contact support.</p>
          <div className="flex flex-col space-y-3">
            <Link 
              to="/cart" 
              className="bg-[#653c20] text-white py-2 px-4 rounded hover:bg-[#824b26] transition"
            >
              Back to Cart
            </Link>
            <Link 
              to="/products" 
              className="border border-[#653c20] text-[#653c20] py-2 px-4 rounded hover:bg-gray-100 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderCancel;