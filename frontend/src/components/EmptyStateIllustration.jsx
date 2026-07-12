import React from 'react';

export default function EmptyStateIllustration({ className = "w-48 h-48" }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Soft background glow */}
      <circle cx="100" cy="100" r="80" fill="#F3D9C8" fillOpacity="0.4" />
      
      {/* Base shadow */}
      <path d="M40 145 C 70 155, 130 155, 160 145" stroke="#2B2622" strokeWidth="4" strokeLinecap="round" />

      {/* Book Cover */}
      <rect x="42" y="55" width="116" height="82" rx="8" fill="#D9663B" stroke="#2B2622" strokeWidth="4" />
      
      {/* Book Spine */}
      <line x1="100" y1="55" x2="100" y2="137" stroke="#2B2622" strokeWidth="4" />

      {/* Pages */}
      <path d="M48 61 H 98 V 131 H 48 Z" fill="#FFFFFF" stroke="#2B2622" strokeWidth="3" />
      <path d="M102 61 H 152 V 131 H 102 Z" fill="#FFFFFF" stroke="#2B2622" strokeWidth="3" />

      {/* Left Page Lines */}
      <line x1="56" y1="75" x2="90" y2="75" stroke="#8C7C72" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="56" y1="89" x2="90" y2="89" stroke="#8C7C72" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="56" y1="103" x2="80" y2="103" stroke="#8C7C72" strokeWidth="2.5" strokeLinecap="round" />

      {/* Right Page Lines */}
      <line x1="110" y1="75" x2="144" y2="75" stroke="#8C7C72" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="110" y1="89" x2="144" y2="89" stroke="#8C7C72" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="110" y1="103" x2="130" y2="103" stroke="#8C7C72" strokeWidth="2.5" strokeLinecap="round" />

      {/* Pencil */}
      <g transform="translate(132, 90) rotate(-35)">
        <rect x="0" y="0" width="12" height="48" rx="2" fill="#F3D9C8" stroke="#2B2622" strokeWidth="3" />
        <rect x="3" y="10" width="6" height="28" fill="#D9663B" />
        
        {/* Tip */}
        <path d="M 0 0 L 6 -12 L 12 0 Z" fill="#FAF7F2" stroke="#2B2622" strokeWidth="3" />
        {/* Lead */}
        <path d="M 4 -8 L 6 -12 L 8 -8 Z" fill="#2B2622" />
      </g>
    </svg>
  );
}
