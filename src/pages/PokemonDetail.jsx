import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PokemonDetail = () => {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [evolutionChain, setEvolutionChain] = useState(null);
  const [speciesInfo, setSpeciesInfo] = useState(null);
  const [typeWeaknesses, setTypeWeaknesses] = useState({});
  const [weaknesses, setWeaknesses] = useState([]);
  const [genders, setGenders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTypeWeaknesses = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/type');
        const types = response.data.results;
        
        const typeDetails = await Promise.all(
          types.map(type => axios.get(type.url))
        );
        
        const weaknessMap = {};
        typeDetails.forEach(detail => {
          const typeName = detail.data.name;
          const damageRelations = detail.data.damage_relations;
          weaknessMap[typeName] = damageRelations.double_damage_from.map(t => t.name);
        });
        
        setTypeWeaknesses(weaknessMap);
      } catch (error) {
        console.error('Error fetching type weaknesses:', error);
      }
    };

    fetchTypeWeaknesses();
  }, []);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        // Fetch basic pokemon data
        const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const pokemonData = pokemonResponse.data;

        // Fetch species data
        const speciesResponse = await axios.get(pokemonData.species.url);
        const speciesData = speciesResponse.data;
        
        // Fetch evolution chain
        const evolutionResponse = await axios.get(speciesData.evolution_chain.url);

        // Fetch gender data
        const genderResponse = await axios.get('https://pokeapi.co/api/v2/gender');
        const genderData = genderResponse.data.results;
        
        // Check which genders are available for this Pokemon
        const genderChecks = await Promise.all(
          genderData.map(async gender => {
            const genderDetails = await axios.get(gender.url);
            const hasGender = genderDetails.data.pokemon_species_details.some(
              species => species.pokemon_species.name === pokemonData.species.name
            );
            return hasGender ? gender.name : null;
          })
        );
        
        const availableGenders = genderChecks.filter(gender => gender !== null);
        setGenders(availableGenders.length > 0 ? availableGenders : ['genderless']);
        
        // Calculate weaknesses
        const pokemonWeaknesses = new Set();
        pokemonData.types.forEach(({ type }) => {
          if (typeWeaknesses[type.name]) {
            typeWeaknesses[type.name].forEach(weakness => pokemonWeaknesses.add(weakness));
          }
        });

        setPokemon(pokemonData);
        setSpeciesInfo(speciesData);
        setEvolutionChain(evolutionResponse.data.chain);
        setWeaknesses(Array.from(pokemonWeaknesses));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching pokemon details:', error);
        setLoading(false);
      }
    };

    if (Object.keys(typeWeaknesses).length > 0) {
      fetchPokemonDetails();
    }
  }, [id, typeWeaknesses]);

  const getDescription = () => {
    if (!speciesInfo?.flavor_text_entries) return [];
    return speciesInfo.flavor_text_entries
      .filter(entry => entry.language.name === 'en')
      .slice(0, 8)
      .map(entry => entry.flavor_text.replace(/\f/g, ' '));
  };

  if (loading || !pokemon || !speciesInfo) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  const descriptions = getDescription();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="rounded-lg p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <img 
              src={pokemon.sprites.other['official-artwork'].front_default}
              alt={pokemon.name}
              className="w-full max-w-md mx-auto"
            />
            <div className="mt-6 text-left">
              <h3 className="font-semibold mb-3">Pokédex Entries:</h3>
              {descriptions.map((desc, index) => (
                <p key={index} className="text-gray-600 mb-2 italic">
                  {desc}
                </p>
              ))}
            </div>
          </div>
          
          <div>
            <h1 className="text-4xl font-bold capitalize mb-4">{pokemon.name}</h1>
            <p className="text-gray-600 mb-4">#{String(pokemon.id).padStart(3, '0')}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="font-semibold">Height</h3>
                <p>{pokemon.height / 10}m</p>
              </div>
              <div>
                <h3 className="font-semibold">Weight</h3>
                <p>{pokemon.weight / 10}kg</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Gender</h3>
              <div className="flex gap-2">
                {genders.map((gender, index) => (
                  <span 
                    key={index}
                    className={`px-4 py-1 rounded-full ${
                      gender === 'female' ? 'bg-pink-500' :
                      gender === 'male' ? 'bg-blue-500' :
                      'bg-gray-500'
                    } text-white capitalize`}
                  >
                    {gender}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Types</h3>
              <div className="flex gap-2">
                {pokemon.types.map((type, index) => (
                  <span 
                    key={index}
                    className="px-4 py-1 rounded-full text-white bg-blue-500"
                  >
                    {type.type.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Weak Against</h3>
              <div className="flex flex-wrap gap-2">
                {weaknesses.map((weakness, index) => (
                  <span 
                    key={index}
                    className="px-4 py-1 rounded-full text-white bg-red-500"
                  >
                    {weakness}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Egg Groups</h3>
              <div className="flex flex-wrap gap-2">
                {speciesInfo.egg_groups.map((group, index) => (
                  <span 
                    key={index}
                    className="px-4 py-1 rounded-full bg-green-100 text-green-800"
                  >
                    {group.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Abilities</h3>
              <div className="flex flex-wrap gap-2">
                {pokemon.abilities.map((ability, index) => (
                  <span 
                    key={index}
                    className="px-4 py-1 rounded-full bg-gray-200"
                  >
                    {ability.ability.name}
                    {ability.is_hidden && <span className="ml-1 text-gray-500">(Hidden)</span>}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Stats</h3>
              {pokemon.stats.map((stat, index) => (
                <div key={index} className="mb-2">
                  <div className="flex justify-between mb-1">
                    <span className="capitalize">{stat.stat.name}</span>
                    <span>{stat.base_stat}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 rounded-full h-2"
                      style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;