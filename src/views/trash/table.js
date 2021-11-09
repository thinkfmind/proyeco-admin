import TableOrderPagination from "../../components/tableOrderPagination";
import { TrashIcon, LocationMarkerIcon } from "@heroicons/react/outline";
import usePagination from "../../hooks/usePagination";
import useOrderTable from "../../hooks/useOrderTable";
import dateFormat from "dateformat";

const Table = ({ data, removeFromTrash, alert}) => {
  const paginationObject = usePagination({
    maxCantRow: 7,
    cantElements: data.length,
  });
  const { dataOrdered, sortTable } = useOrderTable({
    data: data,
    initProperty: "createdAt",
  });

  return (
    <div className="pb-10">
      <table className="w-full table-auto">
        <tbody>
          {dataOrdered.map((item) => {
            return (
              <tr className="relative" key={item.id}>
                <td className="py-4 text-sm border-b border-gray-300 font-objetive-medium">
                  {item.tag === "Equipo" ? item.name : item.tipo}
                </td>
                <td className="py-4 text-sm border-b border-gray-300 font-objetive-regular">
                  <div className="flex items-center">
                    <LocationMarkerIcon className="w-3 h-3 mr-1" />
                    <p>
                      {item.linea.name} - {item.linea.lugar} -{" "}
                      {item.estacion.name}
                    </p>
                  </div>
                </td>
                <td className="py-4 text-sm truncate border-b border-gray-300 font-objetive-medium">
                  {item.tag === "Equipo" ? item.empresa.name : item.equipo.name}
                </td>
                <td
                  className={`py-4 text-sm border-b border-gray-300 font-objetive-regular ${
                    item.tag === "Equipo"
                      ? item.funciona
                        ? ""
                        : "text-red-600"
                      : ""
                  }`}
                >
                  {item.tag === "Equipo"
                    ? item.estado
                    : dateFormat(Date.parse(item.createdAt), "dd/mm/yy")}
                </td>
                <td className="py-4 text-sm border-b border-gray-300 font-objetive-regular">
                  {item.tag === "Equipo" ? null : item.dias + " días parado"}
                </td>
                <td className="py-4 border-b border-gray-300">
                  <button
                    onClick={() => {
                      removeFromTrash(item.id, item.tag);
                    }}
                    className="text-sm underline font-objetive-bold text-app-purple-300"
                  >
                    Restaurar
                  </button>
                </td>
                <td className="py-4 border-b border-gray-300">
                  <button
                    onClick={() => {
                      alert(item.id, item.tag);
                    }}
                    className="text-sm underline font-objetive-bold text-app-purple-300"
                  >
                    <TrashIcon
                      className={`h-5 w-5 text-app-purple-btn cursor-pointer`}
                      aria-hidden="true"
                    />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <TableOrderPagination
        {...paginationObject}
        order={{ sortTable, alphabetic: "name", date: "createdAt" }}
      />
    </div>
  );
};

export default Table;
