"use client";
import { useDispatch } from "react-redux";
import { logOutUser } from "@/redux/slices/authSlice";
import SideBarNavs from "@/app/(employee)/employee/components/SidbarNavs";
import DataTime from "@/components/Ui/DataTime";
import { TbLogout2 } from "react-icons/tb";
import { useRouter } from "next/navigation";
function EmployeeSideBar() {
  const dispatch = useDispatch();
  const router = useRouter();

  const logoutHandler = async () => {
    dispatch(logOutUser());
    router.push("/");
  };

  return (
    <div className="overflow-y-auto flex flex-col p-5 h-screen pt-10 lg:pt-8">
      {/* Drawer header */}
      <div className=" border-b border-b-slate-200 pb-2 mb-6">
        <DataTime textColor="text-white border border-black/20 bg-slate-800" />
      </div>
      {/* Drawer content */}
      <div className="overflow-y-auto flex-auto">
        <SideBarNavs />
        <div
          onClick={logoutHandler}
          className="flex items-center gap-x-2 rounded-2xl font-medium transition-all duration-200  py-3 px-4 hover:text-rose-900 hover:bg-rose-200 cursor-pointer"
        >
          <TbLogout2 className=" ml-4 h-5 w-5" />
          <span>خروج</span>
        </div>
      </div>
    </div>
  );
}
export default EmployeeSideBar;
