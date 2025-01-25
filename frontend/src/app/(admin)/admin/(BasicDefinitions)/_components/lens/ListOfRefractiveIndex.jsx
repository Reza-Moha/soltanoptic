import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import Table from "@/components/Ui/Table";
import { useSelector } from "react-redux";
import { toPersianDigits } from "@/utils";
import { deleteRefractiveIndex } from "@/redux/slices/lensSlice";

export function RefractiveIndexList() {
  const dispatch = useDispatch();

  const { refractiveIndexList, isLoading } = useSelector(
    (state) => state.lensSlice
  );

  const handleDeleteRefractiveIndex = (id) => {
    dispatch(deleteRefractiveIndex(id));
  };

  return (
    <div className="border-t border-secondary-500">
      {isLoading ? (
        <div className="spinner"></div>
      ) : (
        <Table>
          <Table.Header>
            <th>ضریب شکست</th>
            <th>ویژگی ها</th>
            <th>عملیات</th>
          </Table.Header>
          <Table.Body>
            {refractiveIndexList?.length > 0 ? (
              refractiveIndexList.map((refractiveIndex) => (
                <motion.tr key={refractiveIndex.id}>
                  <td className="text-lg font-bold">
                    {toPersianDigits(refractiveIndex.index || 0)}
                  </td>
                  <td className="font-bold text-sm">
                    {refractiveIndex.characteristics.length > 0
                      ? refractiveIndex.characteristics.map((item, index) => (
                          <h3
                            key={index}
                            className="text-xs mb-1.5 border-r-2 border-indigo-400 pr-1"
                          >
                            {toPersianDigits(item || 0)}
                          </h3>
                        ))
                      : null}
                  </td>
                  <td>
                    <button
                      className="text-rose-500 hover:bg-rose-100 rounded-full p-1 transition-all ease-in-out duration-300"
                      onClick={() =>
                        handleDeleteRefractiveIndex(refractiveIndex.id)
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <Table.Row>
                <td colSpan="3" className="text-center">
                  ضریب شکست یافت نشد.
                </td>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      )}
    </div>
  );
}
