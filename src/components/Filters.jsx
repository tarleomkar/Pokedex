import { useState, useEffect } from "react";
import axios from "axios";
import StatRangeSlider from "./StatRangeSlider";
import { FaSearch, FaChevronDown } from "react-icons/fa";

const Filters = ({ onFiltersChange }) => {
  const [types, setTypes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [stats, setStats] = useState({
    hp: 0,
    attack: 0,
    defense: 0,
    "special-attack": 0,
    "special-defense": 0,
    speed: 0,
  });
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await axios.get("https://pokeapi.co/api/v2/type");
        setTypes(response.data.results);
      } catch (error) {
        console.error("Error fetching types:", error);
      }
    };
    fetchTypes();
  }, []);

  const handleTypeChange = (type) => {
    const updatedTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];
    setSelectedTypes(updatedTypes);
  };

  const handleGenderChange = (gender) => {
    const updatedGenders = selectedGenders.includes(gender)
      ? selectedGenders.filter((g) => g !== gender)
      : [...selectedGenders, gender];
    setSelectedGenders(updatedGenders);
  };

  const handleStatChange = (stat, value) => {
    setStats((prev) => ({ ...prev, [stat]: value }));
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    onFiltersChange({
      searchTerm: value,
      selectedTypes,
      selectedGenders,
      stats,
    });
  };

  const handleApply = () => {
    onFiltersChange({
      searchTerm,
      selectedTypes,
      selectedGenders,
      stats,
    });
  };

  const handleReset = () => {
    setSearchTerm("");
    setSelectedTypes([]);
    setSelectedGenders([]);
    setStats({
      hp: 0,
      attack: 0,
      defense: 0,
      "special-attack": 0,
      "special-defense": 0,
      speed: 0,
    });
    onFiltersChange({
      searchTerm: "",
      selectedTypes: [],
      selectedGenders: [],
      stats: {
        hp: 0,
        attack: 0,
        defense: 0,
        "special-attack": 0,
        "special-defense": 0,
        speed: 0,
      },
    });
  };

  return (
    <div className="mb-8">
      <div className="grid md:grid-cols-4 gap-6">
        {/* Search Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-slate-600">
            Search by
          </h3>
          <div className="relative">
            <input
              type="text"
              placeholder="Name or Number"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full p-2 pr-10 border rounded-lg bg-sky-100" // Added pr-10 for right padding
            />
            <FaSearch className="absolute right-3 top-3 text-gray-400" />
          </div>
        </div>

        {/* Types Dropdown */}
        <div className="relative">
          <h3 className="text-lg font-semibold mb-4 text-slate-600">Type</h3>
          <button
            onClick={() => setIsTypeOpen(!isTypeOpen)}
            className="w-full p-2 border rounded-lg flex justify-between items-center text-blue-950"
          >
            <span className="text-blue-950">
              {selectedTypes.length
                ? `${selectedTypes[0]} + ${selectedTypes.length - 1} More`
                : "Normal + 19 More"}
            </span>
            <FaChevronDown
              className={`transform transition-transform ${
                isTypeOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {isTypeOpen && (
            <div className="absolute z-10 mt-2 w-full bg-white border rounded-lg shadow-lg p-4 max-h-60 overflow-y-auto">
              {types.map((type, index) => (
                <div key={type.name}>
                  <label className="flex items-center space-x-2 p-2 hover:bg-gray-50 text-blue-950">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type.name)}
                      onChange={() => handleTypeChange(type.name)}
                      className="rounded text-blue-950 accent-blue-950"
                    />
                    <span className="capitalize">{type.name}</span>
                  </label>
                  {index !== types.length - 1 && (
                    <hr className="border-blue-950" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Gender Dropdown */}
        <div className="relative">
          <h3 className="text-lg font-semibold mb-4 text-slate-600">Gender</h3>
          <button
            onClick={() => setIsGenderOpen(!isGenderOpen)}
            className="w-full p-2 border rounded-lg flex justify-between items-center"
          >
            <span>
              {selectedGenders.length
                ? `${selectedGenders[0]} + ${selectedGenders.length - 1} More`
                : "Male + 2 More"}
            </span>
            <FaChevronDown
              className={`transform transition-transform ${
                isGenderOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {isGenderOpen && (
            <div className="absolute z-10 mt-2 w-full bg-white border rounded-lg shadow-lg p-4">
              {["male", "female", "genderless"].map((gender, index, arr) => (
                <div key={gender}>
                  <label className="flex items-center space-x-2 p-2 hover:bg-gray-50 text-blue-950">
                    <input
                      type="checkbox"
                      checked={selectedGenders.includes(gender)}
                      onChange={() => handleGenderChange(gender)}
                      className="rounded text-blue-950 accent-blue-950"
                    />
                    <span className="capitalize">{gender}</span>
                  </label>
                  {index !== arr.length - 1 && (
                    <hr className="border-blue-950" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats Dropdown */}
        <div className="relative">
          <h3 className="text-lg font-semibold mb-4 text-slate-600">Stats</h3>
          <button
            onClick={() => setIsStatsOpen(!isStatsOpen)}
            className="w-full p-2 border rounded-lg flex justify-between items-center"
          >
            <span>HP + 5 More</span>
            <FaChevronDown
              className={`transform transition-transform ${
                isStatsOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {isStatsOpen && (
            <div className="absolute z-10 mt-2 w-full bg-white border rounded-lg shadow-lg p-4">
              {Object.entries(stats).map(([stat, value]) => (
                <StatRangeSlider
                  key={stat}
                  stat={stat}
                  value={value}
                  onChange={handleStatChange}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 mt-6">
        <button
          onClick={handleReset}
          className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Reset
        </button>
        <button
          onClick={handleApply}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default Filters;
