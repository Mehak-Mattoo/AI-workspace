"use client";

import { useRouter } from "next/navigation";

import { createClient } from "@/lib/client";
import { Button } from "@/components/ui/button";
import { authRoutes } from "@/components/helpers/routes";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(authRoutes.LOGIN);
  };

  return <Button onClick={logout}>Logout</Button>;
}
