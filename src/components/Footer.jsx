import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaPinterestP } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="bg-[#E7DED8] text-[#68513F] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex flex-col">
              <h2 className="font-main text-4xl font-bold tracking-wide">TrendyTees</h2>
              <p className="font-accent text-sm mt-2 italic">
                Where style meets comfort
              </p>
            </div>
            <p className="font-accent text-[#68513F]/90 text-base max-w-xs">
              Premium quality t-shirts with unique designs for every occasion. 
              Express yourself with style and comfort.
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-4 pt-2">
              <a href="#" className="bg-[#68513F] text-[#E7DED8] hover:bg-[#68513F]/90 transition-all p-3 rounded-full">
                <FaFacebookF size={16} />
              </a>
              <a href="#" className="bg-[#68513F] text-[#E7DED8] hover:bg-[#68513F]/90 transition-all p-3 rounded-full">
                <FaTwitter size={16} />
              </a>
              <a href="#" className="bg-[#68513F] text-[#E7DED8] hover:bg-[#68513F]/90 transition-all p-3 rounded-full">
                <FaInstagram size={16} />
              </a>
              <a href="#" className="bg-[#68513F] text-[#E7DED8] hover:bg-[#68513F]/90 transition-all p-3 rounded-full">
                <FaPinterestP size={16} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-main text-xl font-semibold mb-5 pb-2 border-b border-[#68513F]/30">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="font-accent text-[#68513F]/90 hover:text-[#68513F] transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-[#68513F] rounded-full mr-3 group-hover:animate-pulse"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="font-accent text-[#68513F]/90 hover:text-[#68513F] transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-[#68513F] rounded-full mr-3 group-hover:animate-pulse"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/products" className="font-accent text-[#68513F]/90 hover:text-[#68513F] transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-[#68513F] rounded-full mr-3 group-hover:animate-pulse"></span>
                  Collections
                </Link>
              </li>
              <li>
                <Link to="/services" className="font-accent text-[#68513F]/90 hover:text-[#68513F] transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-[#68513F] rounded-full mr-3 group-hover:animate-pulse"></span>
                  Custom Designs
                </Link>
              </li>
              <li>
                <Link to="/contact" className="font-accent text-[#68513F]/90 hover:text-[#68513F] transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-[#68513F] rounded-full mr-3 group-hover:animate-pulse"></span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="font-main text-xl font-semibold mb-5 pb-2 border-b border-[#68513F]/30">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MdLocationOn className="text-[#68513F] mt-1 mr-3 flex-shrink-0" size={20} />
                <span className="font-accent text-[#68513F]/90">
                  123 Galle Road<br />
                  Colombo 3, Sri Lanka
                </span>
              </li>
              <li className="flex items-center">
                <MdPhone className="text-[#68513F] mr-3" size={20} />
                <a href="tel:0113456678" className="font-accent text-[#68513F]/90 hover:text-[#68513F] transition-colors">
                  (011) 345 6678
                </a>
              </li>
              <li className="flex items-center">
                <MdEmail className="text-[#68513F] mr-3" size={20} />
                <a href="mailto:info@trendytees.com" className="font-accent text-[#68513F]/90 hover:text-[#68513F] transition-colors">
                  info@trendytees.com
                </a>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="font-main text-xl font-semibold mb-5 pb-2 border-b border-[#68513F]/30">Newsletter</h3>
            <p className="font-accent text-[#68513F]/90 mb-4">
              Subscribe to get special offers and updates
            </p>
            <form className="flex flex-col space-y-3">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-3 rounded-md border border-[#68513F]/30 focus:outline-none focus:ring-1 focus:ring-[#68513F]"
                required
              />
              <button 
                type="submit"
                className="bg-[#68513F] text-[#E7DED8] hover:bg-[#68513F]/90 transition-colors px-4 py-3 rounded-md font-accent font-medium"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        {/* Bottom Footer */}
        <div className="border-t border-[#68513F]/20 pt-8 pb-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="font-accent text-sm text-[#68513F]/70 mb-4 md:mb-0">
              © {new Date().getFullYear()} TrendyTees. All rights reserved.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <a href="#" className="font-accent text-[#68513F]/70 hover:text-[#68513F] text-sm">Privacy Policy</a>
              <a href="#" className="font-accent text-[#68513F]/70 hover:text-[#68513F] text-sm">Terms of Service</a>
              <a href="#" className="font-accent text-[#68513F]/70 hover:text-[#68513F] text-sm">Shipping Policy</a>
              <a href="#" className="font-accent text-[#68513F]/70 hover:text-[#68513F] text-sm">Returns & Exchanges</a>
            </div>
          </div>
          
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;