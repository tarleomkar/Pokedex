// import React from 'react';

const StatRangeSlider = ({ stat, value, onChange }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium capitalize">{stat}</label>
        <span className="text-sm text-gray-600">{value}</span>
      </div>
      <input
        type="range"
        min="0"
        max="210"
        value={value}
        onChange={(e) => onChange(stat, parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
};

export default StatRangeSlider;