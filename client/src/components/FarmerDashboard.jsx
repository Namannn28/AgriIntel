import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  TrendingUp, 
  Sprout, 
  Landmark, 
  ShoppingBag, 
  Users, 
  AlertCircle, 
  CheckCircle2, 
  ArrowUpRight, 
  Info,
  Calendar,
  DollarSign,
  FileCheck,
  Plus
} from 'lucide-react';
import axios from 'axios';

export default function FarmerDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('disease'); // 'disease' | 'price' | 'recommend' | 'subsidies' | 'sell' | 'jobs'

  // =================== 1. Disease Detection State ===================
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80');
  const [cropHint, setCropHint] = useState('Tomato');
  const [diseaseResult, setDiseaseResult] = useState(null);
  const [diseaseLoading, setDiseaseLoading] = useState(false);

  // Sample quick images
  const demoSamples = [
    { label: 'Tomato Blight', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80', crop: 'Tomato' },
    { label: 'Wheat Rust', url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80', crop: 'Wheat' },
    { label: 'Paddy Blight', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', crop: 'Paddy' },
    { label: 'Healthy Leaf', url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80', crop: 'Healthy Leaf' }
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setDiseaseResult(null);
    }
  };

  const runDiseaseInference = async () => {
    setDiseaseLoading(true);
    try {
      const formData = new FormData();
      if (selectedImage) {
        formData.append('file', selectedImage);
      }
      formData.append('cropHint', cropHint);

      const res = await axios.post('/api/ml/disease-detect', formData);
      setDiseaseResult(res.data);
    } catch (err) {
      console.error('Disease detection error:', err);
    } finally {
      setDiseaseLoading(false);
    }
  };

  // =================== 2. Price Forecast State ===================
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [forecastDays, setForecastDays] = useState(15);
  const [priceData, setPriceData] = useState(null);
  const [priceLoading, setPriceLoading] = useState(false);

  const fetchPriceForecast = async (crop) => {
    setPriceLoading(true);
    try {
      const res = await axios.post('/api/ml/price-forecast', {
        crop_name: crop,
        state: user?.state || 'Madhya Pradesh',
        district: user?.district || 'Sehore',
        forecast_days: forecastDays
      });
      setPriceData(res.data);
    } catch (err) {
      console.error('Price forecast error:', err);
    } finally {
      setPriceLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'price') {
      fetchPriceForecast(selectedCrop);
    }
  }, [activeTab, selectedCrop]);

  // =================== 3. Crop Recommendation State ===================
  const [soilN, setSoilN] = useState(90);
  const [soilP, setSoilP] = useState(42);
  const [soilK, setSoilK] = useState(43);
  const [soilPh, setSoilPh] = useState(6.5);
  const [rainfall, setRainfall] = useState(200);
  const [temperature, setTemperature] = useState(25);
  const [recoResult, setRecoResult] = useState(null);
  const [recoLoading, setRecoLoading] = useState(false);

  const runCropRecommendation = async (e) => {
    e.preventDefault();
    setRecoLoading(true);
    try {
      const res = await axios.post('/api/ml/crop-recommend', {
        nitrogen: soilN,
        phosphorus: soilP,
        potassium: soilK,
        ph: soilPh,
        rainfall,
        temperature
      });
      setRecoResult(res.data);
    } catch (err) {
      console.error('Crop reco error:', err);
    } finally {
      setRecoLoading(false);
    }
  };

  // =================== 4. Subsidy Engine State ===================
  const [landAcres, setLandAcres] = useState(3.5);
  const [farmerCategory, setFarmerCategory] = useState('Small');
  const [farmerState, setFarmerState] = useState(user?.state || 'Madhya Pradesh');
  const [subsidyResults, setSubsidyResults] = useState(null);
  const [subsidyLoading, setSubsidyLoading] = useState(false);

  const checkSubsidyEligibility = async (e) => {
    if (e) e.preventDefault();
    setSubsidyLoading(true);
    try {
      const res = await axios.post('/api/subsidies/eligible', {
        landSizeAcres: landAcres,
        category: farmerCategory,
        state: farmerState,
        crops: ['Wheat', 'Paddy']
      });
      setSubsidyResults(res.data);
    } catch (err) {
      console.error('Subsidy check error:', err);
    } finally {
      setSubsidyLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'subsidies' && !subsidyResults) {
      checkSubsidyEligibility();
    }
  }, [activeTab]);

  // =================== 5. Sell Produce State ===================
  const [listings, setListings] = useState([]);
  const [newCropName, setNewCropName] = useState('Wheat (Sharbati)');
  const [newQuantity, setNewQuantity] = useState(40);
  const [newAskingPrice, setNewAskingPrice] = useState(2450);
  const [sellMessage, setSellMessage] = useState(null);

  const fetchListings = async () => {
    try {
      const res = await axios.get('/api/listings/crop');
      setListings(res.data.listings || []);
    } catch (err) {
      console.error('Fetch listings error:', err);
    }
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/listings/crop', {
        farmerId: user?.id || 'farmer-1',
        farmerName: user?.name || 'Ramesh Patel',
        farmerPhone: user?.phone || '+91 98234 56780',
        cropName: newCropName,
        quantity: newQuantity,
        unit: 'Quintals',
        askingPrice: newAskingPrice,
        state: user?.state || 'Madhya Pradesh',
        district: user?.district || 'Sehore',
        description: 'Harvested from verified farmer farm, graded and cleaned.'
      });
      if (res.data.success) {
        setSellMessage('Crop listed successfully on direct marketplace!');
        fetchListings();
        setTimeout(() => setSellMessage(null), 3000);
      }
    } catch (err) {
      console.error('Create listing error:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'sell') {
      fetchListings();
    }
  }, [activeTab]);

  // =================== 6. Hire Labor State ===================
  const [jobs, setJobs] = useState([]);
  const [taskType, setTaskType] = useState('Harvesting & Threshing');
  const [wageOffered, setWageOffered] = useState(550);
  const [workersNeeded, setWorkersNeeded] = useState(5);
  const [jobMessage, setJobMessage] = useState(null);

  const fetchJobs = async () => {
    try {
      const res = await axios.get('/api/jobs');
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error('Fetch jobs error:', err);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/jobs', {
        farmerId: user?.id || 'farmer-1',
        farmerName: user?.name || 'Ramesh Patel',
        taskType,
        crop: selectedCrop,
        wageOffered,
        workersNeeded,
        state: user?.state || 'Madhya Pradesh',
        district: user?.district || 'Sehore'
      });
      if (res.data.success) {
        setJobMessage('Labor hiring post published to local worker board!');
        fetchJobs();
        setTimeout(() => setJobMessage(null), 3000);
      }
    } catch (err) {
      console.error('Create job error:', err);
    }
  };

  const handleHireApplicant = async (jobId, workerId) => {
    try {
      await axios.put(`/api/jobs/${jobId}/applicants/${workerId}`, {
        status: 'HIRED'
      });
      fetchJobs();
    } catch (err) {
      console.error('Hire applicant error:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'jobs') {
      fetchJobs();
    }
  }, [activeTab]);

  const tabs = [
    { id: 'disease', label: 'Leaf Disease AI', icon: Camera },
    { id: 'price', label: 'Mandi Price & MSP', icon: TrendingUp },
    { id: 'recommend', label: 'Crop Advisory', icon: Sprout },
    { id: 'subsidies', label: 'Govt Subsidies', icon: Landmark },
    { id: 'sell', label: 'Sell Produce', icon: ShoppingBag },
    { id: 'jobs', label: 'Hire Farm Labor', icon: Users },
  ];

  return (
    <div className="space-y-6">
      
      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {tabs.map(t => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                active
                  ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-700/20'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
              }`}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* ======================= TAB 1: DISEASE AI ======================= */}
      {activeTab === 'disease' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Upload & Camera Panel */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Crop Disease Diagnostic (CV)</h3>
                <p className="text-xs text-slate-500">Instant transfer-learning analysis on leaf symptoms</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                EfficientNet / MobileNet
              </span>
            </div>

            {/* Quick Demo Previews */}
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block mb-2">Or select sample leaf:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {demoSamples.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setPreviewUrl(s.url);
                      setCropHint(s.crop);
                      setSelectedImage(null);
                      setDiseaseResult(null);
                    }}
                    className={`p-1.5 rounded-xl border text-left transition-all ${
                      previewUrl === s.url ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img src={s.url} alt={s.label} className="h-14 w-full object-cover rounded-lg mb-1" />
                    <span className="text-[10px] font-semibold text-slate-700 block truncate">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview Box */}
            <div className="relative border-2 border-dashed border-slate-300 rounded-2xl p-4 bg-slate-50 flex flex-col items-center justify-center min-h-[220px]">
              {previewUrl ? (
                <div className="relative w-full h-56 rounded-xl overflow-hidden shadow-inner">
                  <img src={previewUrl} alt="Leaf Preview" className="w-full h-full object-cover" />
                  <div className="absolute bottom-2 right-2 bg-slate-900/70 backdrop-blur-md text-white px-2 py-0.5 rounded text-[10px] font-medium">
                    Crop: {cropHint}
                  </div>
                </div>
              ) : (
                <div className="text-center p-6">
                  <Camera className="h-10 w-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-600 font-medium">Capture or upload photo of affected leaf</p>
                </div>
              )}

              {/* Upload input button */}
              <label className="mt-3 cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 shadow-sm text-slate-700 transition-colors">
                <Upload className="h-4 w-4 text-emerald-600" />
                <span>Upload From Device</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            {/* Inference Action Button */}
            <button
              onClick={runDiseaseInference}
              disabled={diseaseLoading}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {diseaseLoading ? 'Running Computer Vision Diagnostic...' : 'Diagnose Leaf Symptoms Now'}
            </button>
          </div>

          {/* Diagnosis Result Card */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-base font-bold text-slate-900 mb-1">Agronomic Diagnosis & Cure</h3>
            <p className="text-xs text-slate-500 mb-4">Grounded treatment protocol validated with ICAR guidelines</p>

            {diseaseResult ? (
              <div className="space-y-4 animate-in fade-in duration-300 flex-1">
                
                {/* Result Pill */}
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                      Identified Disease
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                      {Math.round(diseaseResult.confidence * 100)}% Confidence
                    </span>
                  </div>
                  <h4 className="text-lg font-extrabold text-emerald-950">
                    {diseaseResult.disease}
                  </h4>
                  <p className="text-xs text-emerald-800 mt-1 font-medium">
                    Crop Species: <strong>{diseaseResult.crop}</strong>
                  </p>
                </div>

                {/* Symptoms */}
                {diseaseResult.symptoms && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-600 uppercase block mb-1">
                      Visual Symptoms
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {diseaseResult.symptoms}
                    </p>
                  </div>
                )}

                {/* Treatment / Chemical recommendation */}
                <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200/80">
                  <span className="text-[11px] font-bold text-amber-900 uppercase block mb-1">
                    Recommended Treatment (ICAR Protocol)
                  </span>
                  <p className="text-xs text-amber-950 font-medium leading-relaxed">
                    {diseaseResult.treatment}
                  </p>
                </div>

                {/* Prevention */}
                <div className="p-4 bg-teal-50/70 rounded-xl border border-teal-200/80">
                  <span className="text-[11px] font-bold text-teal-900 uppercase block mb-1">
                    Cultural & Agronomic Prevention
                  </span>
                  <p className="text-xs text-teal-950 leading-relaxed">
                    {diseaseResult.prevention}
                  </p>
                </div>

                <div className="text-[10px] text-slate-400 text-right mt-auto">
                  Engine: {diseaseResult.inferenceMode || 'PyTorch MobileNetV2'}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                <Sprout className="h-12 w-12 text-slate-300 mb-3" />
                <h4 className="text-sm font-bold text-slate-700">No Diagnosis Generated Yet</h4>
                <p className="text-xs text-slate-500 max-w-xs mt-1">
                  Upload or select a leaf photo on the left and click "Diagnose Leaf Symptoms Now".
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================= TAB 2: PRICE FORECAST & MSP ======================= */}
      {activeTab === 'price' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">Mandi Price Forecast vs. Government MSP</h3>
                <p className="text-xs text-slate-500">Prophet time-series price projections compared against statutory floor prices</p>
              </div>

              {/* Crop Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">Select Crop:</span>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Wheat">Wheat (गेहूं)</option>
                  <option value="Paddy (Common)">Paddy (धान)</option>
                  <option value="Mustard">Mustard (सरसों)</option>
                  <option value="Gram (Chana)">Gram (चना)</option>
                  <option value="Tomato">Tomato (टमाटर)</option>
                  <option value="Onion">Onion (प्याज)</option>
                </select>
              </div>
            </div>

            {priceData && (
              <div className="mt-6 space-y-6">
                
                {/* Metric Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs font-semibold text-slate-500">Current Modal Mandi Price</span>
                    <div className="text-2xl font-extrabold text-slate-900 mt-1">
                      ₹{priceData.current_avg_price}
                      <span className="text-xs font-medium text-slate-500"> / Quintal</span>
                    </div>
                    <span className="text-[11px] text-slate-500">{priceData.district} Mandi Yard</span>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="text-xs font-semibold text-emerald-700">Statutory Floor (MSP)</span>
                    <div className="text-2xl font-extrabold text-emerald-950 mt-1">
                      ₹{priceData.msp_price}
                      <span className="text-xs font-medium text-emerald-700"> / Quintal</span>
                    </div>
                    <span className="text-[11px] text-emerald-800 font-medium">Government Guaranteed Floor</span>
                  </div>

                  <div className="p-4 rounded-xl bg-teal-50 border border-teal-200">
                    <span className="text-xs font-semibold text-teal-700">15-Day Projected Trend</span>
                    <div className="text-2xl font-extrabold text-teal-950 mt-1 flex items-center gap-1.5">
                      <TrendingUp className="h-5 w-5 text-teal-600" />
                      <span>{priceData.predicted_trend}</span>
                    </div>
                    <span className="text-[11px] text-teal-800 font-medium">Peak ₹{Math.max(...priceData.forecast_series.map(f => f.predicted_price))} / Qtl</span>
                  </div>
                </div>

                {/* Visual Forecast Table / Curve */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                      15-Day Forward Mandi Projections (Prophet Model)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Baseline: CACP Official Minimum Support Rates
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-4">Date / Day</th>
                          <th className="py-2.5 px-4">Predicted Price</th>
                          <th className="py-2.5 px-4">Estimated Range</th>
                          <th className="py-2.5 px-4">MSP Benchmark</th>
                          <th className="py-2.5 px-4">Farmer Margin vs MSP</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {priceData.forecast_series.map((item, idx) => {
                          const margin = item.predicted_price - item.msp_floor;
                          const isPositive = margin >= 0;
                          return (
                            <tr key={idx} className="hover:bg-slate-50/80">
                              <td className="py-2.5 px-4 font-semibold text-slate-800">
                                Day {item.day} ({item.date})
                              </td>
                              <td className="py-2.5 px-4 font-bold text-emerald-800">
                                ₹{item.predicted_price}
                              </td>
                              <td className="py-2.5 px-4 text-slate-500 font-mono">
                                ₹{item.confidence_lower} – ₹{item.confidence_upper}
                              </td>
                              <td className="py-2.5 px-4 font-medium text-slate-700">
                                ₹{item.msp_floor}
                              </td>
                              <td className="py-2.5 px-4 font-semibold">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] ${
                                  isPositive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                }`}>
                                  {isPositive ? `+₹${margin}` : `-₹${Math.abs(margin)}`}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
                  <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Market Advice:</strong> Current projections indicate an upward trend over the next 10 days. If storage moisture allows, stagger mandi dispatch to capture higher prices above ₹{priceData.current_avg_price}.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================= TAB 3: CROP RECOMMENDATION ======================= */}
      {activeTab === 'recommend' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form onSubmit={runCropRecommendation} className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Soil & Climate Inputs</h3>
            <p className="text-xs text-slate-500">Provide soil test metrics (from Soil Health Card) or regional estimates</p>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Nitrogen (N)</label>
                <input
                  type="number"
                  value={soilN}
                  onChange={(e) => setSoilN(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-lg"
                  placeholder="90"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Phosphorus (P)</label>
                <input
                  type="number"
                  value={soilP}
                  onChange={(e) => setSoilP(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-lg"
                  placeholder="42"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Potassium (K)</label>
                <input
                  type="number"
                  value={soilK}
                  onChange={(e) => setSoilK(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-lg"
                  placeholder="43"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Soil pH ({soilPh})</label>
                <input
                  type="range"
                  min="4.5"
                  max="9.0"
                  step="0.1"
                  value={soilPh}
                  onChange={(e) => setSoilPh(e.target.value)}
                  className="w-full accent-emerald-600"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Rainfall ({rainfall} mm)</label>
                <input
                  type="range"
                  min="50"
                  max="500"
                  step="10"
                  value={rainfall}
                  onChange={(e) => setRainfall(e.target.value)}
                  className="w-full accent-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Avg Temperature (°C)</label>
              <input
                type="number"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                className="w-full px-3 py-2 text-xs border rounded-lg"
                placeholder="25"
              />
            </div>

            <button
              type="submit"
              disabled={recoLoading}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
            >
              {recoLoading ? 'Calculating Soil Fit...' : 'Generate Crop Recommendation'}
            </button>
          </form>

          {/* Recommendation Output */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-center">
            {recoResult ? (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-gradient-to-tr from-emerald-50 to-teal-50 border border-emerald-200">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                    Optimal Recommended Crop
                  </span>
                  <h3 className="text-2xl font-black text-emerald-950 mt-1">
                    🌾 {recoResult.recommended_crop}
                  </h3>
                  <p className="text-xs text-emerald-900 mt-2 leading-relaxed">
                    {recoResult.agronomicSummary}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-xs font-bold text-slate-700 block mb-2">Suitable Alternative Crops:</span>
                  <div className="flex flex-wrap gap-2">
                    {recoResult.suitable_alternatives.map((alt, idx) => (
                      <span key={idx} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 shadow-2xs">
                        🌱 {alt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-8">
                <Sprout className="h-12 w-12 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-700">Enter your soil metrics</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Our machine learning model analyzes optimal crop fit against your micro-climate.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================= TAB 4: SUBSIDIES ENGINE ======================= */}
      {activeTab === 'subsidies' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">Government Subsidy Eligibility Engine</h3>
                <p className="text-xs text-slate-500">Automated matching against central and state agricultural welfare schemes</p>
              </div>

              {/* Quick filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <label className="text-xs font-semibold text-slate-600">Land (Acres):</label>
                  <input
                    type="number"
                    step="0.5"
                    value={landAcres}
                    onChange={(e) => setLandAcres(e.target.value)}
                    className="w-16 px-2 py-1 border rounded-lg text-xs font-bold text-center"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <label className="text-xs font-semibold text-slate-600">Category:</label>
                  <select
                    value={farmerCategory}
                    onChange={(e) => setFarmerCategory(e.target.value)}
                    className="px-2.5 py-1 border rounded-lg text-xs font-bold"
                  >
                    <option value="Marginal">Marginal (&lt; 2.5 Ac)</option>
                    <option value="Small">Small (2.5 - 5 Ac)</option>
                    <option value="Medium">Medium (5 - 10 Ac)</option>
                    <option value="Large">Large (&gt; 10 Ac)</option>
                  </select>
                </div>
                <button
                  onClick={checkSubsidyEligibility}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                >
                  Re-evaluate
                </button>
              </div>
            </div>

            {/* Scheme Cards */}
            {subsidyResults && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>Found <strong>{subsidyResults.eligibleCount}</strong> eligible schemes out of {subsidyResults.totalSchemesChecked} audited policies</span>
                  <span className="text-emerald-700">Profile: {farmerCategory} Farmer in {farmerState}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subsidyResults.eligibleSchemes.map((scheme) => (
                    <div key={scheme.id} className="p-5 rounded-2xl border border-emerald-200 bg-white hover:shadow-md transition-shadow flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            scheme.level === 'Central' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {scheme.level} Scheme
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Eligible
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 mb-1">
                          {scheme.name}
                        </h4>
                        <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                          {scheme.description}
                        </p>

                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-emerald-900 mb-3">
                          Benefit: {scheme.benefitAmount}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">UIDAI / Khasra verified</span>
                        <a
                          href={scheme.applicationLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                        >
                          Official Apply Portal <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================= TAB 5: SELL PRODUCE ======================= */}
      {activeTab === 'sell' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Create Listing Form */}
          <form onSubmit={handleCreateListing} className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">List Produce for Direct Sale</h3>
            <p className="text-xs text-slate-500">Sell directly to verified millers and buyers with zero middleman fee</p>

            {sellMessage && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-medium">
                {sellMessage}
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Crop Name & Variety</label>
              <input
                type="text"
                value={newCropName}
                onChange={(e) => setNewCropName(e.target.value)}
                className="w-full px-3 py-2 text-xs border rounded-lg"
                placeholder="e.g. Wheat (Sharbati A-Grade)"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Quantity (Quintals)</label>
                <input
                  type="number"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Asking Price (₹ / Qtl)</label>
                <input
                  type="number"
                  value={newAskingPrice}
                  onChange={(e) => setNewAskingPrice(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-lg font-bold text-emerald-800"
                  required
                />
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 leading-snug">
              💡 <strong>Fair Pricing Advisory:</strong> Current statutory MSP floor is ₹2,275/Qtl. Your asking price (₹{newAskingPrice}) ensures fair return over cost of production.
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
            >
              Publish Crop Listing
            </button>
          </form>

          {/* Active Marketplace Listings */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4">Active Marketplace Listings</h3>
            
            <div className="space-y-3">
              {listings.map((item) => (
                <div key={item.id} className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-slate-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <img src={item.images[0]} alt={item.cropName} className="h-14 w-14 object-cover rounded-xl shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{item.cropName}</h4>
                      <p className="text-xs text-slate-500">{item.quantity} {item.unit} • {item.district}, {item.state}</p>
                      <span className="text-[10px] font-bold text-emerald-700 mt-1 inline-block">
                        MSP: ₹{item.mspPrice} | Forecast: ₹{item.forecastPrice}
                      </span>
                    </div>
                  </div>
                  <div className="text-right self-end sm:self-auto">
                    <div className="text-base font-extrabold text-slate-900">₹{item.askingPrice}</div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================= TAB 6: HIRE LABOR ======================= */}
      {activeTab === 'jobs' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Post Job Form */}
          <form onSubmit={handleCreateJob} className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Post Farm Labor Opening</h3>
            <p className="text-xs text-slate-500">Connect with nearby skilled agricultural workers</p>

            {jobMessage && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-medium">
                {jobMessage}
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Task Type</label>
              <select
                value={taskType}
                onChange={(e) => setTaskType(e.target.value)}
                className="w-full px-3 py-2 text-xs border rounded-lg"
              >
                <option value="Harvesting & Threshing">Wheat / Paddy Harvesting & Threshing</option>
                <option value="Transplanting & Sowing">Transplanting & Sowing</option>
                <option value="Pesticide Spraying">Precision Pesticide Spraying</option>
                <option value="Tractor Driving & Rotavator">Tractor Operator & Field Tilling</option>
                <option value="Fruit & Vegetable Plucking">Fruit & Vegetable Plucking & Sorting</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Daily Wage Offered (₹)</label>
                <input
                  type="number"
                  value={wageOffered}
                  onChange={(e) => setWageOffered(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Workers Needed</label>
                <input
                  type="number"
                  value={workersNeeded}
                  onChange={(e) => setWorkersNeeded(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-lg"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
            >
              Broadcast Job to Workers
            </button>
          </form>

          {/* Jobs & Applicants */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Your Farm Job Openings & Applicants</h3>
            
            {jobs.map((j) => (
              <div key={j.id} className="p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{j.taskType}</h4>
                    <p className="text-xs text-slate-500">{j.crop} • {j.locationName || j.district}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-slate-900">₹{j.wageOffered} / day</span>
                    <span className="text-[10px] block text-slate-400">{j.workersNeeded} workers needed</span>
                  </div>
                </div>

                {/* Applicants List */}
                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-600 block mb-2">
                    Applicants ({j.applicants.length}):
                  </span>
                  {j.applicants.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No applications yet. Job broadcasted to local area.</p>
                  ) : (
                    <div className="space-y-2">
                      {j.applicants.map((app, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-800">{app.workerName}</span>
                            <span className="text-slate-400 ml-2">Status: <strong className="text-emerald-700">{app.status}</strong></span>
                          </div>
                          {app.status !== 'HIRED' ? (
                            <button
                              onClick={() => handleHireApplicant(j.id, app.workerId)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[11px] font-bold"
                            >
                              Confirm Hire
                            </button>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              ✓ Hired
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
