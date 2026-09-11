import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import WeatherWidget from './components/WeatherWidget';
import FarmerDashboard from './components/FarmerDashboard';
import BuyerDashboard from './components/BuyerDashboard';
import WorkerDashboard from './components/WorkerDashboard';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';
import AssistantDrawer from './components/AssistantDrawer';
import { Sprout, ShieldCheck, Heart, Code2 } from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState('farmer'); // 'farmer' | 'buyer' | 'worker' | 'admin'
  const [user, setUser] = useState({
    id: 'farmer-1',
    name: 'Ramesh Patel',
    phone: '9823456780',
    role: 'farmer',
    state: 'Madhya Pradesh',
    district: 'Sehore',
    aadhaarNumber: 'XXXX-XXXX-4819',
    digilockerVerified: true,
    aadhaarSimVerified: true,
    landSizeAcres: 4.5,
    cropsGrown: ['Wheat', 'Gram']
  });

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Sync role change with user persona
  const handleRoleChange = (newRole) => {
    setCurrentRole(newRole);
    if (newRole === 'farmer') {
      setUser({
        id: 'farmer-1',
        name: 'Ramesh Patel',
        phone: '9823456780',
        role: 'farmer',
        state: 'Madhya Pradesh',
        district: 'Sehore',
        aadhaarNumber: 'XXXX-XXXX-4819',
        digilockerVerified: true,
        aadhaarSimVerified: true
      });
    } else if (newRole === 'buyer') {
      setUser({
        id: 'buyer-1',
        name: 'Amit Agrotech Mills',
        phone: '9900122334',
        role: 'buyer',
        state: 'Madhya Pradesh',
        district: 'Bhopal',
        aadhaarNumber: 'XXXX-XXXX-9120',
        digilockerVerified: true,
        aadhaarSimVerified: true
      });
    } else if (newRole === 'worker') {
      setUser({
        id: 'worker-1',
        name: 'Jagdish Mandloi',
        phone: '9755543210',
        role: 'worker',
        state: 'Madhya Pradesh',
        district: 'Sehore',
        aadhaarNumber: 'XXXX-XXXX-3341',
        digilockerVerified: false,
        aadhaarSimVerified: true
      });
    } else {
      setUser({
        id: 'admin-1',
        name: 'GovTech Agriculture Admin',
        phone: '9999900000',
        role: 'admin',
        state: 'Delhi',
        district: 'New Delhi',
        digilockerVerified: true,
        aadhaarSimVerified: true
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      
      {/* Top Navbar with Role Switcher & Identity Status */}
      <Navbar
        currentRole={currentRole}
        setRole={handleRoleChange}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onToggleAssistant={() => setIsAssistantOpen(!isAssistantOpen)}
        isAssistantOpen={isAssistantOpen}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Weather & Agro-Advisory Banner (shown on Farmer and Admin roles) */}
        {(currentRole === 'farmer' || currentRole === 'admin') && (
          <WeatherWidget />
        )}

        {/* Dynamic Role Dashboard */}
        {currentRole === 'farmer' && <FarmerDashboard user={user} />}
        {currentRole === 'buyer' && <BuyerDashboard user={user} />}
        {currentRole === 'worker' && <WorkerDashboard user={user} />}
        {currentRole === 'admin' && <AdminDashboard />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">AgriIntel</span>
            <span>• AI-Integrated Digital Platform for Farmer Empowerment</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Built for Indian Agriculture <Heart className="h-3 w-3 text-rose-500 fill-rose-500" />
            </span>
            <a
              href="https://github.com/Namannn28/AgriIntel"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-slate-700 hover:text-emerald-700 font-semibold"
            >
              <Code2 className="h-3.5 w-3.5 text-emerald-600" />
              GitHub Repository
            </a>
          </div>
        </div>
      </footer>

      {/* Aadhaar & DigiLocker eKYC Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        user={user}
        onUserUpdated={(updatedUser) => setUser(updatedUser)}
      />

      {/* Grounded RAG Kisan AI Assistant Drawer */}
      <AssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        user={user}
      />

    </div>
  );
}
