import { Link } from "react-router-dom";
import TableOrderPagination from "../../../components/tableOrderPagination";
import {
  TrashIcon,
  DocumentDownloadIcon,
  LocationMarkerIcon,
} from "@heroicons/react/outline";
import { useSelector } from "react-redux";
import usePagination from "../../../hooks/usePagination";
import useOrderTable from "../../../hooks/useOrderTable";
import dateFormat from "dateformat";

const Table = ({ data, sendToTrash, selected }) => {
  const userSelector = useSelector((store) => store.user);
  const paginationObject = usePagination({
    maxCantRow: 7,
    cantElements: data.length,
  });
  const { dataOrdered, sortTable } = useOrderTable({
    data: data,
    initProperty: "createdAt",
  });

  return (
    <div className="pb-10 pr-40 vp-desktop">
      <table className="w-full table-auto">
        <tbody>
          {dataOrdered.map((equipo) => {
            return (
              <tr className="relative" key={equipo.id}>
                <td
                  className={`py-4 text-sm  border-b border-gray-300 font-objetive-medium`}
                >
                  {equipo.tipo}
                </td>
                <td
                  className={`py-4 text-sm  truncate border-b border-gray-300 font-objetive-regular`}
                >
                  <div className="flex items-center">
                    <LocationMarkerIcon className="w-5 h-5 mr-2" />
                    {equipo.linea.name} - {equipo.linea.lugar} -{" "}
                    {equipo.estacion.name}
                  </div>
                </td>
                <td
                  className={`py-4 text-sm  border-b border-gray-300 font-objetive-medium`}
                >
                  {equipo.equipo.name}
                </td>

                <td
                  className={`py-4 text-sm  border-b border-gray-300 font-objetive-regular`}
                >
                  {dateFormat(Date.parse(equipo.createdAt), "dd/mm/yy")}
                </td>

                <td
                  className={`py-4 text-sm  border-b border-gray-300 font-objetive-regular`}
                >
                  {equipo.dias} {equipo.dias === 1 ? "día" : "días"} parado
                </td>
                {userSelector.user.role === "Admin" ? (
                  <td className="py-2 pr-2 border-b border-gray-300">
                    {equipo.equipo.historico ? (
                      <Link
                        to={{
                          pathname: "/equipment/activity/historic/update",
                          state: { id: equipo.equipo.historicoId },
                        }}
                        className={` font-objetive-medium text-sm underline text-gray-600 cursor-pointer`}
                      >
                        <DocumentDownloadIcon
                          className="w-6 h-6"
                          aria-hidden="true"
                        />
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="text-gray-500 disabled:text-gray-200"
                      >
                        <DocumentDownloadIcon
                          className="w-6 h-6"
                          aria-hidden="true"
                        />
                      </button>
                    )}
                  </td>
                ) : null}

                {userSelector.user.role !== "Gerente" ? (
                  selected !== equipo.id ? (
                    <td
                      className={`py-4 border-b  duration-500 ease-in-out border-gray-300`}
                    >
                      <button className="text-sm underline font-objetive-bold text-app-purple-300">
                        <Link
                          to={{
                            pathname: "/equipment/activity/update",
                            state: { id: equipo.id },
                          }}
                        >
                          Editar
                        </Link>
                      </button>
                    </td>
                  ) : (
                    <td
                      className={`py-4 border-b  duration-500 ease-in-out border-gray-300`}
                    >
                      <button className="text-sm underline font-objetive-bold text-gray-300 cursor-not-allowed">
                        <div>Editar</div>
                      </button>
                    </td>
                  )
                ) : null}

                {userSelector.user.role !== "Gerente" ? (
                  selected !== equipo.id ? (
                    <td
                      className={`py-4 border-b duration-500 ease-in-out border-gray-300`}
                    >
                      <button
                        onClick={() => {
                          sendToTrash(equipo.id);
                        }}
                        className="text-xs underline font-objetive-bold text-app-purple-300"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  ) : (
                    <td
                      className={`py-4 border-b duration-500 ease-in-out border-gray-300`}
                    >
                      <button className="text-xs underline font-objetive-bold text-gray-300 cursor-not-allowed ">
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  )
                ) : null}
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
