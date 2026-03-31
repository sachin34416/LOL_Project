import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import useToastStore from '../store/toastStore';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'player', // Default role
  });

  const navigate = useNavigate();
  const { register, loading } = useAuthStore();
  const addToast = useToastStore((state) => state.addToast);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      addToast('Passwords do not match', 'error');
      return;
    }

    if (formData.password.length < 6) {
      addToast('Password must be at least 6 characters', 'error');
      return;
    }

    try {
      const result = await register(formData.name, formData.email, formData.password, formData.confirmPassword, formData.role);
      if (result.success) {
        addToast('Registration successful! Logging in...', 'success');
        
        // Check if player needs to register
        const { user, needsPlayerRegistration } = useAuthStore.getState();
        if (needsPlayerRegistration(user)) {
          navigate('/player-registration');
        } else {
          navigate('/');
        }
      } else {
        addToast(result.message, 'error');
      }
    } catch (error) {
      addToast('Registration failed', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md border border-gray-300">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-red-600 mb-2">
            League of Legends
          </h1>
          <p className="text-gray-700">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-500"
                placeholder="Enter your name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-500"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-500"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-500"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="player">Player</option>
              <option value="organizer">Tournament Organizer</option>
              <option value="franchise_owner">Franchise Owner</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow"
          >
            {loading ? 'Processing...' : 'Register'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-700">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;