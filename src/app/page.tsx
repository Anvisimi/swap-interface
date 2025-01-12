'use client';
import { useState, useEffect } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

interface Token {
  symbol: string;
  price: number;
}

export default function Home() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/prices');
        console.log('Raw API response:', response.data);

        const validTokens = Object.entries(response.data)
          .filter(([symbol, price]) => {
            console.log(`Checking token ${symbol} with price ${price}`);
            return price && Number(price) > 0;
          })
          .map(([symbol, price]) => {
            console.log(`Adding token ${symbol} with price ${Number(price)}`);
            return {
              symbol,
              price: Number(price)
            };
          });

        console.log('Processed tokens:', validTokens);
        
        if (validTokens.length === 0) {
          setError('No valid tokens found after filtering');
        }
        
        setTokens(validTokens);
      } catch (error) {
        console.error('Error fetching prices:', error);
        if (axios.isAxiosError(error)) {
          if (error.response) {
            setError(`API Error: ${error.response.data}`);
          } else if (error.request) {
            setError(`Network Error: ${error.message}`);
          }
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setIsLoading(false);
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
        
        {error && (
          <div className="mb-4 p-4 bg-red-500/20 rounded-lg text-white text-sm">
            {error}
          </div>
        )}
        
        {/* From Token Selection */}
        <div className="space-y-4 mb-4">
          <Listbox value={fromToken} onChange={setFromToken}>
            <div className="relative">
              <Listbox.Button className="w-full bg-white/5 rounded-lg p-4 text-left text-white flex justify-between items-center">
                <span>{fromToken?.symbol || 'Select token'}</span>
                <ChevronUpDownIcon className="h-5 w-5" />
              </Listbox.Button>
              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Listbox.Options className="absolute z-10 w-full mt-1 bg-white/10 backdrop-blur-lg rounded-lg py-1 max-h-60 overflow-auto">
                  {isLoading ? (
                    <div className="p-4 text-white text-center">
                      <svg className="animate-spin h-5 w-5 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading tokens...
                    </div>
                  ) : tokens.length > 0 ? (
                    tokens.map((token) => (
                      <Listbox.Option
                        key={token.symbol}
                        value={token}
                        className={({ active }) =>
                          `${
                            active ? 'bg-white/20' : ''
                          } cursor-pointer select-none p-4 text-white`
                        }
                      >
                        {token.symbol}
                      </Listbox.Option>
                    ))
                  ) : (
                    <div className="p-4 text-white text-center">
                      {error ? 'Error loading tokens' : 'No tokens available'}
                    </div>
                  )}
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
              <Listbox.Button className="w-full bg-white/5 rounded-lg p-4 text-left text-white flex justify-between items-center">
                <span>{toToken?.symbol || 'Select token'}</span>
                <ChevronUpDownIcon className="h-5 w-5" />
              </Listbox.Button>
              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Listbox.Options className="absolute z-10 w-full mt-1 bg-white/10 backdrop-blur-lg rounded-lg py-1 max-h-60 overflow-auto">
                  {isLoading ? (
                    <div className="p-4 text-white text-center">
                      <svg className="animate-spin h-5 w-5 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading tokens...
                    </div>
                  ) : tokens.length > 0 ? (
                    tokens.map((token) => (
                      <Listbox.Option
                        key={token.symbol}
                        value={token}
                        className={({ active }) =>
                          `${
                            active ? 'bg-white/20' : ''
                          } cursor-pointer select-none p-4 text-white`
                        }
                      >
                        {token.symbol}
                      </Listbox.Option>
                    ))
                  ) : (
                    <div className="p-4 text-white text-center">
                      {error ? 'Error loading tokens' : 'No tokens available'}
                    </div>
                  )}
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