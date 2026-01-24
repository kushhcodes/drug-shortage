import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity, Eye, EyeOff, ArrowLeft, AlertCircle, Building2, Mail, Phone, MapPin, Shield } from 'lucide-react';
import { login, register } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';

type AuthMode = 'login' | 'register';

interface RegistrationData {
  hospitalName: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  confirmPassword: string;
}

const initialRegistrationData: RegistrationData = {
  hospitalName: '',
  email: '',
  phone: '',
  address: '',
  password: '',
  confirmPassword: '',
};

const Login = () => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [registrationData, setRegistrationData] = useState<RegistrationData>(initialRegistrationData);
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      await refreshUser();
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Invalid credentials. Please check your email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!registrationData.hospitalName) { setError('Hospital Name is required'); return; }
    if (!registrationData.email) { setError('Email is required'); return; }
    if (!registrationData.phone) { setError('Phone is required'); return; }
    if (!registrationData.address) { setError('Address is required'); return; }
    if (!registrationData.password) { setError('Password is required'); return; }

    if (registrationData.password !== registrationData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (registrationData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 1. Create User
      // Note: We are using email as username here for simplicity, or splitting email
      const username = registrationData.email.split('@')[0] + Math.floor(Math.random() * 1000);

      const payload = {
        username: username,
        email: registrationData.email,
        password: registrationData.password,
        password_confirm: registrationData.confirmPassword,
        phone: registrationData.phone,
        role: 'HOSPITAL_ADMIN',
        hospital_name: registrationData.hospitalName,
        address: registrationData.address,
        first_name: 'Admin',
        last_name: 'User'
      };

      await register(payload);

      // 2. Auto Login
      await login(registrationData.email, registrationData.password);
      await refreshUser();

      window.location.href = '/dashboard';

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateRegistrationData = (field: keyof RegistrationData, value: string) => {
    setRegistrationData(prev => ({ ...prev, [field]: value }));
  };

  const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;

    if (strength <= 25) return { strength, label: 'Weak', color: 'bg-red-500' };
    if (strength <= 50) return { strength, label: 'Fair', color: 'bg-yellow-500' };
    if (strength <= 75) return { strength, label: 'Good', color: 'bg-[#206095]' };
    return { strength, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(registrationData.password);

  const isFormValid =
    registrationData.hospitalName &&
    registrationData.email &&
    registrationData.phone &&
    registrationData.address &&
    registrationData.password &&
    registrationData.password === registrationData.confirmPassword &&
    registrationData.password.length >= 8;

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#206095] relative overflow-hidden">
        {/* Content */}
        <motion.div
          key={authMode}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col justify-center px-16 w-full"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Activity className="w-10 h-10 text-white" />
            </div>
            <span className="text-4xl font-bold text-white tracking-tight">MedPredict</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-5xl font-bold text-white mb-6 leading-tight"
          >
            {authMode === 'login' ? 'Welcome Back' : 'Join Our Network'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-xl text-blue-100 mb-8 leading-relaxed"
          >
            {authMode === 'login'
              ? 'Access your AI-powered dashboard for drug shortage predictions and inventory management.'
              : 'Connect your hospital to our intelligent drug shortage prediction system and never face unexpected shortages again.'
            }
          </motion.p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-white">300+</div>
              <div className="text-blue-200 text-sm">Hospitals</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-white">91%</div>
              <div className="text-blue-200 text-sm">Accuracy</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-white">24/7</div>
              <div className="text-blue-200 text-sm">Monitoring</div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="p-3 bg-[#206095] rounded-xl">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-800">MedPredict</span>
          </div>

          <Card className="border-0 shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-xl">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-3xl font-bold text-slate-800">
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </CardTitle>
              <CardDescription className="text-slate-500">
                {authMode === 'login'
                  ? 'Enter your credentials to access your dashboard'
                  : 'Register your hospital to get started'
                }
              </CardDescription>
            </CardHeader>

            <CardContent>
              {/* Auth Mode Toggle */}
              <div className="flex rounded-xl bg-slate-100 p-1 mb-8">
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setError(''); }}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${authMode === 'login'
                    ? 'bg-white text-[#206095] shadow-md'
                    : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('register'); setError(''); }}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${authMode === 'register'
                    ? 'bg-white text-[#206095] shadow-md'
                    : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  Register
                </button>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm mb-6">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  {error}
                </div>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={authMode}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {authMode === 'login' ? (
                    <form onSubmit={handleLoginSubmit} className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#206095] transition-colors" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="admin@hospital.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="pl-12 py-3 bg-slate-50 border-slate-200 focus:border-[#206095] focus:ring-[#206095] transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                        <div className="relative group">
                          <Shield className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#206095] transition-colors" />
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="pl-12 pr-12 py-3 bg-slate-50 border-slate-200 focus:border-[#206095] focus:ring-[#206095] transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <Checkbox id="remember" className="border-slate-300 text-[#206095] focus:ring-[#206095]" />
                          <span className="text-slate-600">Remember me</span>
                        </label>
                        <a href="#" className="text-[#206095] hover:text-[#164875] font-medium">Forgot password?</a>
                      </div>

                      <Button
                        type="submit"
                        className="w-full py-3 bg-[#206095] hover:bg-[#164875] text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-200"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                      </Button>

                      <p className="text-center text-sm text-slate-600">
                        Don't have an account?{' '}
                        <button
                          type="button"
                          onClick={() => setAuthMode('register')}
                          className="text-[#206095] hover:text-[#164875] font-semibold"
                        >
                          Register now
                        </button>
                      </p>
                    </form>
                  ) : (
                    <form onSubmit={handleRegistrationSubmit} className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="hospitalName" className="text-slate-700 font-medium">Hospital / Organization *</Label>
                        <div className="relative group">
                          <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#206095] transition-colors" />
                          <Input
                            id="hospitalName"
                            placeholder="City General Hospital"
                            value={registrationData.hospitalName}
                            onChange={(e) => updateRegistrationData('hospitalName', e.target.value)}
                            required
                            className="pl-12 py-3 bg-slate-50 border-slate-200 focus:border-[#206095] focus:ring-[#206095] transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="regEmail" className="text-slate-700 font-medium">Email Address *</Label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#206095] transition-colors" />
                          <Input
                            id="regEmail"
                            type="email"
                            placeholder="admin@hospital.com"
                            value={registrationData.email}
                            onChange={(e) => updateRegistrationData('email', e.target.value)}
                            required
                            className="pl-12 py-3 bg-slate-50 border-slate-200 focus:border-[#206095] focus:ring-[#206095] transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-slate-700 font-medium">Phone *</Label>
                          <div className="relative group">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#206095] transition-colors" />
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="+1 555 000"
                              value={registrationData.phone}
                              onChange={(e) => updateRegistrationData('phone', e.target.value)}
                              required
                              className="pl-12 py-3 bg-slate-50 border-slate-200 focus:border-[#206095] focus:ring-[#206095] transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address" className="text-slate-700 font-medium">Address *</Label>
                          <div className="relative group">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#206095] transition-colors" />
                            <Input
                              id="address"
                              placeholder="Location"
                              value={registrationData.address}
                              onChange={(e) => updateRegistrationData('address', e.target.value)}
                              required
                              className="pl-12 py-3 bg-slate-50 border-slate-200 focus:border-[#206095] focus:ring-[#206095] transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="regPassword" className="text-slate-700 font-medium">Password *</Label>
                        <div className="relative group">
                          <Shield className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#206095] transition-colors" />
                          <Input
                            id="regPassword"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Create password"
                            value={registrationData.password}
                            onChange={(e) => updateRegistrationData('password', e.target.value)}
                            required
                            className="pl-12 pr-12 py-3 bg-slate-50 border-slate-200 focus:border-[#206095] focus:ring-[#206095] transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                        {registrationData.password && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Progress value={passwordStrength.strength} className={`h-2 flex-1 ${passwordStrength.color}`} />
                              <span className={`text-xs font-medium ${passwordStrength.label === 'Weak' ? 'text-red-500' : passwordStrength.label === 'Fair' ? 'text-yellow-500' : passwordStrength.label === 'Good' ? 'text-[#206095]' : 'text-green-500'}`}>{passwordStrength.label}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">Confirm Password *</Label>
                        <div className="relative group">
                          <Shield className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#206095] transition-colors" />
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm password"
                            value={registrationData.confirmPassword}
                            onChange={(e) => updateRegistrationData('confirmPassword', e.target.value)}
                            required
                            className="pl-12 pr-12 py-3 bg-slate-50 border-slate-200 focus:border-[#206095] focus:ring-[#206095] transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                        {registrationData.confirmPassword && registrationData.password !== registrationData.confirmPassword && (
                          <p className="text-xs text-red-500">Passwords do not match</p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        className="w-full py-3 bg-[#206095] hover:bg-[#164875] text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-200"
                        disabled={isLoading || !isFormValid}
                      >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                      </Button>

                      <p className="text-center text-sm text-slate-600">
                        Already have an account?{' '}
                        <button
                          type="button"
                          onClick={() => setAuthMode('login')}
                          className="text-[#206095] hover:text-[#164875] font-semibold"
                        >
                          Sign in
                        </button>
                      </p>
                    </form>
                  )}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Back to Home */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 mt-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
