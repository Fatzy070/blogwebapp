import React from "react";

const Loading = ({ text = "Please wait..." }) => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="flex flex-col items-center gap-6">
        {/* Fancy Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
        </div>

        {/* Pulsing Dots */}
        <div className="flex gap-2">
          <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></span>
          <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.2s]"></span>
          <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.4s]"></span>
        </div>

        {/* Loading Text */}
        <p className="text-gray-700 font-semibold text-base sm:text-lg animate-pulse">
          {text}
        </p>
      </div>
    </div>
  );
};

export default Loading;
