import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity, Eye, EyeOff, ArrowLeft, AlertCircle, Check, ChevronRight, ChevronLeft, Building2, Mail, Phone, MapPin, Shield, FileCheck, Stethoscope } from 'lucide-react';
import { login } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';

type AuthMode = 'login' | 'register';

interface RegistrationData {
  // Step 1: Basic Info + Contact
  hospitalName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  password: string;
  confirmPassword: string;
  
  // Step 2: Medical Capabilities
  hospitalType: string;
  bedCapacity: string;
  specializations: string[];
  emergencyServices: boolean;
  pharmacyOnSite: boolean;
  icuAvailable: boolean;
  
  // Step 3: Verification & Compliance
  licenseNumber: string;
  accreditation: string;
  complianceCertifications: string[];
  agreeToTerms: boolean;
  agreeToDataSharing: boolean;
}

const initialRegistrationData: RegistrationData = {
  hospitalName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  password: '',
  confirmPassword: '',
  hospitalType: '',
  bedCapacity: '',
  specializations: [],
  emergencyServices: false,
  pharmacyOnSite: false,
  icuAvailable: false,
  licenseNumber: '',
  accreditation: '',
  complianceCertifications: [],
  agreeToTerms: false,
  agreeToDataSharing: false,
};

const specializations = [
  'General Medicine',
  'Cardiology',
  'Oncology',
  'Pediatrics',
  'Orthopedics',
  'Neurology',
  'Emergency Care',
  'Surgery',
];

const certifications = [
  'HIPAA Compliance',
  'JCI Accreditation',
  'ISO 9001',
  'NABH Certification',
];

