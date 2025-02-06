import React, { useState, useEffect } from "react";
import { IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5";

const typeColors = {
  normal: "bg-[#DDCBD0]",
  fire: "bg-[#EDC2C4]",
  water: "bg-[#CBD5ED]",
  electric: "bg-[#E2E2A0]",
  grass: "bg-[#C0D4C8]",
  ice: "bg-[#C7D7DF]",
  fighting: "bg-[#FCC1B0]",
  poison: "bg-[#CFB7ED]",
  ground: "bg-[#F4D1A6]",
  flying: "bg-[#B2D2E8]",
  psychic: "bg-[#DDC0CF]",
  bug: "bg-[#C1E0C8]",
  rock: "bg-[#C5AEA8]",
  ghost: "bg-[#D7C2D7]",
  dragon: "bg-[#CADCDF]",
  dark: "bg-[#C6C5E3]",
  steel: "bg-[#C2D4CE]",
  fairy: "bg-[#E4C0CF]",
};

const PokemonModal = ({
  pokemon,
  onClose,
  onNavigate,
  prevPokemon,
  nextPokemon,
}) => {
  const [showFullDescription, setShowFullDescription] = useState(true);
  const [description, setDescription] = useState("");
  const [evolutionChain, setEvolutionChain] = useState([]);
  const [weaknesses, setWeaknesses] = useState([]);
  const [genders, setGenders] = useState([]);
  const [eggGroups, setEggGroups] = useState([]);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        // Fetch species data for description and egg groups
        const speciesResponse = await fetch(pokemon.species.url);
        const speciesData = await speciesResponse.json();

        // Get English description
        const englishDescriptions = speciesData.flavor_text_entries
          .filter((entry) => entry.language.name === "en")
          .slice(0, 8)
          .map((entry) => entry.flavor_text.replace(/\f/g, " "));

        setDescription(englishDescriptions.join("\n"));
        setEggGroups(speciesData.egg_groups);

        // Fetch evolution chain
        const evolutionResponse = await fetch(speciesData.evolution_chain.url);
        const evolutionData = await evolutionResponse.json();

        // Process evolution chain
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
              image:
                pokemonData.sprites.other["official-artwork"].front_default,
            });

            current = current.evolves_to[0];
          }

          return evolutions;
        };

        const evolutionChainData = await processEvolutionChain(
          evolutionData.chain
        );
        setEvolutionChain(evolutionChainData);

        // Fetch type weaknesses
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

  return (
    <div className="fixed inset-0 bg-[#2E3156E5] blur-none bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="relative bg-[#deeded] rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header with Name, ID, and Navigation */}
        {/* <div className="relative top-0 z-10 p-4 flex justify-end items-center">
           <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold capitalize">{pokemon.name}</h2>
            <div className="flex items-center gap-2">
              <p className="text-xl text-gray-600">
                {String(pokemon.id).padStart(3, "0")}
              </p>
              <button onClick={() => onNavigate("prev")} className="text-2xl">
                <IoChevronBack />
              </button>
              <button onClick={onClose} className="text-2xl">
                <IoClose />
              </button>
              <button onClick={() => onNavigate("next")} className="text-2xl">
                <IoChevronForward />
              </button>
            </div>
          </div> 
        </div> */}

        <div className="p-6 space-y-8">
          {/* Image and Description Section */}
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3 mt-5">
              {" "}
              {/* Adjust mt-4 as needed */}
              <img
                src={pokemon.sprites.other["official-artwork"].front_default}
                alt={pokemon.name}
                className="w-auto min-w-[150px] min-h-[150px] rounded-lg overflow-hidden bg-opacity-20 border-2 border-gray-500 hover:scale-105 transition-all duration-300 transform cursor-pointer border-dashed"
              />
            </div>

            <div className="md:w-2/3">
              <div className="flex items-end gap-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold capitalize text-blue-950">
                    {pokemon.name.toUpperCase()}
                  </h2>
                  <img
                    src="https://res.cloudinary.com/draodxztu/image/upload/v1738316989/seperator_pzauqv.png"
                    alt="Separator"
                    className="hidden md:block mx-4 text-slate-600 "
                  />
                  <p className="text-xl text-blue-950">
                    {String(pokemon.id).padStart(3, "0")}
                  </p>
                  <img
                    src="https://res.cloudinary.com/draodxztu/image/upload/v1738316989/seperator_pzauqv.png"
                    alt="Separator"
                    className="hidden md:block mx-4 text-slate-600"
                  />
                  <button
                    onClick={() => onNavigate("prev")}
                    className="text-2xl"
                  >
                    <IoChevronBack />
                  </button>
                  <button onClick={onClose} className="text-2xl">
                    <IoClose />
                  </button>
                  <button
                    onClick={() => onNavigate("next")}
                    className="text-2xl"
                  >
                    <IoChevronForward />
                  </button>
                </div>
              </div>

              <p className="text-blue-950">
                {showFullDescription
                  ? description
                  : description?.split("\n")[0]}
                {description?.split("\n").length > 1 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-blue-950 hover:text-blue-950 ml-2 font-bold underline"
                  >
                    {showFullDescription ? "Show less" : "Read more"}
                  </button>
                )}
              </p>
            </div>
          </div>

          {/* Basic Info Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 flex-wrap">
            <div>
              <h3 className="font-semibold mb-2">Abilities</h3>
              <p className="flex flex-wrap gap-2">
                {pokemon.abilities
                  .map((ability) => ability.ability.name)
                  .join(", ")}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Types</h3>
              <div className="flex flex-row gap-1">
                {pokemon.types.map((type) => (
                  <span
                    key={type.type.name}
                    className={`px-3 py-1 rounded-xl border-2 border-blue-950 text-blue-950 ${
                      typeColors[type.type.name]
                    }`}
                  >
                    {type.type.name}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Weak Against</h3>
              <div className="flex flex-row gap-1">
                {weaknesses.map((weakness) => (
                  <span
                    key={weakness}
                    className={`px-3 py-1 rounded-xl border-2 border-blue-950 text-blue-950  ${typeColors[weakness]}`}
                  >
                    {weakness}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-[#B0D2D2] p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-left text-blue-950">
              Stats
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pokemon.stats.map((stat) => (
                <div
                  key={stat.stat.name}
                  className="flex items-center space-x-3"
                >
                  <span className="font-medium capitalize w-24 text-blue-950">
                    {stat.stat.name}
                  </span>
                  <div className="relative w-full bg-neutral-400 rounded-none h-5 flex items-center">
                    <div
                      className="bg-blue-950 h-5 rounded-none flex items-center px-2 text-white text-xs font-bold"
                      style={{
                        width: `${(stat.base_stat / 255) * 100}%`,
                        minWidth: "32px",
                      }}
                    >
                      {stat.base_stat}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Evolution Chain */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-blue-950">
              Evolution Chain
            </h3>
            <div className="flex flex-wrap justify-start items-center gap-4">
              {evolutionChain.map((evolution, index) => (
                <React.Fragment key={evolution.id}>
                  <div className="rounded-lg shadow-lg overflow-hidden bg-opacity-20 border-2 p-4 border-gray-500 hover:scale-105 transition-all duration-300 transform cursor-pointer border-dashed">
                    <img
                      src={evolution.image}
                      alt={evolution.name}
                      className="w-24 h-24 mx-auto mb-2"
                    />
                    <p className="font-bold capitalize text-center text-blue-950">
                      {evolution.name}
                    </p>
                    <p className="text-center text-blue-950">
                      {String(evolution.id).padStart(3, "0")}
                    </p>
                  </div>
                  {index < evolutionChain.length - 1 && (
                    <IoChevronForward className="text-2xl text-blue-950" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden scroll bottom-3 left-3 right-3 bg-[#deeded] p-4">
          <div className="flex justify-between items-center">
            {prevPokemon && (
              <button
                onClick={() => onNavigate("prev")}
                className="flex items-center justify-center gap-2 px-4 py-2 text-white rounded-r-lg rounded-l-lg bg-[#2C2C54]"
              >
                <IoChevronBack />
                <span className="capitalize">{prevPokemon.name}</span>
              </button>
            )}
            {nextPokemon && (
              <button
              onClick={() => onNavigate("next")}
              className="flex items-center justify-center gap-2 px-4 py-2 text-white rounded-r-lg rounded-l-lg bg-[#2C2C54]"
            >
              <span className="capitalize">{nextPokemon.name}</span>
              <IoChevronForward />
            </button>            
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonModal;
