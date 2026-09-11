import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Star, 
  UserCheck,
  Send,
  SlidersHorizontal
} from 'lucide-react';
import axios from 'axios';

export default function WorkerDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' | 'profile' | 'applications'
  const [jobs, setJobs] = useState([]);
  const [workerProfile, setWorkerProfile] = useState(null);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [applyingJobId, setApplyingJobId] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  // Profile Form State
  const [name, setName] = useState('Jagdish Mandloi');
  const [dailyWage, setDailyWage] = useState(550);
  const [experienceYears, setExperienceYears] = useState(8);
  const [city, setCity] = useState('Sehore');
  const [availability, setAvailability] = useState('AVAILABLE');
  const [skillsText, setSkillsText] = useState('Wheat Harvesting, Tractor Driving, Drip Maintenance');

  const fetchJobs = async () => {
    try {
      const res = await axios.get('/api/jobs');
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error('Fetch jobs error:', err);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/workers/profile/worker-1');
      if (res.data.profile) {
        const p = res.data.profile;
        setWorkerProfile(p);
        setName(p.name);
        setDailyWage(p.dailyWage);
        setExperienceYears(p.experienceYears);
        setCity(p.city);
        setAvailability(p.availability);
        setSkillsText(p.skills.join(', '));
      }
    } catch (err) {
      console.error('Fetch worker profile error:', err);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchProfile();
  }, []);

  const handleApply = async (jobId) => {
    setApplyingJobId(jobId);
    try {
      const res = await axios.post(`/api/jobs/${jobId}/apply`, {
        workerId: user?.id || 'worker-1',
        workerName: name,
        workerPhone: user?.phone || '+91 97555 43210',
        dailyWageExpected: dailyWage
      });

      if (res.data.success) {
        setAppliedJobIds(prev => new Set(prev).add(jobId));
        setStatusMessage(`Application submitted to farmer for job #${jobId}`);
        fetchJobs();
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to apply.');
    } finally {
      setApplyingJobId(null);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/workers/profile', {
        userId: user?.id || 'worker-1',
        name,
        dailyWage,
        experienceYears,
        city,
        availability,
        skills: skillsText.split(',').map(s => s.trim())
      });

      if (res.data.success) {
        setWorkerProfile(res.data.profile);
        setStatusMessage('Worker profile updated successfully!');
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err) {
      console.error('Save profile error:', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Tab Selectors */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'jobs'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Briefcase className="h-4 w-4" />
          Available Farm Jobs ({jobs.length})
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'profile'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <UserCheck className="h-4 w-4" />
          My Worker Profile & Skills
        </button>
      </div>

      {statusMessage && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* ================= JOBS FEED TAB ================= */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job) => {
              const hasApplied = appliedJobIds.has(job.id) || job.applicants?.some(a => a.workerId === (user?.id || 'worker-1'));
              return (
                <div key={job.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                          {job.crop} Farm
                        </span>
                        <h4 className="text-base font-bold text-slate-900 mt-1">
                          {job.taskType}
                        </h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3 text-amber-600" />
                          {job.locationName || job.district}, {job.state}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-black text-amber-800">
                          ₹{job.wageOffered}
                          <span className="text-xs font-normal text-slate-400"> / day</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {job.workersNeeded} workers needed
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Employer: Farmer <strong>{job.farmerName}</strong></span>
                      <span className="text-slate-400">{job.startDate} to {job.endDate}</span>
                    </div>
                  </div>

                  <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Applicants: {job.applicants?.length || 0}
                    </span>
                    <button
                      onClick={() => handleApply(job.id)}
                      disabled={hasApplied || applyingJobId === job.id}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                        hasApplied
                          ? 'bg-emerald-100 text-emerald-800 cursor-default'
                          : 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm'
                      }`}
                    >
                      {hasApplied ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          Application Sent
                        </>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" />
                          {applyingJobId === job.id ? 'Applying...' : 'Apply for Job'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= PROFILE TAB ================= */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form onSubmit={handleSaveProfile} className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Edit Worker Profile & Wage Rate</h3>
            <p className="text-xs text-slate-500">Farmers in your district can search and hire you directly</p>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs border rounded-lg font-bold"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Daily Wage Expected (₹)</label>
                <input
                  type="number"
                  value={dailyWage}
                  onChange={(e) => setDailyWage(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-lg font-bold text-amber-800"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Years of Experience</label>
                <input
                  type="number"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">City / District</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Availability Status</label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-lg font-semibold"
                >
                  <option value="AVAILABLE">Available for Work (उपलब्ध)</option>
                  <option value="BUSY">Currently on Job (व्यस्त)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Specialized Skills (Comma separated)
              </label>
              <input
                type="text"
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                className="w-full px-3 py-2 text-xs border rounded-lg"
                placeholder="Wheat Harvesting, Tractor Driving, Drip Maintenance..."
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
            >
              Update Worker Profile
            </button>
          </form>

          {/* Profile Card Preview */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col items-center text-center">
            <div className="h-20 w-20 rounded-full overflow-hidden mb-3 border-2 border-amber-500 shadow-sm">
              <img
                src={workerProfile?.profilePhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}
                alt="Worker"
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="text-base font-bold text-slate-900">{name}</h4>
            <p className="text-xs text-slate-500">{city}, Madhya Pradesh</p>

            <div className="flex items-center gap-1 text-amber-500 text-xs font-bold my-2">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span>4.85</span>
              <span className="text-slate-400 font-normal">(24 reviews)</span>
            </div>

            <div className="w-full p-3 bg-amber-50 rounded-xl border border-amber-200 my-3 text-xs font-semibold text-amber-900 flex justify-between">
              <span>Standard Daily Rate:</span>
              <span className="font-extrabold text-amber-950">₹{dailyWage} / day</span>
            </div>

            <div className="w-full text-left space-y-1 mt-2">
              <span className="text-[11px] font-bold text-slate-600 uppercase block">Skill Badges</span>
              <div className="flex flex-wrap gap-1.5">
                {skillsText.split(',').map((skill, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-slate-100 rounded-lg text-[11px] font-semibold text-slate-700">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
