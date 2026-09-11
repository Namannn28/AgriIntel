import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, X, KeyRound, Building2 } from 'lucide-react';
import axios from 'axios';

export default function AuthModal({ isOpen, onClose, user, onUserUpdated }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('aadhaar'); // 'aadhaar' | 'digilocker'
  const [aadhaarNumber, setAadhaarNumber] = useState('123456789012');
  const [otp, setOtp] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleAadhaarVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await axios.post('/api/auth/aadhaar/simulate', {
        aadhaarNumber,
        otp,
        userId: user?.id || 'farmer-1'
      });

      if (res.data.success) {
        setMessage(res.data.message);
        onUserUpdated({
          ...user,
          aadhaarSimVerified: true,
          aadhaarNumber: res.data.maskedAadhaar
        });
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed. Please check Aadhaar and OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleDigiLockerVerify = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await axios.post('/api/auth/digilocker/verify', {
        userId: user?.id || 'farmer-1'
      });

      if (res.data.success) {
        setMessage(res.data.message);
        onUserUpdated({
          ...user,
          digilockerVerified: true,
          digilockerConsentId: res.data.consentId
        });
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (err) {
      setError('DigiLocker Sandbox connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Farmer Identity Verification</h3>
              <p className="text-xs text-slate-500">Government eKYC & DigiLocker Integration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Selectors */}
        <div className="grid grid-cols-2 p-1.5 m-6 mb-2 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveTab('aadhaar')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'aadhaar'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Simulated Aadhaar eKYC
          </button>
          <button
            onClick={() => setActiveTab('digilocker')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'digilocker'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            DigiLocker Sandbox
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 pt-2">
          {message && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800 font-medium">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {activeTab === 'aadhaar' ? (
            <form onSubmit={handleAadhaarVerify} className="space-y-4">
              <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                ℹ️ <strong>GovTech Prototype Disclosure:</strong> To test verified farmer privileges without sharing actual government documents, this simulation validates UIDAI checksums and processes simulated OTPs.
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  12-Digit Aadhaar Number
                </label>
                <input
                  type="text"
                  maxLength="12"
                  value={aadhaarNumber}
                  onChange={(e) => setAadhaarNumber(e.target.value)}
                  placeholder="e.g. 1234 5678 9012"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    6-Digit Mobile OTP
                  </label>
                  <span className="text-[11px] text-emerald-700 font-medium">
                    Test Hint: Use <strong>123456</strong>
                  </span>
                </div>
                <input
                  type="text"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono tracking-widest text-center text-lg"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Verifying with UIDAI...' : 'Verify & Seed Profile'}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 flex gap-3">
                <Building2 className="h-6 w-6 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-900 leading-relaxed">
                  Connect with the <strong>DigiLocker Partner Sandbox</strong> to automatically verify land records (Khasra/Khatauni) and seed certified identity documents.
                </div>
              </div>

              <div className="border border-dashed border-slate-200 rounded-xl p-4 text-center">
                <p className="text-xs text-slate-500 mb-3">Partner Client ID: <code className="bg-slate-100 px-1 py-0.5 rounded">AGRIINTEL-DEV-SBOX</code></p>
                <button
                  type="button"
                  onClick={handleDigiLockerVerify}
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? 'Fetching DigiLocker Consent...' : 'Authorize via DigiLocker Sandbox'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
          <span>End-to-End Encrypted</span>
          <span>ISO 27001 Protocol</span>
        </div>
      </div>
    </div>
  );
}
