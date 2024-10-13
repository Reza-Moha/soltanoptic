"use client";
import Table from "@/components/Ui/Table";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { IoRemoveOutline } from "react-icons/io5";
import Image from "next/image";
import {
  deleteLens,
  fetchAllLens,
  fetchAllLensCategories,
} from "@/redux/slices/lensSlice";
import { useState, useEffect } from "react";
import BasicWrapper from "../BasicWrapper";
import ShowPricingLensModal from "./ShowPricingLensModal";
import { useRouter } from "next/navigation";
import Pagination from "@/components/Ui/Pagination";

export default function ListOfLens() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [selectedLens, setSelectedLens] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { lensList, isLoading, lensPagination } = useSelector(
    (state) => state.lensSlice
  );

  useEffect(() => {
    dispatch(fetchAllLensCategories());
  }, [dispatch]);

  const handleDeleteLens = (id) => {
    dispatch(deleteLens(id));
  };

  const handleShowPricing = (lens) => {
    setSelectedLens(lens);
    setShowEditModal(true);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
    router.push(`?page=${page}`);
    dispatch(fetchAllLens({ page }));
  };

  return (
    <BasicWrapper title="لیست عدسی ها">
      {isLoading ? (
        <div className="spinner"></div>
      ) : (
        <Table>
          <Table.Header>
            <th>نام عدسی</th>
            <th> عدسی</th>
            <th>ضریب شکست</th>
            <th>دسته بندی</th>
            <th>توضیحات</th>
            <th>عملیات</th>
          </Table.Header>
          <Table.Body>
            {lensList?.length > 0 ? (
              lensList.map((lens) => (
                <motion.tr key={lens.id}>
                  <td className="text-lg font-bold flex flex-col md:flex-row items-center gap-x-2">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/${lens?.lensImage}`}
                      alt={lens?.lensName}
                      width="40"
                      height="40"
                      className="object-fill rounded-full "
                    />
                    <h3 className="font-bold text-sm md:text-base">
                      {lens.lensName}
                    </h3>
                  </td>
                  <td>
                    {lens?.LensType?.title || <IoRemoveOutline size={16} />}
                  </td>
                  <td>
                    {lens?.RefractiveIndex?.index || (
                      <IoRemoveOutline size={16} />
                    )}
                  </td>
                  <td className="flex flex-col items-center md:flex-row gap-1">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/${lens?.LensCategory?.lensImage}`}
                      alt={lens?.LensCategory?.lensName}
                      width="40"
                      height="40"
                      className="object-fill rounded-full "
                    />
                    <h3 className="font-bold text-base">
                      {lens?.LensCategory?.lensName}
                    </h3>
                  </td>
                  <td className="font-bold text-sm">
                    {lens.description.length > 15
                      ? `${lens.description.substring(0, 15)}...`
                      : lens.description}
                  </td>
                  <td
                    className={`${
                      lens.LensGroup && "flex items-center justify-center gap-2"
                    }`}
                  >
                    <button
                      className="text-rose-500 hover:bg-rose-100 rounded-full p-1 transition-all ease-in-out duration-300"
                      onClick={() => handleDeleteLens(lens.id)}
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
                    {lens.LensGroup && (
                      <button
                        className="text-emerald-500 hover:bg-emerald-100 rounded-full p-1 transition-all ease-in-out duration-300"
                        onClick={() => handleShowPricing(lens)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-5"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.75 3.375c0-1.036.84-1.875 1.875-1.875H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375Zm10.5 1.875a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 16.5 7.5h-1.875a.375.375 0 0 1-.375-.375V5.25ZM12 10.5a.75.75 0 0 1 .75.75v.028a9.727 9.727 0 0 1 1.687.28.75.75 0 1 1-.374 1.452 8.207 8.207 0 0 0-1.313-.226v1.68l.969.332c.67.23 1.281.85 1.281 1.704 0 .158-.007.314-.02.468-.083.931-.83 1.582-1.669 1.695a9.776 9.776 0 0 1-.561.059v.028a.75.75 0 0 1-1.5 0v-.029a9.724 9.724 0 0 1-1.687-.278.75.75 0 0 1 .374-1.453c.425.11.864.186 1.313.226v-1.68l-.968-.332C9.612 14.974 9 14.354 9 13.5c0-.158.007-.314.02-.468.083-.931.831-1.582 1.67-1.694.185-.025.372-.045.56-.06v-.028a.75.75 0 0 1 .75-.75Zm-1.11 2.324c.119-.016.239-.03.36-.04v1.166l-.482-.165c-.208-.072-.268-.211-.268-.285 0-.113.005-.225.015-.336.013-.146.14-.309.374-.34Zm1.86 4.392V16.05l.482.165c.208.072.268.211.268.285 0 .113-.005.225-.015.336-.012.146-.14.309-.374.34-.12.016-.24.03-.361.04Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))
            ) : (
              <Table.Row>
                <td colSpan="3" className="text-center">
                  عدسی یافت نشد.
                </td>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      )}
      <Pagination
        totalPages={lensPagination.totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
      {selectedLens && showEditModal && (
        <ShowPricingLensModal
          lens={selectedLens}
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </BasicWrapper>
  );
}
