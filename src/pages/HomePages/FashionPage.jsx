import React from "react";
import image1 from "/a.jpg";
import image2 from "/b.jpg";
import image3 from "/c.jpg";
import image4 from "/e.jpg";

const images = [
  { src: image1, alt: "Person wearing a black t-shirt with a tattoo" },
  { src: image2, alt: "Person wearing a black t-shirt with 'ITAL DRED.' text" },
  { src: image3, alt: "Person wearing a white t-shirt and shorts against a white wall" },
  { src: image4, alt: "Collection of t-shirts on wooden hangers" },
];

function FashionPage() {
  return (
    <div className="min-h-screen w-full bg-primary flex justify-center items-center py-16 md:py-12">
      <div className="w-full max-w-[1400px] flex flex-col md:flex-row gap-8 md:gap-12">
        {/* Left Section */}
        <div className="w-full md:w-[45%] min-h-[50vh] md:h-full flex flex-col justify-center bg-accent px-8 sm:px-10 md:px-20 py-10 md:py-16 shadow-xl rounded-lg relative animate-fadeIn">
          <div className="absolute top-6 sm:top-8 md:top-12 left-6 sm:left-8 md:left-12 w-[60px] sm:w-[80px] h-[4px] bg-gradient-to-r from-secondary to-secondary-dark"></div>
          <h1 className="font-main font-bold text-[28px] sm:text-[36px] md:text-[48px] leading-tight text-gray-900 pr-4 sm:pr-0 tracking-tight">
            Discover Your Style with TrendyTees
          </h1>
          <p className="mt-4 sm:mt-6 font-accent text-[16px] sm:text-[18px] md:text-[20px] text-gray-700 leading-relaxed">
            Explore our collection of trendy and comfortable t-shirts, crafted with passion and attention to detail. Each piece is designed to make you look and feel your best, whether you're dressing up or keeping it casual.
          </p>
          <button className="mt-8 bg-secondary text-white px-8 py-4 rounded-full font-accent text-lg hover:bg-secondary-dark transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-secondary focus:ring-opacity-50 shadow-md hover:shadow-lg">
            Explore Collection
          </button>
        </div>

        {/* Right Section - Enhanced Image Grid */}
        <div className="w-full md:w-[55%] px-6 md:px-10 py-10 md:py-0">
          <div className="columns-1 md:columns-2 gap-6">
            {images.map((image, index) => (
              <img
                key={index}
                src={image.src}
                alt={image.alt}
                className="mb-6 w-full object-cover shadow-lg rounded-xl border-2 border-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-gray-300 animate-fadeIn"
                style={{ animationDelay: `${index * 0.2}s` }}
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FashionPage;