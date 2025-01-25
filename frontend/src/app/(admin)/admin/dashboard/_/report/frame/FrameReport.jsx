import { TotalInventoryValue } from "@/app/(admin)/admin/dashboard/_/report/frame/TotalInventoryValue";
import { TotalColorCount } from "@/app/(admin)/admin/dashboard/_/report/frame/TotalColorCount";
import { FrameTypeArray } from "@/app/(admin)/admin/dashboard/_/report/frame/FrameTypeArray";
import { GenderArray } from "@/app/(admin)/admin/dashboard/_/report/frame/GenderArray";
export default function FrameReport() {
  return (
    <div className="h-full overflow-y-auto">
      <TotalInventoryValue />
      <TotalColorCount />
      <FrameTypeArray />
      <GenderArray />
    </div>
  );
}
