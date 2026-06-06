import { AppSidebar } from "@/components/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { createClient } from "@/lib/server";
import { authRoutes } from "../routes";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { getProfileFromClaims } from "@/lib/profileUtils";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.email) {
    redirect(authRoutes.LOGIN);
  }

  const profile = getProfileFromClaims(data.claims);

  return (
    <div className="w-full">
      <SidebarProvider>
        <AppSidebar
          email={profile.email}
          name={profile.name}
          avatar={profile.avatar}
        />
        <main className="flex flex-col flex-1 w-full ">
          <div className="flex w-full items-center border-b">
            <SidebarTrigger />
          </div>
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}
