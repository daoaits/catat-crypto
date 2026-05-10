import React from 'react';
import logoAsset from '../assets/logo-asset.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  centered?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', centered = false }) => {
  const sizeClasses = {
    sm: 'h-12',
    md: 'h-16',
    lg: 'h-24',
    xl: 'h-32'
  };

  return (
    <div className={`flex items-center gap-2 mb-8 ${centered ? 'justify-center' : ''}`}>
      <img 
        src={logoAsset} 
        alt="Catat Crypto" 
        className={`${sizeClasses[size]} w-auto object-contain`}
      />
    </div>
  );
};

export default Logo;
