// src/components/layout/Footer.jsx
import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 md:hidden z-30">
      <div className="flex justify-around items-center max-w-md mx-auto">
        <a href="/dashboard" className="flex flex-col items-center text-gray-500 hover:text-red-600">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
          </svg>
          <span className="text-xs mt-0.5">Home</span>
        </a>
        <a href="/tickets" className="flex flex-col items-center text-gray-500 hover:text-red-600">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
          </svg>
          <span className="text-xs mt-0.5">Tickets</span>
        </a>
        <a href="/tickets/create" className="flex flex-col items-center text-gray-500 hover:text-red-600">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
          <span className="text-xs mt-0.5">New</span>
        </a>
        <a href="/logout" className="flex flex-col items-center text-gray-500 hover:text-red-600">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
          </svg>
          <span className="text-xs mt-0.5">Logout</span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;