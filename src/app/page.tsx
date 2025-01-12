'use client';
import { useState, useEffect } from 'react';
import { ChevronUpDownIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

interface Token {
  symbol: string;
  price: number;
  name?: string;
  logoUrl?: string;
}

interface TokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (token: Token) => void;
}

export default function Home() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSelectingFrom, setIsSelectingFrom] = useState(false);
  const [isSelectingTo, setIsSelectingTo] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const getExchangeRate = () => {
    if (!fromToken || !toToken) return null;
    return toToken.price / fromToken.price;
  };

  const getToAmount = () => {
    const rate = getExchangeRate();
    if (!rate || !amount) return '';
    return (parseFloat(amount) * rate).toFixed(6);
  };

  const getUSDValue = (token: Token | null, tokenAmount: string) => {
    if (!token || !tokenAmount || isNaN(parseFloat(tokenAmount))) return '$0.00';
    const value = parseFloat(tokenAmount) * token.price;
    return `$${value.toFixed(2)}`;
  };

  const handleAmountChange = (value: string) => {
    // Only allow positive numbers or empty string
    if (value === '' || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0)) {
      setAmount(value);
      setFormError(null);
    } else {
      setFormError('Amount must be greater than zero.');
    }
  };

  useEffect(() => {
    const fetchPrices = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get('https://interview.switcheo.com/prices.json', {
          headers: {
            'Accept': 'application/json',
          }
        });
        
        if (!response.data || (typeof response.data !== 'object' && !Array.isArray(response.data))) {
          throw new Error('Invalid API response format');
        }

        const pricesArray = Array.isArray(response.data) 
          ? response.data 
          : Object.entries(response.data).map(([currency, price]) => ({
              currency,
              price
            }));

        const validTokens = pricesArray
          .filter(item => {
            const price = typeof item.price === 'string' ? parseFloat(item.price) : Number(item.price);
            return !isNaN(price) && price > 0;
          })
          .map(item => ({
            symbol: item.currency,
            price: typeof item.price === 'string' ? parseFloat(item.price) : Number(item.price),
            name: item.currency,
            logoUrl: `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${item.currency}.svg`
          }));
        
        if (validTokens.length === 0) {
          throw new Error('No valid tokens available');
        }
        
        setTokens(validTokens);
      } catch (error) {
        console.error('Error fetching prices:', error);
        setError(error instanceof Error ? error.message : 'Failed to load tokens');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrices();
  }, []);

  const handleSwap = () => {
    if (!fromToken || !toToken || !amount) {
      setFormError('Please select both tokens and enter an amount.');
      return;
    }
    if (parseFloat(amount) <= 0) {
      setFormError('Amount must be greater than zero.');
      return;
    }
    setFormError(null);
    alert(`Swapping ${amount} ${fromToken.symbol} for ${getToAmount()} ${toToken.symbol}`);
  };

  const filteredTokens = tokens.filter(token => 
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const TokenModal: React.FC<TokenModalProps> = ({ isOpen, onClose, onSelect }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-gray-900 rounded-2xl w-full max-w-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Select a token</h2>
            <button onClick={onClose} className="text-white/50 hover:text-white">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="relative mb-4">
            <input
              type="text"
              className="w-full bg-gray-800 rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/50 outline-none"
              placeholder="Search token name or paste address"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                <p className="mt-2">Loading tokens...</p>
              </div>
            ) : filteredTokens.length > 0 ? (
              <div className="space-y-2">
                {filteredTokens.map((token) => (
                  <button
                    key={token.symbol}
                    className="w-full flex items-center p-3 hover:bg-white/5 rounded-lg transition-colors"
                    onClick={() => {
                      onSelect(token);
                      onClose();
                      setSearchQuery('');
                    }}
                  >
                    <img
                      src={token.logoUrl}
                      alt={token.symbol}
                      className="w-8 h-8 mr-3"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/DEFAULT.svg';
                      }}
                    />
                    <div className="text-left">
                      <div className="text-white font-medium">{token.symbol}</div>
                      <div className="text-white/50 text-sm">{token.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center text-white/50 py-8">
                No tokens found
              </div>
            )}
          </div>
        </div>
      </div>
    );
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
        
        <div className="space-y-4">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <span className="text-white/50 text-sm">You pay</span>
              <span className="text-white/50 text-sm">{getUSDValue(fromToken, amount)}</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                min="0"
                step="any"
                placeholder="0.0"
                className="w-full bg-transparent text-2xl text-white placeholder-white/50 outline-none"
              />
              <button
                onClick={() => setIsSelectingFrom(true)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-full px-3 py-1"
              >
                {fromToken ? (
                  <>
                    <img
                      src={fromToken.logoUrl}
                      alt={fromToken.symbol}
                      className="w-6 h-6"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/DEFAULT.svg';
                      }}
                    />
                    <span className="text-white font-medium">{fromToken.symbol}</span>
                  </>
                ) : (
                  <span className="text-white/50">Select token</span>
                )}
                <ChevronUpDownIcon className="h-5 w-5 text-white/50" />
              </button>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <span className="text-white/50 text-sm">You receive</span>
              <span className="text-white/50 text-sm">{getUSDValue(toToken, getToAmount())}</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={getToAmount()}
                readOnly
                placeholder="0.0"
                className="w-full bg-transparent text-2xl text-white placeholder-white/50 outline-none"
              />
              <button
                onClick={() => setIsSelectingTo(true)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-full px-3 py-1"
              >
                {toToken ? (
                  <>
                    <img
                      src={toToken.logoUrl}
                      alt={toToken.symbol}
                      className="w-6 h-6"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/DEFAULT.svg';
                      }}
                    />
                    <span className="text-white font-medium">{toToken.symbol}</span>
                  </>
                ) : (
                  <span className="text-white/50">Select token</span>
                )}
                <ChevronUpDownIcon className="h-5 w-5 text-white/50" />
              </button>
            </div>
          </div>
        </div>

        {formError && (
          <div className="mt-4 p-4 bg-red-500/20 rounded-lg text-white text-sm">
            {formError}
          </div>
        )}

        <button
          onClick={handleSwap}
          disabled={!fromToken || !toToken || !amount || parseFloat(amount) <= 0}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white rounded-lg p-4 font-bold transition-colors mt-6"
        >
          Swap
        </button>

        {fromToken && toToken && amount && parseFloat(amount) > 0 && (
          <div className="mt-4 text-white/80 text-sm">
            1 {fromToken.symbol} = {getExchangeRate()?.toFixed(6)} {toToken.symbol}
          </div>
        )}

        <TokenModal
          isOpen={isSelectingFrom}
          onClose={() => {
            setIsSelectingFrom(false);
            setSearchQuery('');
          }}
          onSelect={setFromToken}
        />

        <TokenModal
          isOpen={isSelectingTo}
          onClose={() => {
            setIsSelectingTo(false);
            setSearchQuery('');
          }}
          onSelect={setToToken}
        />
      </div>
    </div>
  );
}