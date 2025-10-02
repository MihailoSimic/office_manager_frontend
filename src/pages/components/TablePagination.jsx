import React from "react";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

const TablePagination = ({ currentPage, totalPages, onPageChange, colorScheme }) => {
  const defaultScheme = {
    activeBg: "#d1c4e9",
    activeColor: "#6a1b9a",
    inactiveBg: "#f3eafa",
    inactiveColor: "#7c4dff",
    arrowBg: "#ede7f6",
    arrowColor: "#7c4dff",
    boxShadowActive: "0 2px 8px #ede7f6",
    boxShadowInactive: "0 1px 4px #ede7f6"
  };
  const scheme = { ...defaultScheme, ...colorScheme };

  if (totalPages <= 1) return null;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
      <Pagination size="md" style={{ background: 'transparent' }}>
        <PaginationItem disabled={currentPage === 1}>
          <PaginationLink
            previous
            onClick={() => onPageChange(currentPage - 1)}
            style={{ background: scheme.arrowBg, color: scheme.arrowColor, border: 'none', borderRadius: 8 }}
          />
        </PaginationItem>
        {[...Array(totalPages)].map((_, idx) => (
          <PaginationItem active={currentPage === idx + 1} key={idx}>
            <PaginationLink
              onClick={() => onPageChange(idx + 1)}
              style={{
                background: currentPage === idx + 1 ? scheme.activeBg : scheme.inactiveBg,
                color: currentPage === idx + 1 ? scheme.activeColor : scheme.inactiveColor,
                fontWeight: 600,
                border: 'none',
                borderRadius: 8,
                margin: '0 2px',
                boxShadow: currentPage === idx + 1 ? scheme.boxShadowActive : scheme.boxShadowInactive
              }}
            >
              {idx + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem disabled={currentPage === totalPages}>
          <PaginationLink
            next
            onClick={() => onPageChange(currentPage + 1)}
            style={{ background: scheme.arrowBg, color: scheme.arrowColor, border: 'none', borderRadius: 8 }}
          />
        </PaginationItem>
      </Pagination>
    </div>
  );
};

export default TablePagination;
