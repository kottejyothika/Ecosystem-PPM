import React from 'react';
import {
  Recycle,
  Sparkles,
  Leaf,
  Shield,
  Briefcase,
  GraduationCap,
  ArrowRight,
  TrendingDown,
  Users,
  Building2,
  CheckCircle2,
  Package,
  Layers,
  Award,
  Globe2,
} from 'lucide-react';
import { useEcoCampus } from '../context/EcoCampusContext';

interface LandingPageProps {
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth }) => {
  const { setCurrentView, switchRole, stations, collections, users, segregationStats } =
    useEcoCampus();

  const totalCollected = collections.reduce((a, b) => a + b.quantity, 0).toFixed(1);
  const totalRecycled = segregationStats.reduce((a, b) => a + b.recycled, 0).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f4f8f5] via-white to-[#edf6f0] text-emerald-950">
      {/* Top Banner Notice */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        <span>AITS WEBSPRINT 2026 Project Showcase: Real-Time Digital Circular Economy for Universities</span>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Subtle decorative background shapes */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-200/30 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-200/80 text-emerald-900 text-xs font-semibold mb-6 shadow-2xs">
            <Leaf className="w-3.5 h-3.5 text-emerald-700" />
            <span>Plastic-Free University Framework</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-emerald-700 font-normal">Reduce • Reuse • Recycle • Reward</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-emerald-950 font-serif max-w-4xl mx-auto leading-tight">
            Make Your Campus <br />
            <span className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 bg-clip-text text-transparent">
              100% Plastic-Free.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-emerald-900/80 max-w-2xl mx-auto font-normal leading-relaxed">
            A smart digital platform to reduce single-use plastic, streamline segregation, incentivize
            reusable alternatives, and reward responsible eco-action across college campuses.
          </p>

          {/* Action CTAs */}
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              id="btn-get-started-student"
              onClick={() => {
                switchRole('student');
                setCurrentView('student-dashboard');
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Get Started (Student Portal)</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
            <button
              id="btn-explore-impact"
              onClick={() => setCurrentView('impact')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-200 font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Globe2 className="w-4 h-4 text-emerald-700" />
              <span>Explore Campus Impact</span>
            </button>
            <button
              id="btn-admin-console"
              onClick={() => {
                switchRole('admin');
                setCurrentView('admin-dashboard');
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-100/70 hover:bg-amber-100 text-amber-950 border border-amber-300/80 font-semibold text-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <Shield className="w-4 h-4 text-amber-800" />
              <span>Admin Monitoring</span>
            </button>
          </div>

          {/* Instant Role Access Bar */}
          <div className="mt-8 pt-6 border-t border-emerald-200/50 max-w-xl mx-auto flex flex-wrap items-center justify-center gap-2 text-xs text-emerald-800">
            <span className="font-medium text-gray-500">Instant Demo Evaluation:</span>
            <button
              onClick={() => {
                switchRole('student');
                setCurrentView('student-dashboard');
              }}
              className="px-2.5 py-1 rounded-md bg-white border border-emerald-200 hover:bg-emerald-50 font-semibold text-emerald-800"
            >
              👨‍🎓 Student Demo
            </button>
            <button
              onClick={() => {
                switchRole('admin');
                setCurrentView('admin-dashboard');
              }}
              className="px-2.5 py-1 rounded-md bg-white border border-amber-200 hover:bg-amber-50 font-semibold text-amber-900"
            >
              🛡️ Admin Demo
            </button>
            <button
              onClick={() => {
                switchRole('worker');
                setCurrentView('worker-dashboard');
              }}
              className="px-2.5 py-1 rounded-md bg-white border border-blue-200 hover:bg-blue-50 font-semibold text-blue-900"
            >
              👷 Worker Demo
            </button>
          </div>
        </div>
      </section>

      {/* Live Campus KPI Highlights */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 mb-16 relative z-10">
        <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-md shadow-emerald-900/5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
          <div className="p-2">
            <p className="text-2xl lg:text-3xl font-extrabold text-emerald-900 font-serif">
              {totalCollected} <span className="text-sm font-semibold">kg</span>
            </p>
            <p className="text-xs font-medium text-emerald-700/80 mt-1">Plastic Collected</p>
          </div>
          <div className="p-2 border-l border-emerald-50">
            <p className="text-2xl lg:text-3xl font-extrabold text-emerald-900 font-serif">
              {totalRecycled} <span className="text-sm font-semibold">kg</span>
            </p>
            <p className="text-xs font-medium text-emerald-700/80 mt-1">Plastic Recycled</p>
          </div>
          <div className="p-2 border-l border-emerald-50">
            <p className="text-2xl lg:text-3xl font-extrabold text-emerald-900 font-serif">32%</p>
            <p className="text-xs font-medium text-emerald-700/80 mt-1">Single-Use Reduction</p>
          </div>
          <div className="p-2 border-l border-emerald-50">
            <p className="text-2xl lg:text-3xl font-extrabold text-emerald-900 font-serif">
              {users.filter((u) => u.role === 'student').length * 45}
            </p>
            <p className="text-xs font-medium text-emerald-700/80 mt-1">Active Students</p>
          </div>
          <div className="p-2 border-l border-emerald-50">
            <p className="text-2xl lg:text-3xl font-extrabold text-emerald-900 font-serif">
              {stations.length}
            </p>
            <p className="text-xs font-medium text-emerald-700/80 mt-1">Smart Stations</p>
          </div>
          <div className="p-2 border-l border-emerald-50">
            <p className="text-2xl lg:text-3xl font-extrabold text-emerald-900 font-serif">78%</p>
            <p className="text-xs font-medium text-emerald-700/80 mt-1">Recycling Efficiency</p>
          </div>
        </div>
      </section>

      {/* 5-Step Visual Workflow Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-emerald-950">
            How EcoCampus Works
          </h2>
          <p className="text-sm text-emerald-800/80 mt-2">
            A closed-loop 5-step circular lifecycle transforming campus waste into rewarded sustainability.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-2xs hover:shadow-md transition-shadow relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg mb-3">
              🌱
            </div>
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              Step 01
            </span>
            <h3 className="text-base font-bold text-emerald-950 mt-1">1. Reduce</h3>
            <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
              Adopt stainless flasks, canvas totes, and reusable cutlery. Prevent waste at the source.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-2xs hover:shadow-md transition-shadow relative">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-lg mb-3">
              🗑️
            </div>
            <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
              Step 02
            </span>
            <h3 className="text-base font-bold text-emerald-950 mt-1">2. Collect</h3>
            <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
              Deposit plastic at 6 IoT-monitored smart collection bins across quads, labs, and canteens.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-2xs hover:shadow-md transition-shadow relative">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold text-lg mb-3">
              📑
            </div>
            <span className="text-[11px] font-bold text-cyan-700 uppercase tracking-wider">
              Step 03
            </span>
            <h3 className="text-base font-bold text-emerald-950 mt-1">3. Segregate</h3>
            <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
              Classify PET bottles, containers, and polythene to preserve recycling stream purity.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-2xs hover:shadow-md transition-shadow relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg mb-3">
              ♻️
            </div>
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              Step 04
            </span>
            <h3 className="text-base font-bold text-emerald-950 mt-1">4. Recycle</h3>
            <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
              Worker logistics batch verified plastic for campus fabrication and certified recyclers.
            </p>
          </div>

          {/* Step 5 */}
          <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-2xs hover:shadow-md transition-shadow relative">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg mb-3">
              🏆
            </div>
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
              Step 05
            </span>
            <h3 className="text-base font-bold text-emerald-950 mt-1">5. Reward</h3>
            <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
              Students redeem green points for certificates, canteen discounts, merchandise, and saplings.
            </p>
          </div>
        </div>
      </section>

      {/* 3 User Role Showcase Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-emerald-950">
            Tailored Experiences for Campus Roles
          </h2>
          <p className="text-xs sm:text-sm text-emerald-800/80 mt-1">
            Empowering students, administrators, and sanitation workers in one unified platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Student Card */}
          <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-emerald-950">Student Portal</h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Log plastic drops, monitor your personal carbon offset, rise on campus leaderboards,
                and earn redeemable eco-rewards.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-emerald-900/90 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Interactive Plastic Drop Logging</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Gamified Eco Points & Badges</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Reusable Alternatives & Pledges</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => {
                switchRole('student');
                setCurrentView('student-dashboard');
              }}
              className="mt-6 w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Launch Student View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Admin Card */}
          <div className="bg-white rounded-2xl p-6 border border-amber-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-emerald-950">College & Admin Portal</h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Real-time campus monitoring, automated bin threshold alerts (&gt;80% and 100%),
                station management, and audit-ready environmental reports.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-emerald-900/90 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Real-time KPI & Station Fill Tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Smart Automated Alerts & Dispatch</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>PDF & CSV Environmental Audits</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => {
                switchRole('admin');
                setCurrentView('admin-dashboard');
              }}
              className="mt-6 w-full py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Launch Admin View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Worker Card */}
          <div className="bg-white rounded-2xl p-6 border border-blue-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-emerald-950">Sanitation Worker Portal</h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Mobile-optimized logistics interface for emptying bins, recording weighed quantities,
                and updating segregation & recycling queues.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-emerald-900/90 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Assigned Stations & Quick Pickup</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>One-Touch Capacity Resets</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Batch Segregation Verification</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => {
                switchRole('worker');
                setCurrentView('worker-dashboard');
              }}
              className="mt-6 w-full py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Launch Worker View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Call to Action Footer Section */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
            <Recycle className="w-96 h-96" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif">
            Ready to Transform Your College Campus?
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-3 max-w-xl mx-auto leading-relaxed">
            Join hundreds of proactive students, faculty, and sanitation staff driving tangible,
            plastic-free campus sustainability today.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                switchRole('student');
                setCurrentView('student-dashboard');
              }}
              className="px-6 py-2.5 rounded-xl bg-white text-emerald-950 hover:bg-emerald-50 text-xs font-bold shadow-sm transition-all"
            >
              Open Student Portal
            </button>
            <button
              onClick={() => setCurrentView('smart-collection')}
              className="px-6 py-2.5 rounded-xl bg-emerald-700/80 hover:bg-emerald-700 text-white text-xs font-bold border border-emerald-500/50 transition-all"
            >
              Explore Collection Map
            </button>
          </div>
        </div>
      </section>

      {/* Hackathon Project Credits Footer */}
      <footer className="border-t border-emerald-200/60 py-6 text-center text-xs text-emerald-800/80">
        <p className="font-semibold text-emerald-950">EcoCampus – Plastic-Free College Management System</p>
        <p className="mt-1 text-[11px] text-gray-500">
          WEBSPRINT 2026 Hackathon Prototype • Reduce • Reuse • Recycle • Reward
        </p>
      </footer>
    </div>
  );
};
