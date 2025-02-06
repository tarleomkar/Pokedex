const typeColors = {
  normal: "#DDCBD0",
  fire: "#EDC2C4",
  water: "#CBD5ED",
  electric: "#E2E2A0",
  grass: "#C0D4C8",
  ice: "#C7D7DF",
  fighting: "#FCC1B0",
  poison: "#CFB7ED",
  ground: "#F4D1A6",
  flying: "#B2D2E8",
  psychic: "#DDC0CF",
  bug: "#C1E0C8",
  rock: "#C5AEA8",
  ghost: "#D7C2D7",
  dragon: "#CADCDF",
  dark: "#C6C5E3",
  steel: "#C2D4CE",
  fairy: "#E4C0CF",
};

const PokemonCard = ({ pokemon }) => {
  // Get the types of the Pokémon
  const types = pokemon.types.map((type) => type.type.name);
  const firstType = types[0] || 'normal';
  const secondType = types[1] || firstType; // If only one type, use the same color for both

  // Get the colors for the gradient
  const firstColor = typeColors[firstType] || '#DDCBD0'; // Default to normal if type not found
  const secondColor = typeColors[secondType] || '#DDCBD0'; // Default to normal if type not found

  // Set the background gradient
  const bgGradient = `linear-gradient(to bottom, ${firstColor}, ${secondColor})`;

  return (
    <div className="transform hover:scale-105 transition-transform duration-200 cursor-pointer">
      <div 
        className="rounded-lg shadow-lg overflow-hidden border-2 border-gray-500 border-dashed"
        style={{ background: bgGradient }}
      >
        <div className="p-4">
          <div className="relative pb-[100%]">
            <img 
              src={pokemon.sprites.other['official-artwork'].front_default} 
              alt={pokemon.name}
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>
          <div className="mt-4 text-center">
            <h2 className="text-xl font-medium capitalize mt-1 text-blue-950">{pokemon.name}</h2>
            <p className="text-blue-950 text-sm">{String(pokemon.id).padStart(3, '0')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;