import { useState, useEffect } from 'react';
import { User, Mail, Lock, Eye, EyeOff, LogOut, Edit3 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/authSlice';
import { updateProfile, changePassword, clearStatus } from '../store/settingsSlice';

const Settings = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const { isLoading, error, successMessage } = useAppSelector((state) => state.settings);

    // Profile Form State
    const [profileData, setProfileData] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
    });

    // Password Form State
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    useEffect(() => {
        if (successMessage || error) {
            const timer = setTimeout(() => {
                dispatch(clearStatus());
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, error, dispatch]);

    const handleProfileUpdate = () => {
        if (!profileData.fullName || !profileData.email) return;
        dispatch(updateProfile(profileData));
    };

    const handlePasswordUpdate = () => {
        if (!passwordData.currentPassword || !passwordData.newPassword) return;
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            // Handle confirm password mismatch locally or via slice
            return;
        }
        dispatch(changePassword({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
        }));
        // Clear password fields on success
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Settings</h1>
                <p className="text-gray-500 font-medium mt-1">System Settings</p>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 space-y-8">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-gray-50">
                    <div className="flex items-center space-x-6">
                        <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center">
                            <User className="text-blue-600" size={40} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{user?.fullName || 'Admin User'}</h2>
                            <p className="text-gray-500">{user?.email || 'admin@company.com'}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-6 py-2 bg-red-50 text-red-500 rounded-2xl font-semibold hover:bg-red-100 transition-colors"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Edit Details */}
                    <div className="space-y-6">
                        <div className="space-y-4 bg-gray-50/50 p-6 rounded-[2rem] border border-gray-50">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        value={profileData.fullName}
                                        onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                                        placeholder="Enter full name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="email"
                                        value={profileData.email}
                                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                                        placeholder="Enter email address"
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    onClick={handleProfileUpdate}
                                    disabled={isLoading}
                                    className="w-full md:w-auto flex items-center justify-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-50"
                                >
                                    <Edit3 size={18} />
                                    <span>Edit Details</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Change Password */}
                    <div className="space-y-4 bg-gray-50/50 p-6 rounded-[2rem] border border-gray-50">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Current Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type={showPasswords.current ? "text" : "password"}
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                                    placeholder="Enter Current Password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type={showPasswords.new ? "text" : "password"}
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                                    placeholder="Enter New Password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Confirm New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type={showPasswords.confirm ? "text" : "password"}
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                                    placeholder="Confirm New Password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={handlePasswordUpdate}
                                disabled={isLoading}
                                className="w-full md:w-auto flex items-center justify-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-50"
                            >
                                <span>Update Password</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Global Feedback */}
                {(successMessage || error) && (
                    <div className={`p-4 rounded-2xl border ${successMessage ? 'bg-green-50 border-green-100 text-green-600' : 'bg-red-50 border-red-100 text-red-600'}`}>
                        <p className="text-center font-bold">{successMessage || error}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Settings;
