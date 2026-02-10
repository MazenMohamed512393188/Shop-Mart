"use client";

import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

interface SessionProviderWrapperProps {
  children: React.ReactNode;
  session: Session | null;
}

export default function SessionProviderWrapper({
  children,
  session,
}: SessionProviderWrapperProps) {
  return (
    <SessionProvider session={session} refetchInterval={0} refetchOnWindowFocus={true}>
      {children}
    </SessionProvider>
  );
}