import { toPersianDigits } from "@/utils";

export default function Pagination({ totalPages, currentPage, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center mt-4 space-x-2">
      <button
        className={`px-3 py-1 rounded-md border ml-2 ${
          currentPage === 1
            ? "cursor-not-allowed opacity-50"
            : "hover:bg-gray-200"
        }`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        قبلی
      </button>

      {pages.map((page, index) => (
        <button
          key={index}
          className={`px-3 py-1 rounded-md border transition-all ${
            page === currentPage
              ? "bg-primary-500 text-white"
              : "hover:bg-gray-200"
          }`}
          onClick={() => onPageChange(page)}
        >
          {toPersianDigits(page)}
        </button>
      ))}
      <button
        className={`px-3 py-1 rounded-md border ${
          currentPage === totalPages
            ? "cursor-not-allowed opacity-50"
            : "hover:bg-gray-200"
        }`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        بعدی
      </button>
    </div>
  );
}
