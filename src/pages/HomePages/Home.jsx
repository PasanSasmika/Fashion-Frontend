import React from 'react'
import { Link } from 'react-router-dom'
import mainImage from '/aa.jpg'

function Home() {
  return (
    <>
      {/* Large Screen Layout */}
      <div className="hidden md:flex h-screen bg-primary">
        <div className="w-[40%] h-full flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-[72px] text-black font-bold font-main">
              Elevate Your Wardrobe
            </h1>
            <h2 className="text-[48px] font-second text-secondary mt-2">
              with TrendyTees
            </h2>
            <p className="text-[18px] text-gray-700 mt-4 max-w-[400px] mx-auto">
              Discover our latest collection of stylish and comfortable t-shirts.
            </p>
            <Link to="/products">
              <button className="mt-8 px-8 py-3 bg-secondary text-white rounded-full text-[18px] font-accent hover:bg-secondary-dark transition-colors">
                View All Collection
              </button>
            </Link>
          </div>
        </div>
        <div className="w-[60%] h-full flex items-center justify-center relative">
          <img
            src={mainImage}
            alt="Fashion model showcasing a TrendyTees stylish t-shirt"
            className="w-full h-full object-cover shadow-lg rounded-md"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-secondary/10 pointer-events-none"></div>
        </div>
      </div>

      {/* Small Screen Layout */}
      <div className="md:hidden h-screen w-full bg-primary flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img
            src={mainImage}
            alt="Fashion model showcasing a TrendyTees stylish t-shirt"
            className="w-full h-full object-cover shadow-lg rounded-md"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-secondary/70"></div>
        </div>
        <div className="relative z-10 text-center px-6 py-8">
          <h1 className="text-[36px] text-white font-bold font-main leading-tight">
            Elevate Your Wardrobe
          </h1>
          <h2 className="text-[24px] font-second text-white font-light mt-2">
            with TrendyTees
          </h2>
          <p className="text-[14px] text-white/90 mt-3 max-w-[280px] mx-auto">
            Discover our latest collection of stylish and comfortable t-shirts.
          </p>
          <Link to="/products">
            <button className="mt-6 px-6 py-2 bg-white text-secondary rounded-full text-[16px] font-accent hover:bg-gray-100 transition-colors">
              View All Collection
            </button>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Home