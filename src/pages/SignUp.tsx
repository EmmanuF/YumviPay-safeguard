
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Header from '@/components/Header';
import { registerUser } from '@/services/auth';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    country: 'CM', // Default to Cameroon as receiving country
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Basic form validation
      if (!formData.name.trim()) {
        throw new Error('Please enter your full name');
      }
      
      if (!formData.email.trim()) {
        throw new Error('Please enter your email address');
      }
      
      if (!formData.password) {
        throw new Error('Please enter a password');
      }

      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      console.log('Starting registration process with:', {
        name: formData.name,
        email: formData.email,
        phone: formData.phoneNumber,
        country: formData.country
      });
      
      await registerUser(
        formData.name,
        formData.email,
        formData.phoneNumber,
        formData.country,
        formData.password // Pass the user-defined password to registerUser
      );

      toast({
        title: "Account created",
        description: "Your account has been created successfully.",
      });

      // Navigate to the onboarding page after signup
      navigate('/onboarding');
    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error.message || "Registration failed. Please try again.");
      
      toast({
        title: "Sign up failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary-50 to-white">
      <Header title="Sign Up" />
      
      <div className="flex-1 flex flex-col px-4 py-6 max-w-md mx-auto w-full">
        {error && (
          <div className="mb-4 p-3 bg-destructive/15 border border-destructive rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 text-destructive mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSignUp} className="flex flex-col space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Use a valid email address you can access
            </p>
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
              />
              <button 
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Password must be at least 6 characters
            </p>
          </div>
          
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
              <button 
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <div>
            <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
            <p className="text-xs text-gray-500 mt-1">
              This field is optional
            </p>
          </div>
          
          <Button type="submit" disabled={isLoading} className="mt-2">
            {isLoading ? "Creating Account..." : "Sign Up"}
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/signin" className="text-primary-600 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
