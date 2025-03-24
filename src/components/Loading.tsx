import React from 'react';
import { FaCloudSun } from 'react-icons/fa';

export default function Loading() {
  return (
    <div className="fixed top-0 bottom-0 right-0 left-0 flex flex-col items-center justify-center h-screen bg-[#1f2937] text-white">
      <FaCloudSun className="animate-spin text-6xl mb-4 text-blue-500" />
      <p className="text-2xl font-semibold text-gray-300 animate-pulse">Fetching Weather Data...</p>
    </div>
  );
}
