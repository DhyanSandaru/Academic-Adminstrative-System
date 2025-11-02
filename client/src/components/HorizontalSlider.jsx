import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

export default function HorizontalSlider({ slides, width = 400 }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goLeft = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const goRight = () => {
    if (currentIndex < slides.length - 1) setCurrentIndex((prev) => prev + 1);
  };

  return (
    <div className="relative max-w-full mx-auto">
      {/* Left Arrow */}
      <button
        onClick={goLeft}
        disabled={currentIndex === 0}
        className="absolute -left-17 top-1/2 transform -translate-y-1/2 bg-white p-2  disabled:opacity-30 z-10"
      >
        <ChevronLeftIcon className="h-6 w-6 text-black" />
      </button>

      {/* Slide Container */}
      <div
        className="overflow-hidden rounded-lg border border-gray-300 shadow"
        style={{ width: `${width}px` }}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * width}px)`,
            width: `${slides.length * width}px`,
          }}
        >
          {slides.map((slide, index) => (
            <div key={index} style={{ width: `${width}px`, flexShrink: 0 }} className="p-7 box-border">
              {slide}
            </div>
          ))}
        </div>
      </div>

      {/* Right Arrow */}
      <button
        onClick={goRight}
        disabled={currentIndex === slides.length - 1}
        className="absolute -right-17 top-1/2 transform -translate-y-1/2 bg-white p-2  disabled:opacity-30 z-10"
      >
        <ChevronRightIcon className="h-6 w-6 text-black" />
      </button>
    </div>
  );
}
