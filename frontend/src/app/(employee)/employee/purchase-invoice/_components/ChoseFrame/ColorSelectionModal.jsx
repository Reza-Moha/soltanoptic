import { toPersianDigits } from "@/utils";

export const ColorSelectionModal = ({
  selectedFrame,
  selectedColor,
  handleConfirmSelection,
  setShowPopup,
}) => {
  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-60 p-10">
      <div
        className="bg-white p-8 rounded-lg shadow-2xl w-11/12 max-w-md transition-transform transform scale-95 opacity-0 animate-fadeIn z-50"
        style={{
          animation:
            "fadeIn 0.5s ease-out forwards, zoomIn 0.5s ease-out forwards",
        }}
      >
        <h3 className="text-2xl font-semibold mb-6 text-gray-800">
          تایید انتخاب
        </h3>
        <div className="space-y-4 mb-6">
          <p className="text-lg font-medium">
            نام فریم:
            <span className="font-normal text-gray-600">
              {selectedFrame?.name}
            </span>
          </p>
          <p className="text-lg font-medium">
            کد فریم:
            <span className="font-normal text-gray-600">
              {selectedFrame?.serialNumber}
            </span>
          </p>
          <p className="text-lg font-medium">
            قیمت:
            <span className="font-normal text-gray-600">
              {toPersianDigits(selectedFrame?.price.replace(/\B(?=(\d{3})+(?!\d))/g, ","))}
            </span>
          </p>
          <div>
            <p className="text-lg font-medium">رنگ انتخابی:</p>
            <div
              className="w-16 h-16 rounded-full border-4 border-white shadow-lg mx-auto"
              style={{
                backgroundColor: selectedColor?.colorCode,
              }}
            ></div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleConfirmSelection}
            type="button"
            className="bg-emerald-300  text-emerald-900 px-6 py-3 rounded-lg shadow-md transform transition-all duration-300 hover:scale-105 hover:bg-emerald-400 hover:text-emerald-950"
          >
            تایید
          </button>
          <button
            onClick={() => setShowPopup(false)}
            type="button"
            className="bg-rose-300 text-rose-800 px-6 py-3 rounded-lg shadow-md transform transition-all duration-300 hover:scale-105 hover:bg-rose-400 hover:text-rose-950"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
};
