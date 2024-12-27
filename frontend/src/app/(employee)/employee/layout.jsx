import EmployeeHeader from "@/app/(employee)/employee/components/Header";
import EmployeeSideBar from "@/app/(employee)/employee/components/Sidbar";
import { EmployeeDashboardWrapper } from "@/app/(employee)/employee/components/EployeeDashboardWrapper";

export const metadata = {
  title: "داشبورد",
  description: "داشبورد",
};

export default function RootLayout({ children }) {
  return (
    <div className="bg-secondary-0 font-iranSans">
      <div className="grid grid-cols-12 h-screen">
        <aside className="col-span-12 lg:col-span-3 xl:col-span-2 hidden lg:block">
          <EmployeeSideBar />
        </aside>
        <div className="col-span-12 lg:col-span-9 xl:col-span-10 h-screen flex flex-col">
          <EmployeeHeader />
          <main className="bg-secondary-100 rounded-tr-3xl p-4 md:p-6 lg:p-10 flex-1 overflow-y-auto">
            <EmployeeDashboardWrapper>{children}</EmployeeDashboardWrapper>
          </main>
        </div>
      </div>
    </div>
  );
}
