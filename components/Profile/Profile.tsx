"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAddressesAction,
  deleteAddressAction,
} from "@/actions/addressAction.action";
import toast from "react-hot-toast";
import {
  Trash2,
  MapPin,
  Phone,
  Plus,
  Edit,
  Mail,
  UserCircle,
  Package,
  Heart,
  Lock,
  WifiOff,
  RefreshCw,
} from "lucide-react";
import { Address } from "@/interfaces/addressInterface";
import { getLoggedUserAction } from "@/actions/userAction.action";
import { User } from "@/interfaces/userInterface";

export default function Profile() {
  const router = useRouter();
  
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [profileFetchError, setProfileFetchError] = useState<string | null>(null);
  const [addressFetchError, setAddressFetchError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  
  // ✅ Online/Offline Detection
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Connection restored", { duration: 3000 });
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast.error("You are offline. Some features may be limited.", {
        duration: 5000,
        icon: '📡'
      });
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    setIsOnline(navigator.onLine);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    fetchUserData();
    fetchAddresses();
  }, []);

  async function fetchUserData() {
    try {
      setIsLoadingUser(true);
      setProfileFetchError(null);
      const response = await getLoggedUserAction();

      if (response.message === "success" && response.data) {
        setUser(response.data);
      } else {
        setProfileFetchError(response.message || "Failed to load");
        toast.error(response.message || "Failed to load user data");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setProfileFetchError("Network error");
      toast.error("Failed to load user data");
    } finally {
      setIsLoadingUser(false);
    }
  }

  async function fetchAddresses() {
    try {
      setIsLoadingAddresses(true);
      setAddressFetchError(null);
      const response = await getAddressesAction();

      if (response.status === "success" && response.data) {
        setAddresses(response.data);
      } else {
        setAddressFetchError(response.message || "Failed to load");
        toast.error(response.message || "Failed to load addresses");
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setAddressFetchError("Network error");
      toast.error("Failed to load addresses");
    } finally {
      setIsLoadingAddresses(false);
    }
  }

  async function handleDeleteAddress(addressId: string) {
    // ✅ Check online status first
    if (!isOnline) {
      toast.error("You are offline. Please check your connection.", {
        duration: 5000,
        icon: '📡'
      });
      return;
    }

    if (!confirm("Are you sure you want to delete this address?")) {
      return;
    }

    try {
      setDeletingId(addressId);
      const response = await deleteAddressAction(addressId);

      if (response.status === "success") {
        toast.success("Address deleted successfully");
        setAddresses(addresses.filter((addr) => addr._id !== addressId));
      } else {
        toast.error(response.message || "Failed to delete address");
      }
    } catch (error: any) {
      console.error("Error deleting address:", error);
      
      // ✅ Classify error
      if (!navigator.onLine) {
        toast.error("Connection lost. Please try again when online.", {
          duration: 8000,
          icon: '📡'
        });
      } else {
        toast.error("Failed to delete address. Please try again.");
      }
    } finally {
      setDeletingId(null);
    }
  }

  // ✅ Safe navigation with online check
  function handleNavigation(path: string, actionName: string) {
    if (!isOnline) {
      toast.error(`You are offline. Cannot ${actionName} right now.`, {
        duration: 5000,
        icon: '📡'
      });
      return;
    }
    router.push(path);
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* ✅ Offline Warning Banner */}
      {!isOnline && (
        <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-center gap-3">
            <WifiOff className="w-5 h-5 text-warning" />
            <div className="flex-1">
              <p className="text-sm font-medium text-warning">
                You are currently offline
              </p>
              <p className="text-xs text-warning/80">
                Some features are disabled. Reconnect to access all functionality.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
          My Profile
        </h1>
        <p className="text-muted-foreground">
          Manage your account information and preferences
        </p>
      </div>

      {/* Personal Information Section */}
      <div className="glass rounded-2xl p-6 md:p-8 hover:shadow-glow transition-all duration-300">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <UserCircle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Personal Information
              </h2>
              <p className="text-sm text-muted-foreground">
                Your account details
              </p>
            </div>
          </div>
          
          {/* ✅ Edit button with online check */}
          <button
            onClick={() => handleNavigation("/edit-profile-page", "edit profile")}
            disabled={!isOnline}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:shadow-glow transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            title={!isOnline ? "Offline - Cannot edit profile" : "Edit profile"}
          >
            {!isOnline ? (
              <WifiOff className="w-4 h-4" />
            ) : (
              <Edit className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">
              {!isOnline ? "Offline" : "Edit"}
            </span>
          </button>
        </div>

        {isLoadingUser ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        ) : profileFetchError ? (
          <div className="text-center py-12">
            <p className="text-destructive mb-4">{profileFetchError}</p>
            <button
              onClick={() => {
                setIsRetrying(true);
                fetchUserData().finally(() => setIsRetrying(false));
              }}
              disabled={isRetrying || !isOnline}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Retrying...
                </>
              ) : !isOnline ? (
                <>
                  <WifiOff className="w-4 h-4" />
                  Offline
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </>
              )}
            </button>
          </div>
        ) : user ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <UserCircle className="w-4 h-4" />
                <span>Full Name</span>
              </div>
              <p className="text-lg font-semibold text-foreground pl-6">
                {user.name}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>Email Address</span>
              </div>
              <p className="text-lg font-semibold text-foreground pl-6">
                {user.email}
              </p>
            </div>

            {user.phone && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>Phone Number</span>
                </div>
                <p className="text-lg font-semibold text-foreground pl-6">
                  {user.phone}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Account Status</span>
              </div>
              <div className="flex items-center gap-2 pl-6">
                <div
                  className={`w-3 h-3 rounded-full ${
                    user.active ? "bg-success" : "bg-destructive"
                  }`}
                />
                <span className="text-lg font-semibold text-foreground">
                  {user.active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Shipping Addresses Section */}
      <div className="glass rounded-2xl p-6 md:p-8 hover:shadow-glow transition-all duration-300">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Shipping Addresses
              </h2>
              <p className="text-sm text-muted-foreground">
                Manage your delivery addresses
              </p>
            </div>
          </div>
          
          {/* ✅ Add Address button with online check */}
          <button
            onClick={() => handleNavigation("/add-address-page", "add address")}
            disabled={!isOnline}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:shadow-glow-accent transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            title={!isOnline ? "Offline - Cannot add address" : "Add new address"}
          >
            {!isOnline ? (
              <WifiOff className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">
              {!isOnline ? "Offline" : "Add New"}
            </span>
          </button>
        </div>

        {isLoadingAddresses ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin mb-4" />
            <p className="text-muted-foreground">Loading addresses...</p>
          </div>
        ) : addressFetchError ? (
          <div className="text-center py-12">
            <p className="text-destructive mb-4">{addressFetchError}</p>
            <button
              onClick={() => {
                setIsRetrying(true);
                fetchAddresses().finally(() => setIsRetrying(false));
              }}
              disabled={isRetrying || !isOnline}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Retrying...
                </>
              ) : !isOnline ? (
                <>
                  <WifiOff className="w-4 h-4" />
                  Offline
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </>
              )}
            </button>
          </div>
        ) : addresses.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <MapPin className="w-16 h-16 mx-auto text-muted-foreground/30" />
            <div>
              <p className="text-lg font-medium text-muted-foreground mb-2">
                No addresses saved yet
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Add your first delivery address to get started
              </p>
            </div>
            <button
              onClick={() => handleNavigation("/add-address-page", "add address")}
              disabled={!isOnline}
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:shadow-glow-accent transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {!isOnline ? (
                <>
                  <WifiOff className="w-4 h-4" />
                  Offline
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add Your First Address
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address, index) => (
              <div
                key={address._id}
                className="relative p-6 rounded-xl border-2 border-border hover:border-accent transition-all duration-300 hover:shadow-lg bg-card"
              >
                {index === 0 && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                    Primary
                  </div>
                )}

                <div className="space-y-3 pr-12">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-foreground text-lg">
                        {address.city}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {address.details}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-muted-foreground pl-8">
                    <Phone className="w-4 h-4 shrink-0" />
                    <p className="text-sm">{address.phone}</p>
                  </div>
                </div>

                {/* ✅ Delete button with online check */}
                <button
                  onClick={() => handleDeleteAddress(address._id)}
                  disabled={deletingId === address._id || !isOnline}
                  className="absolute bottom-4 right-4 p-2 rounded-lg border-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  title={!isOnline ? "Offline - Cannot delete" : "Delete address"}
                >
                  {deletingId === address._id ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : !isOnline ? (
                    <WifiOff className="w-5 h-5" />
                  ) : (
                    <Trash2 className="w-5 h-5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions with online check */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Change Password */}
        <button
          onClick={() => handleNavigation("/change-password-page", "change password")}
          disabled={!isOnline}
          className="group text-left disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="p-6 rounded-xl border-2 border-border hover:border-primary bg-card hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                {!isOnline ? (
                  <WifiOff className="w-6 h-6 text-primary" />
                ) : (
                  <Lock className="w-6 h-6 text-primary" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Change Password
                </h3>
                <p className="text-sm text-muted-foreground">
                  {!isOnline ? "Offline" : "Update your password"}
                </p>
              </div>
            </div>
          </div>
        </button>

        {/* My Orders */}
        <button
          onClick={() => handleNavigation("/allorders", "view orders")}
          disabled={!isOnline}
          className="group text-left disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="p-6 rounded-xl border-2 border-border hover:border-accent bg-card hover:shadow-glow-accent transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                {!isOnline ? (
                  <WifiOff className="w-6 h-6 text-accent-foreground" />
                ) : (
                  <Package className="w-6 h-6 text-accent-foreground" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">My Orders</h3>
                <p className="text-sm text-muted-foreground">
                  {!isOnline ? "Offline" : "View order history"}
                </p>
              </div>
            </div>
          </div>
        </button>

        {/* My Wishlist */}
        <button
          onClick={() => handleNavigation("/wishlist-page", "view wishlist")}
          disabled={!isOnline}
          className="group text-left disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="p-6 rounded-xl border-2 border-border hover:border-destructive bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                {!isOnline ? (
                  <WifiOff className="w-6 h-6 text-destructive" />
                ) : (
                  <Heart className="w-6 h-6 text-destructive" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">My Wishlist</h3>
                <p className="text-sm text-muted-foreground">
                  {!isOnline ? "Offline" : "Saved items"}
                </p>
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}