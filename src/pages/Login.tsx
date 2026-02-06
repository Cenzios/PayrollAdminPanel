import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser, clearError, logout } from '../store/authSlice';
import { Mail, Lock, Loader2 } from 'lucide-react';
import logo from '../assets/images/logo.svg';
import illustrationAsset from '../assets/images/Ilustration-Asset.svg';
import mainImage from '../assets/images/Image.svg';
import kit2 from '../assets/images/Kit 2.svg';
import bgIllustration from '../assets/images/Background-illustration.svg';

interface LoginProps {
    onLoginSuccess: () => void;
}

const Login = ({ onLoginSuccess }: LoginProps) => {
    const dispatch = useAppDispatch();
    const { isLoading, error, token } = useAppSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [validationErrors, setValidationErrors] = useState({
        email: '',
        password: '',
    });

    // Clear any existing session when user visits login page
    useEffect(() => {
        if (token) {
            dispatch(logout());
        }
    }, []);

    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    const validateForm = () => {
        const errors = {
            email: '',
            password: '',
        };

        if (!formData.email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        }

        setValidationErrors(errors);
        return !errors.email && !errors.password;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setValidationErrors((prev) => ({
            ...prev,
            [name]: '',
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            const result = await dispatch(loginUser(formData));
            if (loginUser.fulfilled.match(result)) {
                onLoginSuccess();
            }
        }
    };

    return (
        <div className="min-h-screen flex font-sans">
            {/* Left Side - Grey Background with Illustrations */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#F8F9FA] relative items-center justify-center p-12 overflow-hidden">
                {/* Logo */}
                <div className="absolute top-12 left-12">
                    <div className="flex items-center gap-2">
                        <img src={logo} alt="Payroll Logo" className="h-8 md:h-10" />
                    </div>
                </div>

                {/* Center Composition */}
                <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
                    {/* Bottom layer - Kit 2 */}
                    <div className="absolute bottom-[-200px] right-[-250px] -translate-x-1/2 -translate-y-1/2 z-10">
                        <img
                            src={kit2}
                            alt="Dashboard UI"
                            className="w-[30] h-auto object-contain animate-float"
                        />
                    </div>

                    {/* Middle layer - Illustration Asset */}
                    <div className="absolute top-[450px] left-[550px] -translate-x-1/2 -translate-y-1/2 w-full h-full z-0">
                        <img
                            src={illustrationAsset}
                            alt="Background Elements"
                            className="w-full h-full object-contain animate-float-slow"
                        />
                    </div>

                    {/* Top layer - Main Image */}
                    <div className="absolute top-80 left-[250px] -translate-x-1/2 -translate-y-1/2 z-20">
                        <img
                            src={mainImage}
                            alt="User Profile"
                            className="w-[80] h-auto object-contain animate-float"
                        />
                    </div>
                </div>

                {/* Background Waves - Bottom Left */}
                <div className="absolute bottom-[-290px] -left-40 w-[520px] h-[520px] z-0 pointer-events-none">
                    <img
                        src={bgIllustration}
                        alt="Background Wave"
                        className="w-full h-full object-contain"
                    />
                </div>
            </div>

            {/* Right Side - White Background with Form */}
            <div className="flex-1 flex flex-col justify-center px-4 py-12 bg-white relative overflow-hidden">
                {/* Background Waves - Top Right */}
                <div className="absolute -top-60 -right-28 w-96 h-96 z-0 opacity-100 pointer-events-none">
                    <img
                        src={bgIllustration}
                        alt="Background Wave"
                        className="w-full h-full object-contain rotate-180"
                    />
                </div>

                <div className="w-full max-w-md mx-auto relative z-10 animate-fadeInUp">
                    <div className="mb-8">
                        {/* Mobile Logo */}
                        <div className="absolute top-[-50px] left-[-10px]">
                            <div className="flex items-center gap-2">
                                <img src={logo} alt="Payroll Logo" className="h-8 md:h-10" />
                            </div>
                        </div>

                        <h2 className="text-[28px] font-medium text-gray-900 leading-tight">
                            Welcome back!
                        </h2>
                        <p className="text-gray-500 mt-3 text-[16px] font-normal leading-[1.7]">
                            Please login to access your account.
                        </p>
                    </div>

                    <div className="animate-fadeIn">
                        {error && (
                            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 mt-6 mb-2"
                                >
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`block w-full pl-10 pr-3 py-3 border ${validationErrors.email
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                            } rounded-lg focus:outline-none focus:ring-2 transition-colors`}
                                        placeholder="you@example.com"
                                    />
                                </div>
                                {validationErrors.email && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {validationErrors.email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`block w-full pl-10 pr-3 py-3 border ${validationErrors.password
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                            } rounded-lg focus:outline-none focus:ring-2 transition-colors`}
                                        placeholder="••••••••"
                                    />
                                </div>
                                {validationErrors.password && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {validationErrors.password}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#3A8BFF] text-white font-semibold py-3 px-4 rounded-lg hover:bg-[#337AEB] focus:outline-none focus:ring-2 focus:ring-[#3A8BFF] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
