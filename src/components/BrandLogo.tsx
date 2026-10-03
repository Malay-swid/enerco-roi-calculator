import React from 'react';

export function BrandLogo() {
  return (
    <span className="relative block h-[42px] w-[170px] shrink-0 overflow-hidden rounded-sm bg-white sm:h-[52px] sm:w-[215px]">
      <img
        src="/swid-logo.png"
        alt="SWID Renewables Limited logo"
        className="absolute left-0 top-0 h-auto w-full max-w-none"
      />
    </span>
  );
}
