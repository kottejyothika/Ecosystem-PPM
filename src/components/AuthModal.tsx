import React, { useState } from 'react';
import {
  Recycle,
  X,
  Lock,
  Mail,
  User as UserIcon,
  Building,
  GraduationCap,
  Shield,
  Briefcase,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useEcoCampus } from '../context/EcoCampusContext';
import { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register, switchRole, setCurrentView, setToast } = useEcoCampus();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      const ok = login(email || (selectedRole === 'admin' ? 'sustainability.lead@campus.edu' : selectedRole === 'worker' ? 'ramesh.wasteops@campus.edu' : 'aarav.sharma@campus.edu'), selectedRole);
      if (ok) onClose();
    } else {
      const ok = register(name, email, selectedRole, department);
      if (ok) onClose();
    }
  };

  const handleDemoLogin = (role: UserRole) => {
    switchRole(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo & Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white mx-auto shadow-md shadow-emerald-600/20 mb-3">
            <Recycle className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold font-serif text-emerald-950">EcoCampus Portal</h2>
          <p className="text-xs text-emerald-700/80 mt-0.5">Reduce • Reuse • Recycle • Reward</p>
        </div>

        {/* 1-Click Demo Login Bar */}
        <div className="mb-6 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-center">
          <p className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider mb-2">
            🚀 1-Click Instant Demo Login
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              id="demo-btn-student"
              type="button"
              onClick={() => handleDemoLogin('student')}
              className="px-2 py-2 rounded-xl bg-white border border-emerald-200 hover:bg-emerald-100 text-emerald-950 text-xs font-semibold flex flex-col items-center gap-1 shadow-2xs transition-all"
            >
              <GraduationCap className="w-4 h-4 text-emerald-700" />
              <span>Student</span>
            </button>
            <button
              id="demo-btn-admin"
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="px-2 py-2 rounded-xl bg-white border border-amber-200 hover:bg-amber-100 text-amber-950 text-xs font-semibold flex flex-col items-center gap-1 shadow-2xs transition-all"
            >
              <Shield className="w-4 h-4 text-amber-700" />
              <span>Admin</span>
            </button>
            <button
              id="demo-btn-worker"
              type="button"
              onClick={() => handleDemoLogin('worker')}
              className="px-2 py-2 rounded-xl bg-white border border-blue-200 hover:bg-blue-100 text-blue-950 text-xs font-semibold flex flex-col items-center gap-1 shadow-2xs transition-all"
            >
              <Briefcase className="w-4 h-4 text-blue-700" />
              <span>Worker</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-gray-100 p-1 mb-5">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === 'login' ? 'bg-white text-emerald-950 shadow-2xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === 'register' ? 'bg-white text-emerald-950 shadow-2xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Role selector */}
          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Select Your Campus Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole('student')}
                className={`py-1.5 px-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                  selectedRole === 'student'
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`py-1.5 px-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                  selectedRole === 'admin'
                    ? 'bg-amber-100 border-amber-500 text-amber-950 font-bold'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('worker')}
                className={`py-1.5 px-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                  selectedRole === 'worker'
                    ? 'bg-blue-100 border-blue-500 text-blue-950 font-bold'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                Worker
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Academic Department</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="e.g. Computer Science / Env Studies"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Campus Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                placeholder={
                  selectedRole === 'admin'
                    ? 'sustainability.lead@campus.edu'
                    : selectedRole === 'worker'
                    ? 'ramesh.wasteops@campus.edu'
                    : 'aarav.sharma@campus.edu'
                }
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-gray-700">Password</label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => {
                    setForgotSent(true);
                    setToast({
                      message: 'Password reset instructions sent to your campus email!',
                      type: 'info',
                    });
                  }}
                  className="text-[11px] text-emerald-700 hover:underline"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
              />
            </div>
          </div>

          {forgotSent && (
            <p className="text-[11px] text-emerald-700 bg-emerald-50 p-2 rounded-lg flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Password reset link sent to {email || 'your email'}.
            </p>
          )}

          <button
            type="submit"
            className="w-full mt-2 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-colors"
          >
            <span>{mode === 'login' ? 'Sign In to Dashboard' : 'Complete Registration & Claim +150 Pts'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
