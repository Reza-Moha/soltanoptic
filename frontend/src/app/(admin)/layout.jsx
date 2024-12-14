import AdminHeader from "@/app/(admin)/admin/_components/Header";
import { AdminProvider } from "./admin/_components/AdminProvider";

export default function AdminLayout({ children }) {
  return (
    <>
      <section className="h-screen min-h-screen">
        <AdminHeader />
        <main>
          <AdminProvider>{children}</AdminProvider>
        </main>
      </section>
    </>
  );
}
