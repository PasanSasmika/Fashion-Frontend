import React, { useState, useEffect } from 'react';
import axios from 'axios';
import uploadMediaToSupabase from '../../Utils/Media';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL
});

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    productName: '',
    altNames: [],
    images: [],
    category: '',
    description: '',
    sizes: [{ size: '', price: 0, stock: 0 }],
    newAltName: '',
    reviews: []  // Added to match backend structure
  });

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Set up Axios interceptors for authentication
  api.interceptors.request.use(config => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await api.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle size input changes
  const handleSizeChange = (index, field, value) => {
    const newSizes = [...formData.sizes];
    newSizes[index][field] = field === 'size' ? value : Number(value);
    setFormData(prev => ({ ...prev, sizes: newSizes }));
  };

  // Add new size option
  const addSize = () => {
    setFormData(prev => ({
      ...prev,
      sizes: [...prev.sizes, { size: '', price: 0, stock: 0 }]
    }));
  };

  // Remove size option
  const removeSize = (index) => {
    const newSizes = formData.sizes.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, sizes: newSizes }));
  };

  // Add alternative name
  const addAltName = () => {
    if (formData.newAltName.trim()) {
      setFormData(prev => ({
        ...prev,
        altNames: [...prev.altNames, prev.newAltName.trim()],
        newAltName: ''
      }));
    }
  };

  // Remove alternative name
  const removeAltName = (index) => {
    setFormData(prev => ({
      ...prev,
      altNames: prev.altNames.filter((_, i) => i !== index)
    }));
  };

  // Handle image uploads
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);
  };

  // Submit product form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      // Upload new images to Supabase
      const uploadedImageUrls = [];
      for (const file of newImages) {
        const url = await uploadMediaToSupabase(file);
        uploadedImageUrls.push(url);
      }

      // Align with backend data structure
      const finalData = {
        productId: formData.productId,
        productName: formData.productName,
        altNames: formData.altNames,
        Images: [...formData.images, ...uploadedImageUrls], // Capital 'I' to match backend
        category: formData.category,
        description: formData.description,
        sizes: formData.sizes,
        reviews: formData.reviews // Preserve reviews
      };

      if (editingProduct) {
        await api.put(`/api/products/${editingProduct.productId}`, finalData);
      } else {
        await api.post('/api/products', finalData);
      }

      setShowForm(false);
      fetchProducts();
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Delete a product
  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await api.delete(`/api/products/${productId}`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error.response?.data || error.message);
    }
  };

  // Edit a product
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      productId: product.productId,
      productName: product.productName,
      altNames: product.altNames || [],
      images: product.Images || [], // Match backend field name
      category: product.category,
      description: product.description,
      sizes: product.sizes.map(s => ({ 
        size: s.size, 
        price: s.price, 
        stock: s.stock 
      })),
      newAltName: '',
      reviews: product.reviews || [] // Preserve reviews
    });
    setNewImages([]);
    setShowForm(true);
  };

  // Reset form for new product
  const handleAddNew = () => {
    setEditingProduct(null);
    setFormData({
      productId: '',
      productName: '',
      altNames: [],
      images: [],
      category: '',
      description: '',
      sizes: [{ size: '', price: 0, stock: 0 }],
      newAltName: '',
      reviews: [] // Initialize reviews
    });
    setNewImages([]);
    setShowForm(true);
  };

  // Close form
  const handleCloseForm = () => {
    setShowForm(false);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
        <button 
          onClick={handleAddNew}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add New Product
        </button>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map(product => (
              <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6 text-gray-900">{product.productId}</td>
                <td className="py-4 px-6 text-gray-900">{product.productName}</td>
                <td className="py-4 px-6 text-gray-900">{product.category}</td>
                <td className="py-4 px-6">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-yellow-500 text-white px-4 py-1 rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.productId)}
                      className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-8">
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product ID*</label>
                        <input
                          type="text"
                          name="productId"
                          value={formData.productId}
                          onChange={handleChange}
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                          disabled={!!editingProduct}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name*</label>
                        <input
                          type="text"
                          name="productName"
                          value={formData.productName}
                          onChange={handleChange}
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
                        <input
                          type="text"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Alternative Names */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Alternative Names</h3>
                    <div className="flex">
                      <input
                        type="text"
                        name="newAltName"
                        value={formData.newAltName}
                        onChange={handleChange}
                        className="flex-1 p-2 border rounded-l focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Add alternative name"
                      />
                      <button
                        type="button"
                        onClick={addAltName}
                        className="bg-gray-200 px-4 py-2 rounded-r hover:bg-gray-300 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {formData.altNames.map((name, index) => (
                        <span 
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center text-sm"
                        >
                          {name}
                          <button
                            type="button"
                            onClick={() => removeAltName(index)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Description</h3>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="4"
                      required
                    ></textarea>
                  </div>

                  {/* Images */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Images</h3>
                    <input
                      type="file"
                      multiple
                      onChange={handleImageUpload}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      accept="image/*"
                    />
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {formData.images.map((img, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={img} 
                            alt={`Product ${index}`}
                            className="w-full h-32 object-cover border rounded"
                          />
                        </div>
                      ))}
                      {newImages.map((file, index) => (
                        <div key={`new-${index}`} className="relative">
                          <img 
                            src={URL.createObjectURL(file)} 
                            alt={`Preview ${index}`}
                            className="w-full h-32 object-cover border rounded"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sizes & Pricing */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Sizes & Pricing</h3>
                    {formData.sizes.map((size, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4 shadow-sm">
                        <div className="grid grid-cols-12 gap-3">
                          <div className="col-span-4">
                            <input
                              type="text"
                              placeholder="Size (e.g., S, M, L)"
                              value={size.size}
                              onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              required
                            />
                          </div>
                          <div className="col-span-3">
                            <input
                              type="number"
                              placeholder="Price"
                              value={size.price}
                              onChange={(e) => handleSizeChange(index, 'price', e.target.value)}
                              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              min="0"
                              step="0.01"
                              required
                            />
                          </div>
                          <div className="col-span-3">
                            <input
                              type="number"
                              placeholder="Stock"
                              value={size.stock}
                              onChange={(e) => handleSizeChange(index, 'stock', e.target.value)}
                              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              min="0"
                              required
                            />
                          </div>
                          <div className="col-span-2">
                            {formData.sizes.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeSize(index)}
                                className="text-red-500 hover:text-red-700 w-full py-2 font-medium"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addSize}
                      className="mt-2 text-blue-500 hover:text-blue-700 font-medium"
                    >
                      + Add Size
                    </button>
                  </div>
                </div>

                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
                  >
                    {isUploading ? 'Processing...' : 'Save Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;