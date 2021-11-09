import { useState } from "react"

const usePagination = ({ maxCantRow, cantElements }) => {
	const [pagination, setPagination] = useState(1)

	const newPagination = (newPaginationValue) => {
    setPagination(newPaginationValue);
  };

	return { pagination, newPagination, maxCantRow, cantElements }
}

export default usePagination