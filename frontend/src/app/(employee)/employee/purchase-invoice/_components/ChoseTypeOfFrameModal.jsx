export const ChoseTypeOfFrameModal = ({ values, setShowPopup }) => {
  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">انتخاب نوع فریم</h2>
        <div className="flex flex-col gap-4">
          <button
            type="button"
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={() => {
              values.prescriptions.push({
                label: "فریم دور",
                FarOdAx: "",
                FarOdCyl: "",
                FarOdSph: "",
                FarOsAx: "",
                FarOsCyl: "",
                FarOsSph: "",
                pd: "",
                typeOfGlasses: "",
                typeOfFrame: "",
                lensPrice: "",
                framePrice: "",
              });
              setShowPopup(false);
            }}
          >
            فریم دور
          </button>
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => {
              values.prescriptions.push({
                label: "فریم نزدیک",
                FarOdAx: "",
                FarOdCyl: "",
                FarOdSph: "",
                FarOsAx: "",
                FarOsCyl: "",
                FarOsSph: "",
                pd: "",
                typeOfGlasses: "",
                typeOfFrame: "",
                lensPrice: "",
                framePrice: "",
              });
              setShowPopup(false);
            }}
          >
            فریم نزدیک
          </button>
          <button
            type="button"
            className="bg-yellow-500 text-white px-4 py-2 rounded"
            onClick={() => {
              values.prescriptions.push({
                label: "فریم آفتابی",
                FarOdAx: "",
                FarOdCyl: "",
                FarOdSph: "",
                FarOsAx: "",
                FarOsCyl: "",
                FarOsSph: "",
                pd: "",
                typeOfGlasses: "",
                typeOfFrame: "",
                lensPrice: "",
                framePrice: "",
              });
              setShowPopup(false);
            }}
          >
            فریم آفتابی
          </button>
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
