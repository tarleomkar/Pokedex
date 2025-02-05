import React, { useState, useEffect } from "react";
import { IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5";

const typeColors = {
  normal: "bg-gray-400",
  fire: "bg-red-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400",
  grass: "bg-green-500",
  ice: "bg-blue-200",
  fighting: "bg-red-600",
  poison: "bg-purple-500",
  ground: "bg-yellow-600",
  flying: "bg-indigo-400",
  psychic: "bg-pink-500",
  bug: "bg-green-400",
  rock: "bg-yellow-800",
  ghost: "bg-purple-600",
  dragon: "bg-indigo-600",
  dark: "bg-gray-800",
  steel: "bg-gray-500",
  fairy: "bg-pink-400",
};

const PokemonModal = ({ pokemon, onClose, onNavigate, prevPokemon, nextPokemon }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [description, setDescription] = useState("");
  const [evolutionChain, setEvolutionChain] = useState([]);
  const [weaknesses, setWeaknesses] = useState([]);
  const [genders, setGenders] = useState([]);
  const [eggGroups, setEggGroups] = useState([]);
  const [showPopUp, setShowPopUp] = useState(false); // To control the pop-up visibility

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        const speciesResponse = await fetch(pokemon.species.url);
        const speciesData = await speciesResponse.json();

        const englishDescriptions = speciesData.flavor_text_entries
          .filter((entry) => entry.language.name === "en")
          .slice(0, 8)
          .map((entry) => entry.flavor_text.replace(/\f/g, " "));

        setDescription(englishDescriptions.join("\n"));
        setEggGroups(speciesData.egg_groups);

        const evolutionResponse = await fetch(speciesData.evolution_chain.url);
        const evolutionData = await evolutionResponse.json();

        const processEvolutionChain = async (chain) => {
          const evolutions = [];
          let current = chain;

          while (current) {
            const pokemonResponse = await fetch(
              `https://pokeapi.co/api/v2/pokemon/${current.species.name}`
            );
            const pokemonData = await pokemonResponse.json();

            evolutions.push({
              name: current.species.name,
              id: pokemonData.id,
              image: pokemonData.sprites.other["official-artwork"].front_default,
            });

            current = current.evolves_to[0];
          }

          return evolutions;
        };

        const evolutionChainData = await processEvolutionChain(evolutionData.chain);
        setEvolutionChain(evolutionChainData);

        const typePromises = pokemon.types.map((type) =>
          fetch(type.type.url).then((res) => res.json())
        );

        const typeData = await Promise.all(typePromises);
        const weaknessSet = new Set();

        typeData.forEach((type) => {
          type.damage_relations.double_damage_from.forEach((weakness) => {
            weaknessSet.add(weakness.name);
          });
        });

        setWeaknesses(Array.from(weaknessSet));
      } catch (error) {
        console.error("Error fetching pokemon details:", error);
      }
    };

    fetchPokemonDetails();
  }, [pokemon]);

  const handleReadMoreClick = () => {
    setShowPopUp(true); // Show the pop-up when the "Read more" button is clicked
  };

  const handleClosePopUp = () => {
    setShowPopUp(false); // Close the pop-up
  };

  return (
    <div className="fixed inset-0 bg-[#2E3156E5] blur-none bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="relative bg-[#deeded] rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header with Name, ID, and Navigation */}
        <div className="relative top-0 z-10 p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold capitalize">{pokemon.name}</h2>
            <div className="flex items-center gap-2">
              <p className="text-xl text-gray-600">
                {String(pokemon.id).padStart(3, "0")}
              </p>
              <button onClick={() => onNavigate("prev")} className="text-2xl">
                <IoChevronBack />
              </button>
              <button onClick={() => onNavigate("next")} className="text-2xl">
                <IoChevronForward />
              </button>
            </div>
          </div>
          <button onClick={onClose} className="text-2xl">
            <IoClose />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Image and Description Section */}
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <img
                src={pokemon.sprites.other["official-artwork"].front_default}
                alt={pokemon.name}
                className="w-full rounded-lg overflow-hidden bg-opacity-20 border-2 border-gray-500 hover:scale-105 transition-all duration-300 transform cursor-pointer border-dashed"
              />
            </div>

            <div className="md:w-2/3">
              <p className="text-blue-950">
                {showFullDescription
                  ? description
                  : description?.split("\n")[0]}
                {description?.split("\n").length > 1 && (
                  <button
                    onClick={handleReadMoreClick}
                    className="text-blue-950 hover:text-blue-950 ml-2 font-bold"
                  >
                    {showFullDescription ? "Show less" : "Read more"}
                  </button>
                )}
              </p>
            </div>
          </div>

          {/* Basic Info Section */}
          <div className="grid grid-cols-4 gap-4 p-4">
            <div>
              <h3 className="font-semibold text-gray-600">Height</h3>
              <p>{(pokemon.height * 0.328084).toFixed(1)}"</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-600">Weight</h3>
              <p>{(pokemon.weight / 10).toFixed(1)}kg</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-600">Gender(s)</h3>
              <p className="capitalize">
                {genders
                  .map((gender) =>
                    gender === "male" ? "M" : gender === "female" ? "F" : gender
                  )
                  .join(", ")}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-600">Egg Groups</h3>
              <p className="capitalize">
                {eggGroups.map((group) => group.name).join(", ")}
              </p>
            </div>
          </div>

          {/* Abilities, Types, and Weaknesses Section */}
          <div className="grid grid-cols-3 gap-4 p-4">
            <div>
              <h3 className="font-semibold mb-2">Abilities</h3>
              <p className="flex flex-wrap gap-2">
                {pokemon.abilities.map((ability) => ability.ability.name).join(", ")}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Types</h3>
              <div className="flex flex-wrap gap-2">
                {pokemon.types.map((type) => (
                  <span
                    key={type.type.name}
                    className={`px-3 py-1 rounded-full text-white ${typeColors[type.type.name]}`}
                  >
                    {type.type.name}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Weak Against</h3>
              <div className="flex flex-wrap gap-2">
                {weaknesses.map((weakness) => (
                  <span
                    key={weakness}
                    className={`px-3 py-1 rounded-full text-white ${typeColors[weakness]}`}
                  >
                    {weakness}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-[#B0D2D2] p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-left text-blue-950">Stats</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pokemon.stats.map((stat) => (
                <div key={stat.stat.name} className="flex items-center space-x-3">
                  <span className="font-medium capitalize w-24 text-blue-950">
                    {stat.stat.name}
                  </span>
                  <div className="relative w-full bg-neutral-400 h-3 rounded-full">
                    <div
                      className="absolute h-full bg-blue-600 rounded-full"
                      style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                    />
                  </div>
                  <span className="w-10 text-blue-950 text-sm">{stat.base_stat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Evolution Section */}
          <div>
            <h3 className="font-semibold text-gray-600">Evolution</h3>
            <div className="flex gap-4 overflow-x-auto">
              {evolutionChain.map((evolution) => (
                <div key={evolution.id} className="flex flex-col items-center">
                  <img
                    src={evolution.image}
                    alt={evolution.name}
                    className="w-20 h-20 object-contain"
                  />
                  <p className="text-sm capitalize">{evolution.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pop-up box for Full Description */}
      {showPopUp && (
        <div className="fixed inset-0 bg-opacity-50 bg-gray-600 flex justify-center items-center z-50">
          <div className="bg-[#B0D2D2] p-8 rounded-lg w-11/12 md:w-1/2">
            <h2 className="font-semibold text-blue-950 text-xl">Full Description</h2>
            <pre className="text-white mt-4 whitespace-pre-wrap">{description}</pre>
            <button
              onClick={handleClosePopUp}
              className="mt-4 bg-red-600 text-white py-2 px-4 rounded-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonModal;
