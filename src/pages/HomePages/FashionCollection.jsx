import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function FashionCollection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
        setProducts(response.data.slice(0, 4));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Heading Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            TrendyTees Collection
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            Discover bold, comfortable, and stylish t-shirts crafted to elevate your everyday look. 
            Unleash your unique vibe with TrendyTees.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product._id} className="group">
              {/* Product Image */}
              <div className="aspect-square overflow-hidden mb-4">
                {product.Images && product.Images.length > 0 ? (
                  <img 
                    src={product.Images[0]} 
                    alt={product.productName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              
              {/* Product Info */}
              <div className="text-left">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-1">
                  {product.brand || 'TRENDYTEES'}
                </h3>
                <h2 className="text-xl font-normal text-gray-900 mb-1">
                  {product.productName}
                </h2>
                <p className="text-sm text-gray-500">{product.category}</p>
              </div>
            </div>
          ))}
        </div>

        {/* View All Products Link */}
        <div className="text-center mt-12">
          <Link 
            to="/products" 
            className="inline-block border border-gray-900 text-gray-900 px-6 py-3 font-medium hover:bg-gray-900 hover:text-white transition-colors"
          >
            View All Products
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FashionCollection;