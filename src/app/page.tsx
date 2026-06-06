import { redirect } from "next/navigation";
import { protectedRoutes } from "./routes";

export default function Page() {
  redirect(protectedRoutes.HOME);
}
