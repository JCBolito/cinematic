export function generatePagination(
  totalPages: number,
  currentPage: number,
  displayCount: number,
) {
  const halfDisplay = Math.floor(displayCount / 2);
  let start = currentPage - halfDisplay;
  let end = currentPage + halfDisplay;

  if (start <= 0) {
    end += Math.abs(start) + 1;
    start = 1;
  }

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - displayCount + 1);
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}
