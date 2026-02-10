'use client';
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function Logout() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({
      redirect: false, // Don't redirect automatically
    });
    
    // Force router refresh to update server components
    router.refresh();
    
    // Then redirect to home
    router.push("/");
  };

  return (
    <DropdownMenuItem
      onClick={handleLogout}
      className="cursor-pointer text-destructive focus:text-destructive hover:bg-destructive/10"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Log out
    </DropdownMenuItem>
  );
}