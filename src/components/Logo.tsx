import React from 'react';

const Logo = () => (
  <div className="flex items-center gap-2 mb-8">
    <div className="w-10 h-10 bg-red-700 rounded-full flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-white rounded-full border-t-0 -rotate-45" />
    </div>
    <span className="text-xl font-bold tracking-tight text-white uppercase">Catat <span className="text-red-600">Crypto</span></span>
  </div>
);

export default Logo;
