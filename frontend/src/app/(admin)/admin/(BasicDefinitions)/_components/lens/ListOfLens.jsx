"use client";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteLens,
  fetchAllLens,
  fetchAllLensCategories,
} from "@/redux/slices/lensSlice";
import { useState, useEffect, useMemo } from "react";
import BasicWrapper from "../BasicWrapper";
import ShowPricingLensModal from "./ShowPricingLensModal";
import { useRouter } from "next/navigation";
import Pagination from "@/components/Ui/Pagination";
import debounce from "lodash.debounce";
import LensListTable from "./LensListTable";

export default function ListOfLens() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [selectedLens, setSelectedLens] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { lensList, isLoading, lensPagination } = useSelector(
    (state) => state.lensSlice
  );

  useEffect(() => {
    if (router.isReady) {
      const { page = 1, search = "" } = router.query;
      setCurrentPage(Number(page));
      setSearchTerm(search);
    }
  }, [router.isReady, router.query]);

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

  const debouncedSearch = useMemo(() => {
    return debounce((searchTerm) => {
      router.push(`?page=1&size=${lensPagination.size}&search=${searchTerm}`);
      dispatch(fetchAllLens({ page: 1, search: searchTerm }));
    }, 300);
  }, [lensPagination.size, router, dispatch]);

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      debouncedSearch(searchTerm);
    }
  };

  return (
    <BasicWrapper title="لیست عدسی ها">
      <input
        type="text"
        placeholder="جستجوی عدسی ..."
        value={searchTerm}
        className="textField__input"
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleSearch}
      />
      <LensListTable
        lensList={lensList}
        handleDeleteLens={handleDeleteLens}
        handleShowPricing={handleShowPricing}
      />

      {lensPagination.totalItems > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={lensPagination.totalPages}
          pageSize={lensPagination.size}
          onPageChange={handlePageChange}
        />
      )}

      {showEditModal && (
        <ShowPricingLensModal
          selectedLens={selectedLens}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </BasicWrapper>
  );
}
