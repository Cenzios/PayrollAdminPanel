import { useState, useEffect } from "react";
import { User, Mail, Lock, Eye, EyeOff, Edit3 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../utils/axios";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { updateUserData } from "../store/authSlice";
import { setPageTitle } from "../store/uiSlice";
import SuccessModal from "../components/SuccessModal";
import { useToast } from "../components/ToastContext";
import { validatePassword } from "../utils/valiadtions/passwordValidation";

const Settings = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { user } = useAppSelector((state) => state.auth);
  const { showToast } = useToast();

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successConfig, setSuccessConfig] = useState({
    title: "",
    message: "",
  });

  useEffect(() => {
    dispatch(setPageTitle({ title: "Settings", subtitle: "Profile Settings" }));
  }, [dispatch]);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
  });

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Check if all validations pass (for enabling Update button)
  const isPasswordFormValid = () => {
    return (
      passwordData.currentPassword !== "" &&
      passwordData.newPassword !== "" &&
      passwordData.confirmPassword !== "" &&
      passwordErrors.currentPassword === "" &&
      passwordErrors.newPassword === "" &&
      passwordErrors.confirmPassword === ""
    );
  };

  // Fetch profile details on mount
  const { data: meData } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await api.get("/auth/me");
      return response.data.data;
    },
  });

  useEffect(() => {
    if (meData) {
      setProfileData({
        fullName: meData.fullName || "",
        email: meData.email || "",
      });
      dispatch(updateUserData(meData));
    }
  }, [meData, dispatch]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { fullName: string; email: string }) => {
      const response = await api.put("/admin/settings/profile", data);
      return response.data;
    },
    onSuccess: (data) => {
      setSuccessConfig({
        title: "Update Successful",
        message: data.message || "Profile updated successfully",
      });
      setIsSuccessModalOpen(true);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (error: any) => {
      showToast(
        error.response?.data?.error || "Failed to update profile",
        "error",
      );
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.put("/admin/settings/change-password", data);
      return response.data;
    },
    onSuccess: (data) => {
      setSuccessConfig({
        title: "Update Successful",
        message: data.message || "Password changed successfully",
      });
      setIsSuccessModalOpen(true);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordErrors({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    },
    onError: (error: any) => {
      showToast(
        error.response?.data?.error || "Failed to change password",
        "error",
      );
    },
  });

  const handleProfileUpdate = () => {
    if (!profileData.fullName || !profileData.email) return;
    updateProfileMutation.mutate(profileData);
  };

  // Helper function to validate confirm password
  const validateConfirmPassword = (confirmValue: string, newValue: string) => {
    let error = "";
    if (confirmValue) {
      if (confirmValue !== newValue) {
        error = "Passwords do not match";
      }
    }
    return error;
  };

  const handlePasswordUpdate = () => {
    const currentPasswordError = passwordData.currentPassword
      ? ""
      : "Current password is required";

    let samePasswordError = "";
    if (passwordData.currentPassword && passwordData.newPassword) {
      if (passwordData.currentPassword === passwordData.newPassword) {
        samePasswordError =
          "New password must be different from current password";
      }
    }

    const passwordCheck = validatePassword(passwordData.newPassword);
    const newPasswordError = passwordData.newPassword
      ? passwordCheck.isValid
        ? ""
        : passwordCheck.errors.join(". ")
      : "New password is required";

    let confirmPasswordError = passwordData.confirmPassword
      ? ""
      : "Please confirm the new password";
    if (
      !confirmPasswordError &&
      passwordData.newPassword !== passwordData.confirmPassword
    ) {
      confirmPasswordError = "Passwords do not match";
    }

    const nextErrors = {
      currentPassword: currentPasswordError,
      newPassword: newPasswordError || samePasswordError,
      confirmPassword: confirmPasswordError,
    };

    setPasswordErrors(nextErrors);

    if (
      nextErrors.currentPassword ||
      nextErrors.newPassword ||
      nextErrors.confirmPassword
    ) {
      return;
    }

    changePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 space-y-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-50">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center">
              <User className="text-blue-600" size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {meData?.fullName || user?.fullName || "Admin User"}
              </h2>
              <p className="text-gray-500">
                {meData?.email || user?.email || "admin@company.com"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Edit Details */}
          <div className="space-y-6">
            <div className="space-y-4 bg-gray-50/50 p-6 rounded-[2rem] border border-gray-50">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    value={profileData.fullName}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        fullName: e.target.value,
                      })
                    }
                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                    placeholder="Enter full name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleProfileUpdate}
                  disabled={updateProfileMutation.isPending}
                  className="w-full md:w-auto flex items-center justify-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-50"
                >
                  <Edit3 size={18} />
                  <span>
                    {updateProfileMutation.isPending
                      ? "Updating..."
                      : "Edit Details"}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="space-y-4 bg-gray-50/50 p-6 rounded-[2rem] border border-gray-50">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">
                Current Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordData.currentPassword}
                  placeholder="Enter Current Password"
                  autoComplete="off" // Prevents browser autofill
                  onChange={(e) => {
                    const value = e.target.value;
                    setPasswordData({
                      ...passwordData,
                      currentPassword: value,
                    });
                    
                    if (value && value.length > 0) {
                      setPasswordErrors({
                        ...passwordErrors,
                        currentPassword: "",
                      });
                    }
                    
                    if (passwordData.confirmPassword) {
                      const confirmError = validateConfirmPassword(
                        passwordData.confirmPassword,
                        passwordData.newPassword
                      );
                      setPasswordErrors((prev) => ({
                        ...prev,
                        confirmPassword: confirmError,
                      }));
                    }
                  }}
                  className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,
                      current: !showPasswords.current,
                    })
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.current ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {passwordErrors.currentPassword && (
                <p className="text-sm text-red-600 mt-1">
                  {passwordErrors.currentPassword}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">
                New Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordData.newPassword}
                  placeholder="Enter New Password"
                  autoComplete="new-password" // Prevents browser from filling
                  onChange={(e) => {
                    const value = e.target.value;
                    setPasswordData({ ...passwordData, newPassword: value });

                    let error = "";
                    
                    if (value) {
                      if (passwordData.currentPassword && value === passwordData.currentPassword) {
                        error = "New password must be different from current password";
                      } 
                      else {
                        const validation = validatePassword(value);
                        if (!validation.isValid) {
                          error = validation.errors[0];
                        }
                      }
                    }
                    
                    setPasswordErrors({
                      ...passwordErrors,
                      newPassword: error,
                    });

                    if (passwordData.confirmPassword) {
                      const confirmError = validateConfirmPassword(
                        passwordData.confirmPassword,
                        value
                      );
                      setPasswordErrors((prev) => ({
                        ...prev,
                        confirmPassword: confirmError,
                      }));
                    }
                  }}
                  className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,
                      new: !showPasswords.new,
                    })
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {passwordErrors.newPassword && (
                <p className="text-sm text-red-600 mt-1">
                  {passwordErrors.newPassword}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  placeholder="Confirm New Password"
                  autoComplete="new-password" // Prevents browser from filling
                  onChange={(e) => {
                    const value = e.target.value;
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: value,
                    });

                    const error = validateConfirmPassword(
                      value,
                      passwordData.newPassword
                    );
                    setPasswordErrors({
                      ...passwordErrors,
                      confirmPassword: error,
                    });
                  }}
                  className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,
                      confirm: !showPasswords.confirm,
                    })
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirm ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {passwordErrors.confirmPassword && (
                <p className="text-sm text-red-600 mt-1">
                  {passwordErrors.confirmPassword}
                </p>
              )}
            </div>

            <div className="pt-4">
              <button
                onClick={handlePasswordUpdate}
                disabled={
                  changePasswordMutation.isPending ||
                  !isPasswordFormValid()
                }
                className="w-full md:w-auto flex items-center justify-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>
                  {changePasswordMutation.isPending
                    ? "Updating..."
                    : "Update Password"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title={successConfig.title}
        message={successConfig.message}
      />
    </div>
  );
};

export default Settings;