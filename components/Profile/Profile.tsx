"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
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
} from "lucide-react";
import { Address } from "@/interfaces/addressInterface";
import { getLoggedUserAction } from "@/actions/userAction.action";
import { User } from "@/interfaces/userInterface";

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
    fetchAddresses();
  }, []);

  async function fetchUserData() {
    try {
      setIsLoadingUser(true);
      const response = await getLoggedUserAction();

      if (response.message === "success" && response.data) {
        setUser(response.data);
      } else {
        toast.error(response.message || "Failed to load user data");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Failed to load user data");
    } finally {
      setIsLoadingUser(false);
    }
  }

  async function fetchAddresses() {
    try {
      setIsLoadingAddresses(true);
      const response = await getAddressesAction();

      if (response.status === "success" && response.data) {
        setAddresses(response.data);
      } else {
        toast.error(response.message || "Failed to load addresses");
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to load addresses");
    } finally {
      setIsLoadingAddresses(false);
    }
  }

  async function handleDeleteAddress(addressId: string) {
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
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          My Profile
        </h1>
        <p className="text-muted-foreground">
          Manage your account information and preferences
        </p>
      </div>

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
          <Link href="/edit-profile-page">
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:shadow-glow transition-all duration-300 hover:scale-105">
              <Edit className="w-4 h-4" />
              <span className="hidden sm:inline">Edit</span>
            </button>
          </Link>
        </div>

        {isLoadingUser ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
            <p className="text-muted-foreground">Loading profile...</p>
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
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Failed to load user data</p>
          </div>
        )}
      </div>

      <div className="glass rounded-2xl p-6 md:p-8 hover:shadow-glow transition-all duration-300">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-accent" />
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
          <Link href="/add-address-page">
            <button className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:shadow-glow-accent transition-all duration-300 hover:scale-105">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add New</span>
            </button>
          </Link>
        </div>

        {isLoadingAddresses ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin mb-4" />
            <p className="text-muted-foreground">Loading addresses...</p>
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
            <Link href="/add-address-page">
              <button className="px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:shadow-glow-accent transition-all duration-300 hover:scale-105">
                Add Your First Address
              </button>
            </Link>
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
                    <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
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
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <p className="text-sm">{address.phone}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteAddress(address._id)}
                  disabled={deletingId === address._id}
                  className="absolute bottom-4 right-4 p-2 rounded-lg border-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete address"
                >
                  {deletingId === address._id ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="w-5 h-5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/change-password-page" className="group">
          <div className="p-6 rounded-xl border-2 border-border hover:border-primary bg-card hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Change Password
                </h3>
                <p className="text-sm text-muted-foreground">
                  Update your password
                </p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/allorders" className="group">
          <div className="p-6 rounded-xl border-2 border-border hover:border-accent bg-card hover:shadow-glow-accent transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Package className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">My Orders</h3>
                <p className="text-sm text-muted-foreground">
                  View order history
                </p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/wishlist-page" className="group">
          <div className="p-6 rounded-xl border-2 border-border hover:border-destructive bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">My Wishlist</h3>
                <p className="text-sm text-muted-foreground">
                  Saved items
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}