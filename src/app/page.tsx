import { redirect } from "next/navigation";
import { protectedRoutes } from "../components/helpers/routes";

export default function Page() {
  redirect(protectedRoutes.HOME);
}
