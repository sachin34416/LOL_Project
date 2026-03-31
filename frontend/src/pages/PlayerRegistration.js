import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { playerAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import useToastStore from '../store/toastStore';
import { FiPhone, FiArrowRight } from 'react-icons/fi';

const PlayerRegistration = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const addToast = useToastStore((state) => state.addToast);
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await playerAPI.registerPlayer({
        name: user.name,
        email: user.email,
        phone: formData.phone,
      });

      if (response.data.success) {
        const updatedUser = {
          ...user,
          playerId: response.data.data._id,
        };
        
        // Update user in localStorage and authStore
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        addToast('Player registration completed! Welcome!', 'success');
        navigate('/');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to register as player';
      addToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // Allow skipping for now, can be made mandatory later
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800/40 backdrop-blur-xl rounded-lg shadow-2xl p-8 w-full max-w-md border border-purple-700/50">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-2">
            Player Registration
          </h1>
          <p className="text-purple-200">
            Complete your player profile to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-slate-700/30 border border-purple-700/30 rounded-lg p-4">
            <p className="text-purple-200 text-sm">
              <span className="font-semibold text-amber-400">{user?.name}</span> ({user?.email})
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">
              <FiPhone className="inline mr-2" />
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              className="w-full px-4 py-3 bg-slate-700/50 border border-purple-600/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-purple-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-gray-500 disabled:to-gray-500 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Registering...
              </>
            ) : (
              <>
                Complete Registration
                <FiArrowRight />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleSkip}
            className="w-full text-purple-300 hover:text-amber-400 font-semibold py-2 transition-colors"
          >
            Skip for now
          </button>
        </form>
      </div>
    </div>
  );
};

export default PlayerRegistration;
