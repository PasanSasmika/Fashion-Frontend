import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, saveCart } from '../../context/CartContext';
import NavBar from '../../components/NavBar';
import axios from 'axios';
import { toast } from 'react-hot-toast';

function Cart() {
  const [cart, setCart] = useState([]);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const cartData = getCart();
    setCart(cartData);
  }, []);

  const handleQuantityChange = (index, change) => {
    const newCart = [...cart];
    const newQuantity = newCart[index].quantity + change;
    if (newQuantity >= 1) {
      newCart[index].quantity = newQuantity;
      setCart(newCart);
      saveCart(newCart);
    }
  };

  const handleRemoveItem = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    saveCart(newCart);
    toast.success("Item removed from cart");
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const formatPrice = (price) => {
    return `LKR ${parseFloat(price).toFixed(2)}`;
  };

 const handleCheckout = async () => {
  setCheckoutLoading(true);
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Please login to proceed to checkout");
      navigate('/login');
      return;
    }

    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/orders`,
      {
        items: cart,
        totalAmount: calculateTotal()
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const { paymentData } = response.data;
    
    // Create form dynamically
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://sandbox.payhere.lk/pay/checkout';

    Object.keys(paymentData).forEach(key => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = paymentData[key];
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();

  } catch (error) {
    console.error('Checkout failed:', error);
    toast.error(error.response?.data?.message || 'Checkout failed');
    setCheckoutLoading(false);
  }
};

  return (
    <div>
      <NavBar />
      <div className="min-h-screen w-full bg-primary py-8 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 mx-auto text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
              <h2 className="text-xl font-medium mt-4">Your cart is empty</h2>
              <p className="text-gray-500 mt-2">
                Looks like you haven't added anything to your cart yet
              </p>
              <Link
                to="/products"
                className="mt-6 inline-block bg-[#653c20] text-white px-6 py-3 rounded-lg hover:bg-[#824b26] transition"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-200">
                {cart.map((item, index) => (
                  <div key={index} className="flex flex-col sm:flex-row py-6">
                    <div className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-24 h-24 object-cover rounded"
                      />
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
                      <div className="flex flex-col sm:flex-row justify-between">
                        <div>
                          <h2 className="text-lg font-semibold">{item.productName}</h2>
                          <p className="text-sm text-gray-500 mt-1">Size: {item.size}</p>
                          <p className="text-sm font-medium text-gray-900 mt-1">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                        <div className="mt-4 sm:mt-0">
                          <div className="flex items-center">
                            <button
                              onClick={() => handleQuantityChange(index, -1)}
                              className="px-3 py-1 border border-gray-300 rounded-l-md hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="px-3 py-1 border-t border-b border-gray-300">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(index, 1)}
                              className="px-3 py-1 border border-gray-300 rounded-r-md hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(index)}
                            className="mt-2 text-sm text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 mt-6 pt-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>{formatPrice(calculateTotal())}</p>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Shipping and taxes calculated at checkout.
                </p>
                <div className="mt-6 flex flex-col space-y-4">
                  <button
                    onClick={handleCheckout}
                    disabled={checkoutLoading}
                    className={`flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#653c20] hover:bg-[#824b26] ${
                      checkoutLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {checkoutLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                        Processing...
                      </>
                    ) : (
                      'Proceed to Checkout'
                    )}
                  </button>
                  <Link
                    to="/products"
                    className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-[#653c20] bg-white hover:bg-gray-50"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cart;