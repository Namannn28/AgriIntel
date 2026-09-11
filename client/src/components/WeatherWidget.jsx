import React, { useState, useEffect } from 'react';
import { CloudSun, Droplets, Wind, AlertTriangle, RefreshCw, MapPin } from 'lucide-react';
import axios from 'axios';

export default function WeatherWidget() {
  const [district, setDistrict] = useState('sehore');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  const districts = [
    { key: 'sehore', name: 'Sehore, MP' },
    { key: 'ludhiana', name: 'Ludhiana, Punjab' },
    { key: 'nashik', name: 'Nashik, Maharashtra' },
    { key: 'karnal', name: 'Karnal, Haryana' },
    { key: 'varanasi', name: 'Varanasi, UP' }
  ];

  const fetchWeather = async (targetDistrict) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/weather?district=${targetDistrict}`);
      setWeather(res.data);
    } catch (err) {
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(district);
  }, [district]);

  return (
    <div className="bg-gradient-to-br from-emerald-800 to-teal-900 rounded-2xl p-4 sm:p-5 text-white shadow-lg relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-32 h-32 bg-teal-400/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-700/50">
        
        {/* Location selector */}
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-emerald-300 shrink-0" />
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="bg-emerald-900/80 border border-emerald-600/60 rounded-lg text-xs font-semibold px-2.5 py-1 text-white focus:outline-none focus:ring-1 focus:ring-emerald-400 cursor-pointer"
          >
            {districts.map(d => (
              <option key={d.key} value={d.key} className="bg-slate-900 text-white">
                {d.name}
              </option>
            ))}
          </select>
          <span className="text-[10px] text-emerald-300 font-medium px-2 py-0.5 rounded bg-emerald-700/60">
            Open-Meteo Live (Free)
          </span>
        </div>

        {/* Refresh */}
        <button
          onClick={() => fetchWeather(district)}
          disabled={loading}
          className="text-emerald-300 hover:text-white text-xs flex items-center gap-1 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
          <span>Update</span>
        </button>
      </div>

      {weather && (
        <div className="relative z-10 mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {weather.temperature}°C
              </div>
              <div>
                <div className="text-sm font-semibold text-emerald-100 flex items-center gap-1.5">
                  <CloudSun className="h-4 w-4 text-amber-300" />
                  {weather.condition}
                </div>
                <div className="text-[11px] text-emerald-300">
                  {weather.location}
                </div>
              </div>
            </div>

            {/* Micro stats */}
            <div className="flex items-center gap-4 text-xs font-medium text-emerald-200">
              <div className="flex items-center gap-1">
                <Droplets className="h-3.5 w-3.5 text-blue-300" />
                <span>{weather.humidity}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Wind className="h-3.5 w-3.5 text-teal-300" />
                <span>{weather.windSpeedKmH} km/h</span>
              </div>
            </div>
          </div>

          {/* Agro-Advisory Banner */}
          <div className="p-3 bg-emerald-950/60 border border-emerald-600/50 rounded-xl flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 text-amber-300 shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
                Agro-Advisory
              </span>
              <p className="text-xs text-emerald-100 leading-snug">
                {weather.advisory}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
