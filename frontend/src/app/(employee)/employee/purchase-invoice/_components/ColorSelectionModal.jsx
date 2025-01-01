import { darkenColor, toPersianDigits } from "@/utils";

export const ColorSelectionModal = ({
  frame,
  setShowColorModal,
  onColorSelect,
  setShowFrameModal,
}) => {
  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50 p-10">
      <div className="bg-white p-8 rounded shadow-lg w-11/12 max-w-md">
        <h2 className="text-xl font-bold mb-4">انتخاب رنگ فریم</h2>
        <div className="grid grid-cols-3 gap-4">
          {frame?.FrameColors?.map((color) => (
            <button
              type="button"
              key={color.id}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onColorSelect(color);
                setShowColorModal(false);
                setShowFrameModal(false);
              }}
              className="flex flex-col items-center"
            >
              <div
                className="w-12 h-12 rounded-full border"
                style={{
                  backgroundColor: color.colorCode,
                  borderColor: darkenColor(color.colorCode),
                }}
              />
              <span>{toPersianDigits(color.count || 0)}</span>
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowColorModal(false)}
          className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-all"
        >
          بستن
        </button>
      </div>
    </div>
  );
};
