import BgDashboard from "@/components/Ui/BgDashboard";
import FrameReport from "./_/report/frame/FrameReport";
import { AdminDashboardWrapper } from "@/app/(admin)/admin/dashboard/_/AdminDashboardWrapper";
import { LensReport } from "@/app/(admin)/admin/dashboard/_/report/lens/LensReport";

export default function AdminDashboard() {
  return (
    <AdminDashboardWrapper>
      <BgDashboard />

      <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12 gap-4 !z-50 p-8">
        <div className="col-span-1 lg:col-span-4 row-span-2 backdropBox">1</div>
        <div className="col-span-1 lg:col-span-4 row-span-2 lg:col-start-5 backdropBox">
          2
        </div>
        <div className="col-span-1 lg:col-span-4 row-span-2 lg:col-start-9 backdropBox">
          3
        </div>
        <div className="col-span-1 lg:col-span-3 row-span-3 lg:col-start-10 lg:row-start-3 backdropBox">
          4
        </div>
        <div className="col-span-1 lg:col-span-3 row-span-3 lg:col-start-7 lg:row-start-3 backdropBox">
          5
        </div>
        <div className="col-span-1 lg:col-span-3 row-span-2 lg:col-start-1 lg:row-start-3 backdropBox">
          6
        </div>
        <div className="col-span-1 lg:col-span-3 row-span-2 lg:col-start-4 lg:row-start-3 backdropBox">
          7
        </div>
        <div className="col-span-1 lg:col-span-3 row-start-5 backdropBox">
          <FrameReport />
        </div>
        <div className="col-span-1 lg:col-span-3 lg:col-start-4 lg:row-start-5 backdropBox">
          <LensReport />
        </div>
      </div>
    </AdminDashboardWrapper>
  );
}
