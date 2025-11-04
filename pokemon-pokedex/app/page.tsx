'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';

interface Pokemon {
  id: number;
  name: string;
  types: string[];
  sprite: string;
  height: number;
  weight: number;
}

export default function Home() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await response.json();

        const pokemonDetails = await Promise.all(
          data.results.map(async (p: { url: string }) => {
            const res = await fetch(p.url);
            const detail = await res.json();
            return {
              id: detail.id,
              name: detail.name,
              types: detail.types.map((t: any) => t.type.name),
              sprite: detail.sprites.other['official-artwork'].front_default || detail.sprites.front_default,
              height: detail.height,
              weight: detail.weight,
            };
          })
        );

        setPokemon(pokemonDetails);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Pokemon:', error);
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  const filteredPokemon = useMemo(() => {
    if (!search) return pokemon;
    const query = search.toLowerCase();
    return pokemon.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.id.toString().includes(query) ||
        p.types.some((type) => type.toLowerCase().includes(query))
    );
  }, [search, pokemon]);

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      normal: 'bg-gray-400',
      fire: 'bg-red-500',
      water: 'bg-blue-500',
      electric: 'bg-yellow-400',
      grass: 'bg-green-500',
      ice: 'bg-blue-200',
      fighting: 'bg-red-700',
      poison: 'bg-purple-500',
      ground: 'bg-yellow-600',
      flying: 'bg-indigo-400',
      psychic: 'bg-pink-500',
      bug: 'bg-green-400',
      rock: 'bg-yellow-800',
      ghost: 'bg-purple-700',
      dragon: 'bg-indigo-700',
      dark: 'bg-gray-800',
      steel: 'bg-gray-500',
      fairy: 'bg-pink-300',
    };
    return colors[type] || 'bg-gray-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-yellow-400 to-blue-500 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <h1 className="text-6xl font-bold text-white drop-shadow-lg mb-4">
            Pokédex
          </h1>
          <p className="text-white text-xl drop-shadow-md">
            Search and discover Pokémon
          </p>
        </div>

        <div className="mb-8 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search by name, number, or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-6 py-4 text-lg rounded-full border-4 border-white shadow-xl focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all"
          />
          {search && (
            <p className="text-white text-center mt-3 font-semibold drop-shadow-md">
              Found {filteredPokemon.length} Pokémon
            </p>
          )}
        </div>

        {loading ? (
          <div className="text-center text-white text-2xl font-bold">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
            <p className="mt-4">Loading Pokémon...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredPokemon.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedPokemon(p)}
                className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all cursor-pointer overflow-hidden"
              >
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-4 flex items-center justify-center h-48 relative">
                  <div className="absolute top-2 left-2 bg-white rounded-full px-3 py-1 font-bold text-gray-700">
                    #{p.id.toString().padStart(3, '0')}
                  </div>
                  <Image
                    src={p.sprite}
                    alt={p.name}
                    width={150}
                    height={150}
                    className="object-contain"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-bold text-gray-800 capitalize mb-2">
                    {p.name}
                  </h2>
                  <div className="flex gap-2 flex-wrap">
                    {p.types.map((type) => (
                      <span
                        key={type}
                        className={`${getTypeColor(type)} text-white px-3 py-1 rounded-full text-sm font-semibold capitalize`}
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredPokemon.length === 0 && (
          <div className="text-center text-white text-2xl font-bold">
            No Pokémon found matching &quot;{search}&quot;
          </div>
        )}

        {selectedPokemon && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedPokemon(null)}
          >
            <div
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPokemon(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl font-bold"
              >
                ×
              </button>
              <div className="text-center">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 mb-4">
                  <Image
                    src={selectedPokemon.sprite}
                    alt={selectedPokemon.name}
                    width={200}
                    height={200}
                    className="mx-auto"
                  />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 capitalize mb-2">
                  {selectedPokemon.name}
                </h2>
                <p className="text-gray-600 font-semibold mb-4">
                  #{selectedPokemon.id.toString().padStart(3, '0')}
                </p>
                <div className="flex gap-2 justify-center mb-6">
                  {selectedPokemon.types.map((type) => (
                    <span
                      key={type}
                      className={`${getTypeColor(type)} text-white px-4 py-2 rounded-full font-semibold capitalize`}
                    >
                      {type}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div className="bg-gray-100 rounded-lg p-4">
                    <p className="text-gray-600 text-sm">Height</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {selectedPokemon.height / 10}m
                    </p>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4">
                    <p className="text-gray-600 text-sm">Weight</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {selectedPokemon.weight / 10}kg
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