const Login = () => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [registrationStep, setRegistrationStep] = useState(1);
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
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials. Please check your email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate registration - in real app, this would call a registration API
    setTimeout(() => {
      setIsLoading(false);
      setAuthMode('login');
      setEmail(registrationData.email);
    }, 1500);
  };

  const updateRegistrationData = (field: keyof RegistrationData, value: any) => {
    setRegistrationData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSpecialization = (spec: string) => {
    setRegistrationData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter(s => s !== spec)
        : [...prev.specializations, spec]
    }));
  };

  const toggleCertification = (cert: string) => {
    setRegistrationData(prev => ({
      ...prev,
      complianceCertifications: prev.complianceCertifications.includes(cert)
        ? prev.complianceCertifications.filter(c => c !== cert)
        : [...prev.complianceCertifications, cert]
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          registrationData.hospitalName &&
          registrationData.email &&
          registrationData.phone &&
          registrationData.address &&
          registrationData.city &&
          registrationData.state &&
          registrationData.password &&
          registrationData.password === registrationData.confirmPassword &&
          registrationData.password.length >= 8
        );
      case 2:
        return !!(
          registrationData.hospitalType &&
          registrationData.bedCapacity &&
          registrationData.specializations.length > 0
        );
      case 3:
        return !!(
          registrationData.licenseNumber &&
          registrationData.accreditation &&
          registrationData.agreeToTerms
        );
      default:
        return false;
    }
  };

  const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;

    if (strength <= 25) return { strength, label: 'Weak', color: 'bg-destructive' };
    if (strength <= 50) return { strength, label: 'Fair', color: 'bg-yellow-500' };
    if (strength <= 75) return { strength, label: 'Good', color: 'bg-blue-500' };
    return { strength, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(registrationData.password);

  const stepInfo = [
    { title: 'Basic Info', icon: Building2 },
    { title: 'Medical Capabilities', icon: Stethoscope },
    { title: 'Verification', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <Card className="bg-card border-border shadow-lg">
          <CardHeader className="text-center pb-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="p-3 rounded-xl bg-primary">
                <Activity className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl">
              {authMode === 'login' ? 'Welcome Back' : 'Register Your Hospital'}
            </CardTitle>
            <CardDescription>
              {authMode === 'login' 
                ? 'Sign in to access the MedPredict dashboard'
                : 'Join the network of hospitals using AI-powered inventory management'
              }
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Auth Mode Toggle */}
            <div className="flex rounded-lg bg-muted p-1 mb-6">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  authMode === 'login'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  authMode === 'register'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Register
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm mb-4">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {authMode === 'login' ? (
              /* Login Form */
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-background pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-background pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox id="remember" />
                    <span className="text-muted-foreground">Remember me</span>
                  </label>
                  <a href="#" className="text-primary hover:underline">Forgot password?</a>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('register')}
                    className="text-primary hover:underline font-medium"
                  >
                    Register now
                  </button>
                </p>
              </form>
            ) : (
              /* Registration Form */
              <form onSubmit={handleRegistrationSubmit} className="space-y-6">
                {/* Step Indicator */}
                <div className="flex items-center justify-between mb-2">
                  {stepInfo.map((step, index) => (
                    <div key={index} className="flex items-center">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                        registrationStep > index + 1
                          ? 'bg-primary border-primary text-primary-foreground'
                          : registrationStep === index + 1
                          ? 'border-primary text-primary bg-primary/10'
                          : 'border-muted text-muted-foreground'
                      }`}>
                        {registrationStep > index + 1 ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <step.icon className="h-5 w-5" />
                        )}
                      </div>
                      {index < stepInfo.length - 1 && (
                        <div className={`w-16 md:w-24 h-1 mx-2 rounded ${
                          registrationStep > index + 1 ? 'bg-primary' : 'bg-muted'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  Step {registrationStep} of 3: {stepInfo[registrationStep - 1].title}
                </p>

                {/* Step 1: Basic Info + Contact */}
                {registrationStep === 1 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="hospitalName">Hospital / Organization Name *</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="hospitalName"
                          placeholder="City General Hospital"
                          value={registrationData.hospitalName}
                          onChange={(e) => updateRegistrationData('hospitalName', e.target.value)}
                          required
                          className="bg-background pl-10"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="regEmail">Email Address *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="regEmail"
                            type="email"
                            placeholder="admin@hospital.com"
                            value={registrationData.email}
                            onChange={(e) => updateRegistrationData('email', e.target.value)}
                            required
                            className="bg-background pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            value={registrationData.phone}
                            onChange={(e) => updateRegistrationData('phone', e.target.value)}
                            required
                            className="bg-background pl-10"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Textarea
                          id="address"
                          placeholder="123 Medical Center Drive"
                          value={registrationData.address}
                          onChange={(e) => updateRegistrationData('address', e.target.value)}
                          required
                          className="bg-background pl-10 min-h-[60px]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          placeholder="New York"
                          value={registrationData.city}
                          onChange={(e) => updateRegistrationData('city', e.target.value)}
                          required
                          className="bg-background"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          placeholder="NY"
                          value={registrationData.state}
                          onChange={(e) => updateRegistrationData('state', e.target.value)}
                          required
                          className="bg-background"
                        />
                      </div>
                      <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          placeholder="10001"
                          value={registrationData.zipCode}
                          onChange={(e) => updateRegistrationData('zipCode', e.target.value)}
                          className="bg-background"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="regPassword">Password *</Label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="regPassword"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Create a strong password"
                          value={registrationData.password}
                          onChange={(e) => updateRegistrationData('password', e.target.value)}
                          required
                          className="bg-background pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {registrationData.password && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Progress value={passwordStrength.strength} className="h-2 flex-1" />
                            <span className={`text-xs font-medium ${
                              passwordStrength.strength <= 25 ? 'text-destructive' :
                              passwordStrength.strength <= 50 ? 'text-yellow-600' :
                              passwordStrength.strength <= 75 ? 'text-blue-600' : 'text-green-600'
                            }`}>
                              {passwordStrength.label}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Use 8+ characters with uppercase, numbers & symbols
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirm your password"
                          value={registrationData.confirmPassword}
                          onChange={(e) => updateRegistrationData('confirmPassword', e.target.value)}
                          required
                          className="bg-background pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {registrationData.confirmPassword && registrationData.password !== registrationData.confirmPassword && (
                        <p className="text-xs text-destructive">Passwords do not match</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Medical Capabilities */}
                {registrationStep === 2 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Hospital Type *</Label>
                        <Select
                          value={registrationData.hospitalType}
                          onValueChange={(value) => updateRegistrationData('hospitalType', value)}
                        >
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Hospital</SelectItem>
                            <SelectItem value="specialty">Specialty Hospital</SelectItem>
                            <SelectItem value="teaching">Teaching Hospital</SelectItem>
                            <SelectItem value="community">Community Hospital</SelectItem>
                            <SelectItem value="clinic">Clinic / Medical Center</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Bed Capacity *</Label>
                        <Select
                          value={registrationData.bedCapacity}
                          onValueChange={(value) => updateRegistrationData('bedCapacity', value)}
                        >
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select capacity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Small (1-50 beds)</SelectItem>
                            <SelectItem value="medium">Medium (51-200 beds)</SelectItem>
                            <SelectItem value="large">Large (201-500 beds)</SelectItem>
                            <SelectItem value="major">Major (500+ beds)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Specializations * (Select all that apply)</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {specializations.map((spec) => (
                          <label
                            key={spec}
                            className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                              registrationData.specializations.includes(spec)
                                ? 'border-primary bg-primary/5 text-foreground'
                                : 'border-border hover:border-muted-foreground'
                            }`}
                          >
                            <Checkbox
                              checked={registrationData.specializations.includes(spec)}
                              onCheckedChange={() => toggleSpecialization(spec)}
                            />
                            <span className="text-sm">{spec}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Facilities Available</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                          registrationData.emergencyServices
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-muted-foreground'
                        }`}>
                          <Checkbox
                            checked={registrationData.emergencyServices}
                            onCheckedChange={(checked) => updateRegistrationData('emergencyServices', checked)}
                          />
                          <div>
                            <p className="text-sm font-medium">24/7 Emergency</p>
                            <p className="text-xs text-muted-foreground">Round-the-clock ER</p>
                          </div>
                        </label>
                        <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                          registrationData.pharmacyOnSite
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-muted-foreground'
                        }`}>
                          <Checkbox
                            checked={registrationData.pharmacyOnSite}
                            onCheckedChange={(checked) => updateRegistrationData('pharmacyOnSite', checked)}
                          />
                          <div>
                            <p className="text-sm font-medium">On-Site Pharmacy</p>
                            <p className="text-xs text-muted-foreground">In-house dispensary</p>
                          </div>
                        </label>
                        <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                          registrationData.icuAvailable
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-muted-foreground'
                        }`}>
                          <Checkbox
                            checked={registrationData.icuAvailable}
                            onCheckedChange={(checked) => updateRegistrationData('icuAvailable', checked)}
                          />
                          <div>
                            <p className="text-sm font-medium">ICU Available</p>
                            <p className="text-xs text-muted-foreground">Intensive care unit</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Verification & Compliance */}
                {registrationStep === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="licenseNumber">Hospital License Number *</Label>
                      <div className="relative">
                        <FileCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="licenseNumber"
                          placeholder="Enter your license number"
                          value={registrationData.licenseNumber}
                          onChange={(e) => updateRegistrationData('licenseNumber', e.target.value)}
                          required
                          className="bg-background pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Accreditation Status *</Label>
                      <Select
                        value={registrationData.accreditation}
                        onValueChange={(value) => updateRegistrationData('accreditation', value)}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select accreditation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="jci">JCI Accredited</SelectItem>
                          <SelectItem value="nabh">NABH Accredited</SelectItem>
                          <SelectItem value="state">State Licensed Only</SelectItem>
                          <SelectItem value="pending">Accreditation Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Compliance Certifications</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {certifications.map((cert) => (
                          <label
                            key={cert}
                            className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                              registrationData.complianceCertifications.includes(cert)
                                ? 'border-primary bg-primary/5 text-foreground'
                                : 'border-border hover:border-muted-foreground'
                            }`}
                          >
                            <Checkbox
                              checked={registrationData.complianceCertifications.includes(cert)}
                              onCheckedChange={() => toggleCertification(cert)}
                            />
                            <span className="text-sm">{cert}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-border">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <Checkbox
                          checked={registrationData.agreeToTerms}
                          onCheckedChange={(checked) => updateRegistrationData('agreeToTerms', checked)}
                          className="mt-0.5"
                        />
                        <span className="text-sm text-muted-foreground">
                          I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a> *
                        </span>
                      </label>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <Checkbox
                          checked={registrationData.agreeToDataSharing}
                          onCheckedChange={(checked) => updateRegistrationData('agreeToDataSharing', checked)}
                          className="mt-0.5"
                        />
                        <span className="text-sm text-muted-foreground">
                          I consent to sharing inventory data with the network for shortage prediction and redistribution recommendations
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-3 pt-2">
                  {registrationStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setRegistrationStep(prev => prev - 1)}
                      className="flex-1"
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                  )}
                  {registrationStep < 3 ? (
                    <Button
                      type="button"
                      onClick={() => setRegistrationStep(prev => prev + 1)}
                      disabled={!validateStep(registrationStep)}
                      className="flex-1"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isLoading || !validateStep(3)}
                      className="flex-1"
                    >
                      {isLoading ? 'Creating Account...' : 'Complete Registration'}
                    </Button>
                  )}
                </div>

                <p className="text-center text-sm text-muted-foreground">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in here
                  </button>
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
