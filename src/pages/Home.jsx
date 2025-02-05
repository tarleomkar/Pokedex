import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoFilter } from 'react-icons/io5';
import PokemonCard from '../components/PokemonCard';
import PokemonModal from '../components/PokemonModal';
import Filters from '../components/Filters';
import MobileFilters from '../components/MobileFilters';

const Home = () => {
  const [pokemons, setPokemons] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Pokemon
        const pokemonResponse = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
        const pokemonResults = pokemonResponse.data.results;
        
        const pokemonData = await Promise.all(
          pokemonResults.map(async (pokemon) => {
            const res = await axios.get(pokemon.url);
            return res.data;
          })
        );
        
        // Fetch Types
        const typesResponse = await axios.get('https://pokeapi.co/api/v2/type');
        
        setPokemons(pokemonData);
        setFilteredPokemons(pokemonData);
        setTypes(typesResponse.data.results);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFiltersChange = (filters) => {
    let filtered = [...pokemons];

    if (filters.searchTerm) {
      filtered = filtered.filter(pokemon => 
        pokemon.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        pokemon.id.toString().includes(filters.searchTerm)
      );
    }

    if (filters.selectedTypes.length > 0) {
      filtered = filtered.filter(pokemon =>
        pokemon.types.some(type => filters.selectedTypes.includes(type.type.name))
      );
    }

    if (filters.selectedGenders.length > 0) {
      // Implement gender filtering logic here
    }

    if (filters.stats) {
      filtered = filtered.filter(pokemon =>
        pokemon.stats.every(stat => {
          const statName = stat.stat.name;
          return stat.base_stat >= (filters.stats[statName] || 0);
        })
      );
    }

    setFilteredPokemons(filtered);
  };

  const handlePokemonNavigation = (direction) => {
    const currentIndex = pokemons.findIndex(p => p.id === selectedPokemon.id);
    const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex >= 0 && newIndex < pokemons.length) {
      setSelectedPokemon(pokemons[newIndex]);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading Pokémon...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 py-8">
      <header className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <h1 className="text-3xl font-bold text-blue-950">Pokédex</h1>
          <img src="https://res.cloudinary.com/draodxztu/image/upload/v1738316989/seperator_pzauqv.png" 
            alt="Separator" className="hidden md:block mx-4 text-slate-600" />
          <hr className="w-full md:hidden border-gray-900" />
          <p className="text-slate-600">Search for any Pokémon that exists on the planet</p>
        </div>
      </header>

      {/* Mobile Search and Filter */}
      <div className="md:hidden mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search by name or number"
            className="flex-1 p-2 border rounded-lg"
            onChange={(e) => handleFiltersChange({ searchTerm: e.target.value })}
          />
          <button
            onClick={() => setShowMobileFilters(true)}
            className="p-2 bg-blue-500 text-white rounded-lg"
          >
            <IoFilter className="text-xl" />
          </button>
        </div>
      </div>

      {/* Desktop Filters */}
      <div className="hidden md:block">
        <Filters onFiltersChange={handleFiltersChange} />
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <MobileFilters
          types={types}
          onClose={() => setShowMobileFilters(false)}
          onApply={handleFiltersChange}
          onReset={() => handleFiltersChange({})}
        />
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {filteredPokemons.map((pokemon) => (
          <div key={pokemon.id} onClick={() => setSelectedPokemon(pokemon)}>
            <PokemonCard pokemon={pokemon} />
          </div>
        ))}
      </div>

      {selectedPokemon && (
        <PokemonModal 
          pokemon={selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
          onNavigate={handlePokemonNavigation}
          prevPokemon={pokemons[pokemons.findIndex(p => p.id === selectedPokemon.id) - 1]}
          nextPokemon={pokemons[pokemons.findIndex(p => p.id === selectedPokemon.id) + 1]}
        />
      )}

      {filteredPokemons.length === 0 && (
        <div className="text-center py-8">
          <p className="text-lg text-gray-600">No Pokémon found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default Home;