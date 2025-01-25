import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import Table from "@/components/Ui/Table";
import Image from "next/image";
import { motion } from "framer-motion";

export const ChoseLens = ({ setShowLensModal, onLensSelect }) => {
  const { lensList, isLoading } = useSelector((state) => state.lensSlice);

  const [filterName, setFilterName] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterRefractiveIndex, setFilterRefractiveIndex] = useState("");

  const categories = useMemo(() => {
    return [
      ...new Set(lensList.map((lens) => lens.LensCategory.lensCategoryName)),
    ];
  }, [lensList]);


  const types = useMemo(() => {
    return [...new Set(lensList.map((lens) => lens.LensType.title))];
  }, [lensList]);


  const refractiveIndices = useMemo(() => {
    return [
      ...new Set(
        lensList.map((lens) => lens.RefractiveIndex?.index).filter(Boolean),
      ),
    ];
  }, [lensList]);


  const filteredLensList = lensList.filter((lens) => {
    const matchesName = lens.lensName
      .toLowerCase()
      .includes(filterName.toLowerCase());
    const matchesCategory = lens.LensCategory.lensCategoryName
      .toLowerCase()
      .includes(filterCategory.toLowerCase());
    const matchesType = lens.LensType.title
      .toLowerCase()
      .includes(filterType.toLowerCase());
    const matchesRefractiveIndex = filterRefractiveIndex
      ? String(lens.RefractiveIndex?.index) === filterRefractiveIndex
      : true;

    return (
      matchesName && matchesCategory && matchesType && matchesRefractiveIndex
    );
  });

  const handleLensSelect = (lens) => {
    onLensSelect(lens);
    setShowLensModal(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50 p-10">
      <div className="bg-white p-8 rounded shadow-lg w-11/12 h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">انتخاب عدسی</h2>
          <button
            type="button"
            className="bg-rose-200 text-rose-600 px-4 py-2 rounded"
            onClick={() => setShowLensModal(false)}
          >
            <IoClose />
          </button>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <input
            type="text"
            placeholder="فیلتر بر اساس نام عدسی"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">دسته بندی</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">نوع عدسی</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <select
            value={filterRefractiveIndex}
            onChange={(e) => setFilterRefractiveIndex(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">ضریب شکست</option>
            {refractiveIndices.map((index) => (
              <option key={index} value={index}>
                {index}
              </option>
            ))}
          </select>
        </motion.div>

        {isLoading ? (
          <div className="spinner-mini"></div>
        ) : (
          <>
            <Table>
              <Table.Header>
                <th className="bg-gray-200 p-2">نام عدسی</th>
                <th className="bg-gray-200 p-2">دسته‌بندی</th>
                <th className="bg-gray-200 p-2">ضریب شکست</th>
                <th className="bg-gray-200 p-2">نوع عدسی</th>
                <th className="bg-gray-200 p-2">عملیات</th>
              </Table.Header>
              <Table.Body>
                {(filteredLensList || []).map((lens, index) => (
                  <tr
                    key={lens.id}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="p-2 flex items-center gap-2">
                      <div className="w-12 h-12 relative">
                        <Image
                          className="rounded object-fill"
                          src={`${process.env.NEXT_PUBLIC_API_URL}/${
                            lens.lensImage || "default-image.jpg"
                          }`}
                          alt={lens.lensName || "تصویر عدسی"}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          onError={(e) =>
                            (e.target.src = "/fallback-image.jpg")
                          }
                        />
                      </div>
                      {lens.lensName}
                    </td>
                    <td className="p-2">
                      {lens.LensCategory.lensCategoryName}
                    </td>
                    <td className="p-2">{lens.RefractiveIndex?.index}</td>
                    <td className="p-2">{lens.LensType.title}</td>
                    <td className="p-2">
                      <button
                        type="button"
                        className="bg-emerald-200 text-emerald-700 rounded p-1 hover:bg-emerald-300 hover:text-emerald-800 transition-all ease-in duration-300 hover:scale-105"
                        onClick={() => handleLensSelect(lens)}
                      >
                        انتخاب عدسی
                      </button>
                    </td>
                  </tr>
                ))}
              </Table.Body>
            </Table>
          </>
        )}
      </div>
    </div>
  );
};
