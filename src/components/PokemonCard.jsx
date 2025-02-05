const typeColors = {
  normal: 'bg-gray-400',
  fire: 'bg-red-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400',
  grass: 'bg-green-500',
  ice: 'bg-blue-200',
  fighting: 'bg-red-600',
  poison: 'bg-purple-500',
  ground: 'bg-yellow-600',
  flying: 'bg-indigo-400',
  psychic: 'bg-pink-500',
  bug: 'bg-green-400',
  rock: 'bg-yellow-800',
  ghost: 'bg-purple-600',
  dragon: 'bg-indigo-600',
  dark: 'bg-gray-800',
  steel: 'bg-gray-500',
  fairy: 'bg-pink-400'
};

const PokemonCard = ({ pokemon }) => {
  const mainType = pokemon.types[0]?.type.name || 'normal';
  const bgColor = typeColors[mainType] || 'bg-gray-400';

  return (
    <div className="transform hover:scale-105 transition-transform duration-200 cursor-pointer">
      <div className={`rounded-lg shadow-lg overflow-hidden ${bgColor} bg-opacity-20 border-2 border-gray-500 border-dashed`}>
        <div className="p-4">
          <div className="relative pb-[100%]">
            <img 
              src={pokemon.sprites.other['official-artwork'].front_default} 
              alt={pokemon.name}
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>
          <div className="mt-4 text-center">
            <h2 className="text-xl font-bold capitalize mt-1">{pokemon.name}</h2>
            <p className="text-gray-600 text-sm">{String(pokemon.id).padStart(3, '0')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
