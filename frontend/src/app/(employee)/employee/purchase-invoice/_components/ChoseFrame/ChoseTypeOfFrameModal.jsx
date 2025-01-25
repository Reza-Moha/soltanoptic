export const ChoseTypeOfFrameModal = ({ values, setShowPopup }) => {
  const frameTypes = [
    { label: "فریم دور", color: "bg-green-500", textColor: "text-white" },
    { label: "فریم نزدیک", color: "bg-blue-500", textColor: "text-white" },
    { label: "فریم آفتابی", color: "bg-yellow-500", textColor: "text-white" },
  ];

  const handleButtonClick = (frame) => {
    values.prescriptions.push({
      label: frame.label,
      FarOdAx: "",
      FarOdCyl: "",
      FarOdSph: "",
      FarOsAx: "",
      FarOsCyl: "",
      FarOsSph: "",
      pd: "",
      frame: {},
      lens:{}
    });

    setShowPopup(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">انتخاب نوع فریم</h2>
        <div className="flex flex-col gap-4">
          {frameTypes.map((frame) => (
            <button
              key={frame.label}
              type="button"
              className={`${frame.color} ${frame.textColor} px-4 py-2 rounded`}
              onClick={() => handleButtonClick(frame)}
            >
              {frame.label}
            </button>
          ))}
          <button
            type="button"
            className="bg-rose-200 text-rose-600 px-4 py-2 rounded mt-2"
            onClick={() => setShowPopup(false)}
          >
            لغو
          </button>
        </div>
      </div>
    </div>
  );
};
