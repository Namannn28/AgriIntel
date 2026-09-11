import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  Activity,
  Layers,
  Database
} from 'lucide-react';
import axios from 'axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [heatmap, setHeatmap] = useState([]);
  const [priceTrends, setPriceTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, heatmapRes, trendsRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/disease-heatmap'),
        axios.get('/api/admin/price-trends')
      ]);

      setStats(statsRes.data);
      setHeatmap(heatmapRes.data.regions || []);
      setPriceTrends(trendsRes.data.mspComparisonTrends || []);
    } catch (err) {
      console.error('Fetch admin data error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900">GovTech Platform Analytics & Oversight</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800">
              Department of Agriculture
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Real-time health monitoring of farmer transactions, disease outbreaks, and price stability</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <Activity className="h-4 w-4 text-emerald-600" />
          <span>Platform Uptime: <strong>{stats?.platformUptimePct || 99.9}%</strong></span>
        </div>
      </div>

      {/* KPI Grid */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500">Active Farmers</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{stats.activeFarmers.toLocaleString()}</div>
            <span className="text-[11px] text-emerald-700 font-medium">88.4% DigiLocker Verified</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500">Total Produce Traded</span>
            <div className="text-2xl font-black text-slate-900 mt-1">₹{(stats.totalTradeVolumeRupees / 100000).toFixed(2)} Lakhs</div>
            <span className="text-[11px] text-slate-500">Direct Escrow Settlements</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500">Farm Workers Registered</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{stats.availableWorkers}</div>
            <span className="text-[11px] text-amber-700 font-medium">{stats.activeJobOpenings} Active Openings</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500">Active Crop Listings</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{stats.activeListingsCount}</div>
            <span className="text-[11px] text-slate-500">355 Quintals Volume</span>
          </div>
        </div>
      )}

      {/* Outbreak Heatmap Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <h3 className="text-base font-bold text-slate-900">Regional Crop Disease Alert Monitor</h3>
          </div>
          <span className="text-xs text-slate-400">Aggregated from Farmer Diagnostic Scans</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">State & District</th>
                <th className="py-3 px-4">Prevalent Disease</th>
                <th className="py-3 px-4">Severity Alert</th>
                <th className="py-3 px-4">Diagnoses Logged</th>
                <th className="py-3 px-4">Mandated Chemical Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {heatmap.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-bold text-slate-800">
                    {r.district}, {r.state}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {r.disease}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      r.alertLevel === 'HIGH'
                        ? 'bg-rose-100 text-rose-800'
                        : r.alertLevel === 'MODERATE'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {r.alertLevel} ALERT
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">
                    {r.casesReported} cases
                  </td>
                  <td className="py-3 px-4 text-emerald-800 font-medium">
                    {r.recommendedPesticide}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mandi Price Fluctuation Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Mandi Modal Rate Stability vs Statutory MSP</h3>
          </div>
          <span className="text-xs text-slate-400">CACP statutory monitoring</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {priceTrends.map((crop, idx) => (
            <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900 block">{crop.crop}</span>
                <span className="text-slate-500 text-[11px]">MSP: ₹{crop.msp} / Qtl</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-emerald-800 block">Avg: ₹{crop.averageMandiPrice}</span>
                <span className="text-[10px] text-emerald-700 font-medium">+{crop.premiumOverMspPct}% over MSP</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
