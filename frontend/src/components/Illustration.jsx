import React from 'react';
import heroImg from '../assets/hero.png';

export default function Illustration() {
  return (
    <div className="relative w-full aspect-square max-w-lg mx-auto transform hover:scale-105 transition-transform duration-700">
      <div className="absolute inset-0 bg-primary/5 rounded-[3rem] -rotate-3 blur-3xl" />
      <img 
        src={heroImg} 
        alt="Notely Illustration" 
        className="relative z-10 w-full h-full object-contain"
      />
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-pulse" />
      <div className="absolute -top-10 -left-10 w-24 h-24 bg-surface/20 rounded-full blur-2xl animate-pulse" />
    </div>
  );
}
