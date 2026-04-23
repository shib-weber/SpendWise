import React, { useState } from 'react';
import { api } from '../services/api';
import { ArrowLeft, Mail, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Keep this import

const Login = ({ setToken, onBack }) => {
  // 1. Correct Hook Placement (Top Level)
  const navigate = useNavigate(); 

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async () => {
    if (!email) return setError('Please enter your email');
    setLoading(true);
    setError('');
    try {
      await api.sendOtp(email);
      setStep(2);
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!otp) return setError('Please enter the OTP');
    setLoading(true);
    setError('');
    try {
      const res = await api.verifyOtp(email, otp);
      const token = res.data.access_token; 
      
      localStorage.setItem('token', token);
      setToken(token);
      
      // 2. Fixed: Use the lowercase navigate function
      navigate('/dashboard'); 
      
    } catch (err) {
      setError('Invalid OTP. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Removed the "const navigate" from here
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">
        
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-slate-400 hover:text-slate-600 mb-8 transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} /> Back to Home
        </button>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">
            {step === 1 ? 'Verify Email' : 'Check your inbox'}
          </h2>
          <p className="text-slate-500 mt-2">
            {step === 1 
              ? 'Secure access to your personal dashboard.' 
              : `We sent a 6-digit code to ${email}`}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-6 border border-red-100">
            {error}
          </div>
        )}

        {step === 1 ? (
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="email" 
                placeholder="college@university.edu" 
                className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                value={email}
                onChange={e => setEmail(e.target.value)} 
              />
            </div>
            <button 
              onClick={handleSendOtp} 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 transition-all disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Access Code'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Enter 6-digit OTP" 
                maxLength={6}
                className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none tracking-widest font-mono text-lg transition-all"
                value={otp}
                onChange={e => setOtp(e.target.value)} 
              />
            </div>
            <button 
              onClick={handleVerify} 
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-100 transition-all disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Enter'}
            </button>
            <button 
              onClick={() => setStep(1)} 
              className="w-full text-sm text-slate-400 hover:text-slate-600 mt-2"
            >
              Entered wrong email?
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;