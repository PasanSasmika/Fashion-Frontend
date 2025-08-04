import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import { addToCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

function ProductOverview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [mainImage, setMainImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`
        );
        const productData = response.data;
        setProduct(productData);
        if (productData?.sizes?.length > 0) {
          const smallSize =
            productData.sizes.find(
              (sizeObj) => sizeObj.size.toLowerCase() === 'small' || sizeObj.size.toLowerCase() === 's'
            ) || productData.sizes[0];
          setSelectedSize(smallSize.size);
          setQuantity(1);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setQuantity(1);
  };

  const handleQuantityChange = (change) => {
    if (!selectedSize) return;
    const sizeObj = product.sizes.find((s) => s.size === selectedSize);
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= sizeObj.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (selectedSize && quantity > 0) {
      const sizeObj = product.sizes.find((s) => s.size === selectedSize);
      const item = {
        productId: id,
        productName: product.productName,
        image: product.Images[0],
        size: selectedSize,
        quantity: quantity,
        price: sizeObj.price,
      };
      addToCart(item);
      toast.success("Added to cart!")
    }
  };

  const handleBuyNow = () => {
    if (selectedSize && quantity > 0) {
      const sizeObj = product.sizes.find((s) => s.size === selectedSize);
      const item = {
        productId: id,
        productName: product.productName,
        image: product.Images[0],
        size: selectedSize,
        quantity: quantity,
        price: sizeObj.price,
      };
      addToCart(item);
      navigate('/cart');
    }
  };

  const formatPrice = (price) => {
    return `LKR ${parseFloat(price).toFixed(2)}`;
  };

  const renderSizeSelector = () => {
    if (!product?.sizes?.length) return null;
    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Select Size:</h3>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((sizeObj, index) => (
            <button
              key={`${sizeObj.size}-${index}`}
              className={`px-4 py-2 border rounded-md transition-all ${
                selectedSize === sizeObj.size
                  ? 'bg-[#653c20] text-white border-[#653c20]'
                  : sizeObj.stock > 0
                  ? 'bg-white text-gray-800 border-gray-300 hover:border-[#653c20]'
                  : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              }`}
              onClick={() => sizeObj.stock > 0 && handleSizeSelect(sizeObj.size)}
              disabled={sizeObj.stock === 0}
              title={sizeObj.stock === 0 ? 'Out of stock' : ''}
            >
              {sizeObj.size}
              {sizeObj.stock === 0 && ' (OOS)'}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderPriceDisplay = () => {
    if (!selectedSize) return null;
    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Price:</h3>
        <div className="flex items-center gap-4">
          <span className="text-green-600 text-2xl font-bold">
            {formatPrice(
              selectedSize
                ? product.sizes.find((s) => s.size === selectedSize)?.price
                : Math.min(...product.sizes.map((s) => s.price))
            )}
          </span>
        </div>
      </div>
    );
  };

  const renderQuantitySelector = () => {
    if (!selectedSize) return null;
    const sizeObj = product.sizes.find((s) => s.size === selectedSize);
    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Quantity:</h3>
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#653c20]"
          >
            -
          </button>
          <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
          <button
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= sizeObj.stock}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#653c20]"
          >
            +
          </button>
          <span className="text-sm text-gray-500">{sizeObj.stock || 0} available</span>
        </div>
      </div>
    );
  };

  const renderActionButtons = () => {
    const isOutOfStock = selectedSize && product.sizes.find((s) => s.size === selectedSize)?.stock === 0;
    return (
      <div className="flex flex-col gap-4 mt-6">
        <button
          onClick={handleAddToCart}
          className={`px-6 py-3 text-white text-lg font-semibold rounded-lg shadow-md transition ${
            !selectedSize || isOutOfStock
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#653c20] hover:bg-[#824b26] hover:scale-105'
          }`}
          disabled={!selectedSize || isOutOfStock}
        >
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
        <button
          onClick={handleBuyNow}
          className={`px-6 py-3 text-white text-lg font-semibold rounded-lg shadow-md transition ${
            !selectedSize || isOutOfStock
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#d5883a] hover:bg-[#fc9f3f] hover:scale-105'
          }`}
          disabled={!selectedSize || isOutOfStock}
        >
          Buy Now
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 bg-black text-white px-6 py-2 rounded"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <div className="min-h-screen w-full bg-primary py-8 px-4 sm:px-8">
        {product && (
          <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              <div className="w-full lg:w-1/2 p-4 sm:p-6">
                <div className="grid grid-cols-2 gap-4">
                  {product.Images.map((img, index) => (
                    <div key={index} className="aspect-square overflow-hidden rounded-lg shadow">
                      <img
                        src={img}
                        alt={`${product.productName} view ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full lg:w-1/2 p-6 sm:p-8 flex flex-col">
                <h3 className="text-gray-600 text-lg font-medium uppercase tracking-wide">
                  {product.category}
                </h3>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
                  {product.productName}
                </h1>
                {product.altNames?.length > 0 && (
                  <h2 className="text-xl sm:text-2xl text-gray-700 mt-1">
                    Also known as: {product.altNames.join(', ')}
                  </h2>
                )}
                {renderSizeSelector()}
                {renderPriceDisplay()}
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">Description:</h3>
                  <p className="text-gray-600 mt-1 whitespace-pre-line">{product.description}</p>
                </div>
                {renderQuantitySelector()}
                {renderActionButtons()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductOverview;