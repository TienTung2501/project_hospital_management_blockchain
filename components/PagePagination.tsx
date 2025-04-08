import { Button } from "@/components/ui/button";

interface PagePaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const PagePagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}: PagePaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center mt-8 gap-2">
      {pages.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? "default" : "outline"}
          size="icon"
          className={
            page === currentPage
              ? "bg-blue-600 hover:bg-blue-700 h-8 w-8"
              : "border-indigo-600/50 text-indigo-300 h-8 w-8"
          }
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}
    </div>
  );
};
