import doneAnimation from "@/assets/animation/doneAnimation.json";
import messageAnimation from "@/assets/animation/messageAnimation.json";
import printingAnimation from "@/assets/animation/printingAnimation.json";
import { LottieAnimation } from "@/components/Ui/LottieAnimation";

export const CustomerInfoPopup = ({ customerInfo, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/2">
        <div className="flex items-center justify-center border-b border-green-100 mb-2">
          <div className="w-16 h-16">
            <LottieAnimation animationData={doneAnimation} />
          </div>
          <p>{`قبض ${customerInfo.fullName} به شماره ${customerInfo.invoiceNumber} با موفقیت ذخیره شد.`}</p>
        </div>
        <div className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 justify-items-center gap-4">
            <div className="col-span-1 flex items-center gap-2 bg-blue-200 text-blue-500 rounded hover:bg-blue-400 hover:text-white cursor-pointer transition-all ease-linear duration-300">
              <button className="px-1 py-2 text-sm">ارسال پیامک</button>
              <div className="w-10 h-10">
                <LottieAnimation animationData={messageAnimation} />
              </div>
            </div>
            <div className="col-span-1 flex items-center gap-2 bg-orange-200 text-orange-500 rounded hover:bg-orange-400 hover:text-white transition-all ease-linear duration-300 cursor-pointer">
              <button className="px-1 py-2 text-sm">صدور فاکتور</button>
              <div className="w-10 h-10">
                <LottieAnimation animationData={printingAnimation} />
              </div>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 px-1 py-1 bg-rose-500 text-sm text-white rounded hover:bg-rose-600"
        >
          بستن
        </button>
      </div>
    </div>
  );
};
