import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark text-white mt-16">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-2xl mr-3">
                🚗
              </div>
              <span className="text-xl font-semibold">HuruDrive</span>
            </div>
            <p className="text-gray-400 text-sm">
              Your trusted car rental service in Kenya. Find the perfect vehicle for your journey.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Browse Cars
                </Link>
              </li>
              <li>
                <a href="#about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span>📧</span>
                <div>
                  <div className="font-medium text-white">Email</div>
                  <a href="mailto:info@hurudrive.com" className="hover:text-white transition-colors">
                    info@hurudrive.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span>📞</span>
                <div>
                  <div className="font-medium text-white">Phone</div>
                  <a href="tel:+254712345678" className="hover:text-white transition-colors">
                    +254 712 345 678
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span>📍</span>
                <div>
                  <div className="font-medium text-white">Address</div>
                  <div>Nairobi, Kenya</div>
                </div>
              </li>
            </ul>
          </div>

          {/* Social Media & Hours */}
          <div>
            <h3 className="font-semibold mb-4">Business Hours</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Monday - Friday: 8:00 AM - 6:00 PM</li>
              <li>Saturday: 9:00 AM - 4:00 PM</li>
              <li>Sunday: 10:00 AM - 2:00 PM</li>
            </ul>
            <div className="mt-4">
              <h4 className="font-semibold mb-2 text-white">Follow Us</h4>
              <div className="flex gap-3">
                <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                  📘
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                  🐦
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                  📷
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} HuruDrive. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
