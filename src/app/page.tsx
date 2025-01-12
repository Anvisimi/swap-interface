'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

// ... existing imports ...

interface Token {
  symbol: string;
  price: number;
}

export default function Home() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [amount, setAmount] = useState<string>('');

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get('https://interview.switcheo.com/prices.json');
        const validTokens = Object.entries(response.data)
          .filter(([_, price]) => price && Number(price) > 0)
          .map(([symbol, price]) => ({
            symbol,
            price: Number(price)
          }));
        setTokens(validTokens);
      } catch (error) {
        console.error('Error fetching prices:', error);
      }
    };
    fetchPrices();
  }, []);

  const handleSwap = () => {
    if (!fromToken || !toToken || !amount) return;
    
    // Mock swap implementation
    alert(`Swapping ${amount} ${fromToken.symbol} for ${toToken.symbol}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-6">Swap Tokens</h1>
        
        {/* From Token Selection */}
        <div className="space-y-4 mb-4">
          <Listbox value={fromToken} onChange={setFromToken}>
            <div className="relative">
              <Listbox.Button className="w-full bg-white/5 rounded-lg p-4 text-left text-white">
                <span>{fromToken?.symbol || 'Select token'}</span>
                <ChevronUpDownIcon className="h-5 w-5 absolute right-4 top-4" />
              </Listbox.Button>
              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Listbox.Options className="absolute w-full mt-1 bg-white/10 backdrop-blur-lg rounded-lg py-1 max-h-60 overflow-auto">
                  {tokens.map((token) => (
                    <Listbox.Option
                      key={token.symbol}
                      value={token}
                      className={({ active }) =>
                        `${active ? 'bg-white/20' : ''} cursor-pointer select-none p-4 text-white`
                      }
                    >
                      {token.symbol}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="w-full bg-white/5 rounded-lg p-4 text-white placeholder-white/50 outline-none"
          />
        </div>

        {/* To Token Selection */}
        <div className="mb-6">
          <Listbox value={toToken} onChange={setToToken}>
            <div className="relative">
              <Listbox.Button className="w-full bg-white/5 rounded-lg p-4 text-left text-white">
                <span>{toToken?.symbol || 'Select token'}</span>
                <ChevronUpDownIcon className="h-5 w-5 absolute right-4 top-4" />
              </Listbox.Button>
              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Listbox.Options className="absolute w-full mt-1 bg-white/10 backdrop-blur-lg rounded-lg py-1 max-h-60 overflow-auto">
                  {tokens.map((token) => (
                    <Listbox.Option
                      key={token.symbol}
                      value={token}
                      className={({ active }) =>
                        `${active ? 'bg-white/20' : ''} cursor-pointer select-none p-4 text-white`
                      }
                    >
                      {token.symbol}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>

        <button
          onClick={handleSwap}
          disabled={!fromToken || !toToken || !amount}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white rounded-lg p-4 font-bold transition-colors"
        >
          Swap
        </button>

        {fromToken && toToken && amount && (
          <div className="mt-4 text-white/80 text-sm">
            Rate: 1 {fromToken.symbol} = {(toToken.price / fromToken.price).toFixed(6)} {toToken.symbol}
          </div>
        )}
      </div>
    </div>
  );
}