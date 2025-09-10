import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import WaterFootprintCard from './components/WaterFootprintCard';
import Loader from './components/Loader';
import ErrorDisplay from './components/ErrorDisplay';
import SampleItems from './components/SampleItems';
import Chatbot from './components/Chatbot';
import { calculateWaterFootprint } from './services/geminiService';
import type { WaterFootprintData } from './types';

const App: React.FC = () => {
  const [footprintData, setFootprintData] = useState<WaterFootprintData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (item: string) => {
    if (!item) return;

    setIsLoading(true);
    setError(null);
    setFootprintData(null);

    try {
      const data = await calculateWaterFootprint(item);
      setFootprintData(data);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-light-blue font-sans text-slate-800">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8 bg-white/60 p-6 rounded-2xl shadow-md backdrop-blur-sm">
          <h2 className="text-2xl md:text-3xl font-bold text-dark-blue mb-2">Discover the Hidden Water in Your Life</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Every item we use, from a cup of coffee to a cotton t-shirt, has a "water footprint."
            Enter an item below to find out how much water it takes to produce.
          </p>
        </div>

        <div className="mb-8">
          <SearchBar onSearch={handleSearch} disabled={isLoading} />
        </div>
        
        <SampleItems onSampleClick={handleSearch} disabled={isLoading} />

        <div className="mt-12">
          {isLoading && <Loader />}
          {error && <ErrorDisplay message={error} />}
          {footprintData && <WaterFootprintCard data={footprintData} />}
        </div>
      </main>
      <footer className="text-center py-4 text-sm text-slate-500">
        <p>Powered by Google Gemini. Data is approximate.</p>
      </footer>
      <Chatbot />
    </div>
  );
};

export default App;