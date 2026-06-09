import { AppSidebar } from "@/components/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { createClient } from "@/lib/server";
import { authRoutes } from "../../components/helpers/routes";
import { getProfileFromUser } from "@/lib/profileUtils";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user?.email) {
    redirect(authRoutes.LOGIN);
  }

  const profile = getProfileFromUser(data.user);

  return (
    <div className="w-full">
      <SidebarProvider>
        <AppSidebar
          email={profile.email}
          name={profile.name}
          avatar={profile.avatar}
        />
        <main className="flex flex-col flex-1 w-full ">
          <SidebarTrigger className="md:hidden" />
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}
