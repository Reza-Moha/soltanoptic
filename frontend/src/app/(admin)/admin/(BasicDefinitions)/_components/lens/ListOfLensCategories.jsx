import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import Table from "@/components/Ui/Table";
import { useSelector } from "react-redux";
import { deleteLensCategories } from "@/redux/slices/lensSlice";
import Image from "next/image";

export function LensCategoriesList() {
  const dispatch = useDispatch();

  const { lensCategories, isLoading } = useSelector((state) => state.lensSlice);

  const handleDeleteLensCategory = (id) => {
    dispatch(deleteLensCategories(id));
  };

  return (
    <div className="border-t border-secondary-500">
      {isLoading ? (
        <div className="spinner"></div>
      ) : (
        <Table>
          <Table.Header>
            <th>عنوان دسته بندی</th>
            <th>عملیات</th>
          </Table.Header>
          <Table.Body>
            {lensCategories?.length > 0 ? (
              lensCategories.map((LensCategory) => (
                <motion.tr key={LensCategory.id}>
                  <td className="flex items-center gap-x-2">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/${LensCategory.lensImage}`}
                      alt={LensCategory.lensCategoryName}
                      width="40"
                      height="40"
                      className="object-fill rounded-full "
                    />
                    <h3 className="font-bold text-base">
                      {`${LensCategory.lensCategoryName}`}
                    </h3>
                  </td>

                  <td>
                    <button
                      className="text-rose-500 hover:bg-rose-100 rounded-full p-1 transition-all ease-in-out duration-300"
                      onClick={() => handleDeleteLensCategory(LensCategory.id)}
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
                  نوع عدسی یافت نشد.
                </td>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      )}
    </div>
  );
}
