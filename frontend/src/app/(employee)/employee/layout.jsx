import EmployeeHeader from "@/app/(employee)/employee/components/Header";
import EmployeeSideBar from "@/app/(employee)/employee/components/Sidbar";
import { EmployeeDashboardWrapper } from "@/app/(employee)/employee/components/EployeeDashboardWrapper";
import BgDashboard from "@/components/Ui/BgDashboard";

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
          <main className="bg-secondary-100 rounded-tr-3xl flex-1 overflow-y-auto">
            <div className="cols-span-10 w-full h-screen overflow-x-hidden  bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
              <EmployeeDashboardWrapper>
                <BgDashboard id="employeeDashboard" />
                <div className="w-full h-full z-50 absolute">{children}</div>
              </EmployeeDashboardWrapper>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
