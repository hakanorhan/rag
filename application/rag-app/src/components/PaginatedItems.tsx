"use client";

import Box from "@mui/material/Box";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ReactPaginate from "react-paginate";

type PaginatedItemsProps = {
  currentPage: number;
  pageCount: number;
  previousLabel: string;
  nextLabel: string;
  navigationLabel: string;
};

export default function PaginatedItems({
  currentPage,
  pageCount,
  previousLabel,
  nextLabel,
  navigationLabel,
}: PaginatedItemsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  if (pageCount <= 1) return null;

  return (
    <Box
      component="nav"
      aria-label={navigationLabel}
      sx={{
        mt: 4,
        "& ul": {
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          p: 0,
          listStyle: "none",
        },
        "& a": {
          display: "block",
          px: 1.5,
          py: 1,
          cursor: "pointer",
          borderRadius: 1,
        },
        "& .selected a": {
          bgcolor: "primary.main",
          color: "primary.contrastText",
        },
        "& .disabled a": { opacity: 0.5, cursor: "default" },
      }}
    >
      <ReactPaginate
        previousLabel={previousLabel}
        nextLabel={nextLabel}
        breakLabel="…"
        pageCount={pageCount}
        pageRangeDisplayed={5}
        forcePage={currentPage}
        disableInitialCallback
        onPageChange={({ selected }) => {
          const params = new URLSearchParams(searchParams.toString());
          if (selected === 0) params.delete("page");
          else params.set("page", String(selected + 1));
          const query = params.toString();
          router.push(query ? `${pathname}?${query}` : pathname);
        }}
        renderOnZeroPageCount={null}
      />
    </Box>
  );
}