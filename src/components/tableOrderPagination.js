import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/outline";
import { useRef, useState } from "react";

const TableOrderPagination = ({ hasOrder = true, pagination = 0, newPagination, cantElements = 0, maxCantRow = 0, order }) => {
	const refSelect = useRef(null)
	const CANT_TOTAL_PAGINATION = Math.ceil(cantElements / maxCantRow)
	const [selectValue, setSelectValue] = useState("dateDESC")
	const handleClickFirst = () => {
		newPagination(1)
	}

	const handleClickPrev = () => {
		if (pagination > 1) {
			newPagination(pagination - 1)
		}
	}

	const handleClickNext = () => {
		if(pagination < CANT_TOTAL_PAGINATION) {
			newPagination(pagination + 1)
		}
	}

	const handleClickLast = () => {
		if(pagination < CANT_TOTAL_PAGINATION) {
			newPagination(CANT_TOTAL_PAGINATION)
		}
	}

	const handleChange = (e) => {
		setSelectValue(e.target.value)
		if (order?.sortTable) {
			const select = e.target
			const option = refSelect.current.querySelector("option[value='" + select.value + "']")
			order.sortTable(option.dataset.property, option.dataset.orderby === "ASC")
		}
	}

	return (
		<div className="flex items-center justify-end mt-4 text-xs">
			{hasOrder
				&& (
					<select ref={refSelect} value={selectValue} onChange={handleChange} className="pl-0 mr-6 text-xs border-0 pr-7 font-objetive-medium">
						<option data-orderby="ASC" data-property={order.alphabetic} value="ASC">Orden alfabetico A-Z</option>
						<option data-orderby="DESC" data-property={order.alphabetic} value="DESC">Orden alfabetico Z-A</option>
						<option data-orderby="DESC" data-property={order.date} value="dateDESC">Mas recientes</option>
						<option data-orderby="ASC" data-property={order.date} value="dateASC">Mas antiguos</option>
					</select>
				)}
			<div className="flex items-center justify-end text-xs font-objetive-regular">
				<button className="text-gray-900 disabled:cursor-default disabled:text-gray-500" onClick={handleClickFirst} disabled={pagination <= 1}>
					<ChevronDoubleLeftIcon
						className="w-3 h-3 mr-1"
						aria-hidden="true"
					/>
				</button>
				<button className="text-gray-900 disabled:cursor-default disabled:text-gray-500" onClick={handleClickPrev} disabled={pagination <= 1}>
					<ChevronLeftIcon
						className="w-3 h-3 "
						aria-hidden="true"
					/>
				</button>
				<p className="mx-1">{cantElements === 0 ? 0 : (maxCantRow * pagination) - (maxCantRow - 1)}-{maxCantRow > cantElements ? cantElements : maxCantRow * pagination } de {cantElements}</p>
				<button className="text-gray-900 disabled:cursor-default disabled:text-gray-500" onClick={handleClickNext} disabled={pagination >= CANT_TOTAL_PAGINATION} >
					<ChevronRightIcon
						className="w-3 h-3"
						aria-hidden="true"
					/>
				</button>
				<button className="text-gray-900 disabled:cursor-default disabled:text-gray-500" onClick={handleClickLast} disabled={pagination >= CANT_TOTAL_PAGINATION} >
					<ChevronDoubleRightIcon
						className="w-3 h-3 ml-1"
						aria-hidden="true"
					/>
				</button>
			</div>
		</div>
	)
}

export default TableOrderPagination
