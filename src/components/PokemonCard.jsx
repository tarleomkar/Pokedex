const typeColors = {
  normal: "bg-gradient-to-b from-[#DDCBD0] to-[#E0D4D1]",
  fire: "bg-gradient-to-b from-[#EDC2C4] to-[#F1D1D3]",
  water: "bg-gradient-to-b from-[#CBD5ED] to-[#B2C9E1]",
  electric: "bg-gradient-to-b from-[#E2E2A0] to-[#F0E3A1]",
  grass: "bg-gradient-to-b from-[#C0D4C8] to-[#A8C5B6]",
  ice: "bg-gradient-to-b from-[#C7D7DF] to-[#A5B8C4]",
  fighting: "bg-gradient-to-b from-[#FCC1B0] to-[#F7C9B3]",
  poison: "bg-gradient-to-b from-[#CFB7ED] to-[#D2A7E6]",
  ground: "bg-gradient-to-b from-[#F4D1A6] to-[#F7D79B]",
  flying: "bg-gradient-to-b from-[#B2D2E8] to-[#A0C2D9]",
  psychic: "bg-gradient-to-b from-[#DDC0CF] to-[#E1B3C4]",
  bug: "bg-gradient-to-b from-[#C1E0C8] to-[#A6D0B7]",
  rock: "bg-gradient-to-b from-[#C5AEA8] to-[#BDA49D]",
  ghost: "bg-gradient-to-b from-[#D7C2D7] to-[#D4A9D5]",
  dragon: "bg-gradient-to-b from-[#CADCDF] to-[#B1C8D3]",
  dark: "bg-gradient-to-b from-[#C6C5E3] to-[#B9B7D0]",
  steel: "bg-gradient-to-b from-[#C2D4CE] to-[#A8B8AC]",
  fairy: "bg-gradient-to-b from-[#E4C0CF] to-[#E1B5C4]",
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
