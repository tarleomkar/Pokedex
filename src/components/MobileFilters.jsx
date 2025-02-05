import React, { useState } from 'react';
import { IoClose, IoAdd, IoRemove } from 'react-icons/io5';

const MobileFilters = ({ types, onClose, onApply, onReset }) => {
  const [expandedSections, setExpandedSections] = useState({});
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [stats, setStats] = useState({
    hp: 0,
    attack: 0,
    defense: 0,
    'special-attack': 0,
    'special-defense': 0,
    speed: 0
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleApply = () => {
    onApply({ selectedTypes, selectedGenders, stats });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Filters</h2>
          <button onClick={onClose} className="text-2xl">
            <IoClose />
          </button>
        </div>

        {/* Type Section */}
        <div className="mb-4">
          <div 
            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
            onClick={() => toggleSection('type')}
          >
            <span className="font-medium">Type (Normal + 19 More)</span>
            {expandedSections.type ? <IoRemove /> : <IoAdd />}
          </div>
          {expandedSections.type && (
            <div className="mt-2 p-3">
              {types.map(type => (
                <label key={type.name} className="flex items-center space-x-2 p-2">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type.name)}
                    onChange={() => {
                      setSelectedTypes(prev => 
                        prev.includes(type.name)
                          ? prev.filter(t => t !== type.name)
                          : [...prev, type.name]
                      );
                    }}
                    className="rounded text-blue-500"
                  />
                  <span className="capitalize">{type.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Gender Section */}
        <div className="mb-4">
          <div 
            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
            onClick={() => toggleSection('gender')}
          >
            <span className="font-medium">Gender (Male + 2 More)</span>
            {expandedSections.gender ? <IoRemove /> : <IoAdd />}
          </div>
          {expandedSections.gender && (
            <div className="mt-2 p-3">
              {['male', 'female', 'genderless'].map(gender => (
                <label key={gender} className="flex items-center space-x-2 p-2">
                  <input
                    type="checkbox"
                    checked={selectedGenders.includes(gender)}
                    onChange={() => {
                      setSelectedGenders(prev =>
                        prev.includes(gender)
                          ? prev.filter(g => g !== gender)
                          : [...prev, gender]
                      );
                    }}
                    className="rounded text-blue-500"
                  />
                  <span className="capitalize">{gender}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="mb-4">
          <div 
            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
            onClick={() => toggleSection('stats')}
          >
            <span className="font-medium">Stats</span>
            {expandedSections.stats ? <IoRemove /> : <IoAdd />}
          </div>
          {expandedSections.stats && (
            <div className="mt-2 p-3">
              {Object.entries(stats).map(([stat, value]) => (
                <div key={stat} className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="capitalize">{stat.replace('-', ' ')}</span>
                    <span>{value}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="210"
                    value={value}
                    onChange={(e) => setStats(prev => ({
                      ...prev,
                      [stat]: parseInt(e.target.value)
                    }))}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <div className="flex gap-4">
            <button
              onClick={onReset}
              className="flex-1 py-2 bg-gray-200 rounded-lg"
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              className="flex-1 py-2 bg-blue-500 text-white rounded-lg"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileFilters;