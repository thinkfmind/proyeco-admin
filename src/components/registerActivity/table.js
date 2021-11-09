import { DocumentDownloadIcon, TrashIcon } from "@heroicons/react/outline";
import { LocationMarkerIcon } from "@heroicons/react/solid";
import { useState } from "react";
import { Link } from "react-router-dom";
import useOrderTable from "../../hooks/useOrderTable";
import TableOrderPagination from "../tableOrderPagination";
import {s3BucketUrl} from '../../config'

const MAX_CANT_ROW = 7;

const Table = ({ registerActivities: data, type }) => {
  const [pagination, setPagination] = useState(1);
  const  { dataOrdered, sortTable } = useOrderTable({ data, initProperty: "createdAt" })
  const newPagination = (newPaginationValue) => {
    setPagination(newPaginationValue);
  };

  return (
    <div>
      <h1 className="mb-2 font-objetive-bold">Historial de registros</h1>
      <table className="w-full table-auto">
        <tbody>
          {dataOrdered.map((registerActivity, index) => {
            if (
              index < MAX_CANT_ROW * pagination &&
              index >= pagination * MAX_CANT_ROW - MAX_CANT_ROW
            ) {
              return (
                <tr key={registerActivity.id}>
                  <td className="py-2 text-xs border-b border-gray-300 font-objetive-medium">
                    {registerActivity.tipo}
                  </td>
                  <td className="py-2 text-xs truncate border-b border-gray-300 font-objetive-regular">
                    <div className="flex items-center">
                      <LocationMarkerIcon className="w-3 h-3 mr-1" />
                      <p>
                        {registerActivity.linea.name} -{" "}
                        {registerActivity.estacion.name}
                      </p>
                    </div>
                  </td>
                  <td className="py-2 text-xs border-b border-gray-300 font-objetive-medium">
                    {registerActivity.equipo.name}
                  </td>
                  <td className="py-2 text-xs border-b border-gray-300 font-objetive-regular">
                    {new Date(registerActivity.fecha).toLocaleDateString(
                      "es-ES",
                      { year: "numeric", month: "numeric", day: "numeric" }
                    )}
                  </td>
                  {type === "activity" ? (
                    <td className="py-2 text-xs border-b border-gray-300 font-objetive-regular">
                      {registerActivity.dias} día parado
                    </td>
                  ) : null}
                  {type === "historico" ? (
                    <td className="py-2 border-b border-gray-300">
                      {registerActivity.historico ? (
                        <button
                          className="text-gray-500 disabled:text-gray-200"
                          onClick={() => {
                            window.open(
                              `${s3BucketUrl}/${registerActivity.historico}`,
                              "_blank"
                            );
                          }}
                        >
                          <DocumentDownloadIcon
                            className="w-6 h-6"
                            aria-hidden="true"
                          />
                        </button>
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
                  <td className="py-2 border-b border-gray-300">
                    {type === "actividad" ? (
                      <Link
                        to={{
                          pathname: "/equipment/activity/update",
                          state: { id: registerActivity.id },
                        }}
                        className={` font-objetive-medium text-sm underline text-app-purple-btn cursor-pointer`}
                      >
                        Editar
                      </Link>
                    ) : (
                      <Link
                        to={{
                          pathname: "/equipment/activity/historic/update",
                          state: { id: registerActivity.id },
                        }}
                        className={` font-objetive-medium text-sm underline text-app-purple-btn cursor-pointer`}
                      >
                        Editar
                      </Link>
                    )}
                  </td>
                  <td className="py-2 border-b border-gray-300">
                    <button className="text-xs underline font-objetive-bold text-app-purple-300">
                      <TrashIcon
                        className={`h-5 w-5 text-app-purple-btn cursor-pointer`}
                        aria-hidden="true"
                      />
                    </button>
                  </td>
                </tr>
              );
            }
            return null;
          })}
        </tbody>
      </table>
      <TableOrderPagination
        pagination={pagination}
        newPagination={newPagination}
        cantElements={data.length}
        maxCantRow={MAX_CANT_ROW}
        order={{ sortTable, alphabetic: "tipo", date: "createdAt" }}
      />
    </div>
  );
};

export default Table;
