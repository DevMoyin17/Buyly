import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-auto">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div>
            <h2 className="text-2xl font-bold text-white">Buyly</h2>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed">
              Buyly is a demo e-commerce platform built to showcase smooth 
              shopping experiences with modern design and performance.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-10 text-xs text-gray-500 border-t border-gray-700 pt-6">
          © {new Date().getFullYear()} Buyly. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
