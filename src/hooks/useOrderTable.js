import { useEffect, useState } from "react";
import { getValue } from "../helpers/table";

const useOrderTable = ({ data, initProperty, orderBy = "DESC" }) => {
	const [orderSelect, setOrderSelect] = useState({
    orderBy,
    property: initProperty,
  });
  const [dataOrdered, setDataOrdered] = useState([])

	const sortTable = (property, isASC) => {
    const dataSort = [...data].sort(function (a, b) {
      const first = getValue(property, a);
      const second = getValue(property, b);
      if (isASC ? first > second : first < second) {
        return 1;
      }
      if (isASC ? first < second : first > second) {
        return -1;
      }
      return 0;
    });
    setDataOrdered(dataSort)
  };

  const handleSortTable = (property) => {
    const orderBy =
      orderSelect.property === property
        ? orderSelect.orderBy === "ASC"
          ? "DESC"
          : "ASC"
        : "DESC";
    sortTable(property, orderBy === "ASC");
    setOrderSelect({
      property,
      orderBy,
    });
  };

	useEffect(() => {
    if(data) {
      sortTable(orderSelect.property, orderSelect.orderBy === "ASC");
    }
  }, [data]);

	return { dataOrdered, sortTable, handleSortTable, orderSelect }
}

export default useOrderTable