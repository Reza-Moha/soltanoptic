import { useState } from "react";
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import Table from "@/components/Ui/Table";
import Pagination from "@/components/Ui/Pagination";
import { ColorSelectionModal } from "@/app/(employee)/employee/purchase-invoice/_components/ChoseFrame/ColorSelectionModal";

export const ChoseFrame = ({ setShowFrameModal, onFrameSelect }) => {
  const { frameList, isLoading } = useSelector((state) => state.frameSlice);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedColor, setSelectedColor] = useState({});
  const [selectedFrame, setSelectedFrame] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const itemsPerPage = 10;

  const filteredFrameList = (frameList || []).filter((frame) => {
    return (
      frame.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      frame.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      frame.price.toString().includes(searchTerm)
    );
  });

  const totalPages = Math.ceil(filteredFrameList.length / itemsPerPage);

  const currentData = filteredFrameList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleColorSelect = (frame, color) => {
    setSelectedFrame({
      ...frame,
      FrameColors: [color],
    });
    console.log("color 43", color);
    setSelectedColor(color);
    setShowPopup(true);
  };

  const handleConfirmSelection = (e) => {
    e.preventDefault();
    onFrameSelect(selectedFrame, selectedColor);
    setShowPopup(false);
    setShowFrameModal(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50 p-10">
      <div className="bg-white p-8 rounded shadow-lg w-11/12 h-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">انتخاب فریم</h2>
          <button
            type="button"
            className="bg-rose-200 text-rose-600 px-4 py-2 rounded"
            onClick={() => setShowFrameModal(false)}
          >
            <IoClose />
          </button>
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="جستجو در فریم‌ها"
            className="w-full p-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {isLoading ? (
          <div className="spinner-mini"></div>
        ) : (
          <>
            <Table>
              <Table.Header>
                <th className="bg-gray-200 p-2">نام فریم</th>
                <th className="bg-gray-200 p-2">کد</th>
                <th className="bg-gray-200 p-2">قیمت</th>
                <th className="bg-gray-200 p-2">رنگ‌ها</th>
              </Table.Header>
              <Table.Body>
                {(currentData || []).map((frame, index) => (
                  <tr
                    key={frame.id}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="p-2">{frame.name}</td>
                    <td className="p-2">{frame.serialNumber}</td>
                    <td className="p-2">{frame.price}</td>
                    <td className="p-2">
                      {/* نمایش رنگ‌ها برای انتخاب */}
                      {(frame.FrameColors || []).map((color, colorIndex) => (
                        <button
                          type="button"
                          key={colorIndex}
                          onClick={() => handleColorSelect(frame, color)}
                          className={`p-3 rounded mr-2 my-1 ${
                            color === selectedColor
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 hover:bg-gray-300"
                          }`}
                          style={{ backgroundColor: color.colorCode }}
                        ></button>
                      ))}
                    </td>
                  </tr>
                ))}
              </Table.Body>
            </Table>

            {/* Pagination component */}
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
      {showPopup && (
        <ColorSelectionModal
          handleConfirmSelection={handleConfirmSelection}
          selectedColor={selectedColor}
          selectedFrame={selectedFrame}
          setShowPopup={setShowPopup}
        />
      )}
    </div>
  );
};
