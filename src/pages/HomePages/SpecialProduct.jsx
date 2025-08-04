import React from 'react';
import { HiArrowRight } from 'react-icons/hi';
import mainImage from '/aa.jpg'; // Make sure this path is correct for your project

function SpecialProduct() {
  return (
    <div className="w-full  py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Text Content - Left Column */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="inline-block bg-[#68513F]/10 px-4 py-1.5 rounded-full mb-6">
              <p className="font-accent text-[#68513F] text-sm uppercase tracking-wider">Seasonal Sale</p>
            </div>
            
            <h1 className="font-main text-4xl md:text-5xl font-bold text-[#68513F] leading-tight">
              Save up to 75% on Premium Styles
            </h1>
            
            <p className="font-accent text-lg text-[#68513F]/80 mt-6 mb-8 max-w-md">
              Our seasonal sale continues with lifestyle, running and gym footwear at exceptional discounts.
            </p>
            
            <button className="group flex items-center gap-2 font-accent font-medium text-[#68513F] hover:text-[#68513F]/80 transition-colors">
              Shop the Collection
              <HiArrowRight className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          
          {/* Image - Right Column - Simplified */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <div 
                className="aspect-square bg-gray-200"
                style={{ 
                  backgroundImage: `url(${mainImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  boxShadow: '0 15px 30px rgba(104, 81, 63, 0.1)'
                }}
              >
                {/* Discount badge - simple and clean */}
                <div className="absolute top-6 right-6 bg-[#68513F] text-white px-4 py-2 rounded-md">
                  <p className="font-accent font-bold text-sm">75% OFF</p>
                </div>
              </div>
              
              {/* Minimal decorative line */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-[#68513F]/20"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpecialProduct;