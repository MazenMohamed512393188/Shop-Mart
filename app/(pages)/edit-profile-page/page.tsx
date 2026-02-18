import { getServerSession } from "next-auth";
import { authOptions } from "@/actions/authOptions";
import { redirect } from "next/navigation";
import EditProfile from "@/components/Editprofile/Editprofile ";
import { API_ENDPOINTS } from "@/lib/env";

export default async function EditProfilePage() {
  const session = await getServerSession(authOptions);
  const getUser = API_ENDPOINTS.getUser();

  if (!session?.token) {
    redirect("/login");
  }

  const response = await fetch(getUser, {
    headers: {
      token: session.token as string,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok || !data.data) {
    redirect("/profile-page");
  }

  return <EditProfile user={data.data} />;
}