import classNames from "classnames";

export const MedicalPrescription = ({ label, fieldPrefix }) => {
  return (
    <div
      className="grid grid-cols-12 grid-rows-4 gap-4 mb-5"
      style={{ direction: "ltr" }}
    >
      <div className="row-span-4 verticalText">
        <div
          className={classNames({
            "w-1/2 h-full flex items-center justify-center": true,
            "bg-green-100 text-green-600": label === "فریم دور",
            "bg-indigo-100 text-indigo-600": label === "فریم نزدیک",
            "bg-yellow-100 text-yellow-600": label === "فریم آفتابی",
          })}
        >
          {label}
        </div>
      </div>
      <div className="col-start-2 row-start-2 border-r border-secondary-300">
        OD
      </div>
      <div className="col-start-2 row-start-3 border-r border-secondary-300">
        OS
      </div>
      <div className="col-start-3 row-start-1 border-b border-secondary-300 text-center">
        SPH
      </div>
      <div className="col-start-4 row-start-1 border-b border-secondary-300 text-center">
        CYL
      </div>
      <div className="col-start-5 row-start-1 border-b border-secondary-300 text-center">
        AX
      </div>
      <div className="col-start-5 row-start-2">
        <input
          name={`${fieldPrefix}.FarOdAx`}
          className="medicalPrescriptionInput"
        />
      </div>
      <div className="col-start-4 row-start-2">
        <input
          name={`${fieldPrefix}.FarOdCyl`}
          className="medicalPrescriptionInput"
        />
      </div>
      <div className="col-start-3 row-start-2">
        <input
          name={`${fieldPrefix}.FarOdSph`}
          className="medicalPrescriptionInput"
        />
      </div>
      <div className="col-start-3 row-start-3">
        <input
          name={`${fieldPrefix}.FarOsSph`}
          className="medicalPrescriptionInput"
        />
      </div>
      <div className="col-start-4 row-start-3">
        <input
          name={`${fieldPrefix}.FarOsCyl`}
          className="medicalPrescriptionInput"
        />
      </div>
      <div className="col-start-5 row-start-3">
        <input
          name={`${fieldPrefix}.FarOsAx`}
          className="medicalPrescriptionInput"
        />
      </div>
      <div className="row-span-2 col-start-6 row-start-2 flex items-center justify-center">
        <input
          name={`${fieldPrefix}.pd`}
          className="medicalPrescriptionInput w-1/2 h-1/2"
          placeholder="PD"
        />
      </div>
      <div className="col-span-4 row-span-2 col-start-7 row-start-1">
        <input
          name={`${fieldPrefix}.typeOfGlasses`}
          className="medicalPrescriptionInput"
          placeholder="نوع عدسی"
        />
      </div>
      <div className="col-span-4 row-span-2 col-start-7 row-start-3">
        <input
          name={`${fieldPrefix}.typeOfFrame`}
          className="medicalPrescriptionInput"
          placeholder="نوع فریم"
        />
      </div>
      <div className="col-span-2 col-start-11 row-start-1">
        <input
          name={`${fieldPrefix}.lensPrice`}
          className="medicalPrescriptionInput"
          placeholder="قیمت عدسی"
        />
      </div>
      <div className="col-span-2 col-start-11 row-start-3">
        <input
          name={`${fieldPrefix}.framePrice`}
          className="medicalPrescriptionInput"
          placeholder="قیمت فریم"
        />
      </div>
    </div>
  );
};
