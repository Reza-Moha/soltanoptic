import { toPersianDigits } from "@/utils";

export default function Pagination({ totalPages, currentPage, onPageChange }) {
  const getVisiblePages = () => {
    const pages = [];

    if (totalPages <= 10) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 6) {
      pages.push(
        ...Array.from({ length: 8 }, (_, i) => i + 1),
        "...",
        totalPages,
      );
    } else if (currentPage >= totalPages - 5) {
      pages.push(
        1,
        "...",
        ...Array.from({ length: 8 }, (_, i) => totalPages - 8 + i + 1),
      );
    } else {
      pages.push(
        1,
        "...",
        currentPage - 2,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        currentPage + 2,
        "...",
        totalPages,
      );
    }

    return pages;
  };

  const pages = getVisiblePages();

  return (
    <div className="flex justify-center mt-4 flex-wrap gap-1">
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

      {pages.map((page, index) =>
        page === "..." ? (
          <span key={index} className="px-3 py-1 text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={index}
            className={`px-3 py-1 rounded-md border transition-all ${
              page === currentPage
                ? "bg-emerald-600 text-white"
                : "hover:bg-gray-200"
            }`}
            onClick={() => onPageChange(page)}
          >
            {toPersianDigits(page)}
          </button>
        ),
      )}

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
