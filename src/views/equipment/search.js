import { TrashIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import Navbar from "../../@app/navbar";
import TableOrderPagination from "../../components/tableOrderPagination";
import { similarity } from "../../helpers/string";
import { useSelector } from "react-redux";
import useFetch from "../../hooks/useFetch";
import { Link } from "react-router-dom";
import usePagination from "../../hooks/usePagination";
import useOrderTable from "../../hooks/useOrderTable";
import { backendUrl } from "../../config";

const Search = () => {
  const userSelector = useSelector((store) => store.user);
  const { response } = useFetch({
    url: `${backendUrl}/equipo`,
    options: {
      headers: {
        Authorization: `Bearer ${userSelector.user.jwtToken}`,
      },
    },
  });
  const [searchValue, setSearchValue] = useState(undefined);
  const [equipos, setEquipos] = useState([]);
  const paginationObject = usePagination({
    maxCantRow: 7,
    cantElements: equipos.length,
  });
  const { dataOrdered, sortTable } = useOrderTable({
    data: equipos,
    initProperty: "createdAt",
  });

  const handleClickSearch = (value) => {
    setSearchValue(value);
  };

  useEffect(() => {
    if (searchValue === undefined) {
      setSearchValue(localStorage.getItem("search"));
    }
  }, [response]);

  useEffect(() => {
    if (response) {
      if (searchValue) {
        const equipFiltered = response.filter((equipo) => {
          const coincidence = similarity(equipo.name, searchValue);
          return coincidence > 0.3;
        });
        setEquipos(equipFiltered);
      } else {
        setEquipos(response);
      }
    }
  }, [searchValue, response]);

  return (
    <>
      <Navbar
        title="Búsqueda de equipos"
        searchValue={searchValue}
        handleClickSearch={handleClickSearch}
      />
      <div className="px-20 pt-20 pb-10 vp-desktop">
        <h1 className="mb-2 font-objetive-bold">
          {searchValue || "Todos los equipos"} - {equipos.length} Resultados de
          la búsqueda
        </h1>
        <table className="w-full table-auto">
          <tbody>
            {dataOrdered.map((equipo) => {
              return (
                <tr className="relative" key={equipo.id}>
                  <td
                    className={`py-4 text-xs transition-padding duration-500 ease-in-out border-b border-gray-300 font-objetive-medium`}
                  >
                    {equipo.name}
                  </td>
                  <td
                    className={`py-4 text-xs transition-padding duration-500 ease-in-out truncate border-b border-gray-300 font-objetive-regular`}
                  >
                    {equipo.linea.name} - {equipo.linea.lugar} -{" "}
                    {equipo.estacion.name}
                  </td>
                  <td
                    className={`py-4 text-xs transition-padding duration-500 ease-in-out border-b border-gray-300 font-objetive-regular`}
                  >
                    A cargo de: {equipo.empresa.name}
                  </td>
                  <td
                    className={`py-4 border-b transition-padding duration-500 ease-in-out border-gray-300`}
                  >
                    <button className="text-xs text-black underline font-objetive-bold">
                      <Link
                        to={{
                          pathname: "/equipment/details",
                          state: { id: equipo.id },
                        }}
                      >
                        Ver ficha
                      </Link>
                    </button>
                  </td>
                  {userSelector.user.role === "Admin" ? (
                    <td
                      className={`py-4 border-b transition-padding duration-500 ease-in-out border-gray-300`}
                    >
                      <button className="text-xs underline font-objetive-bold text-app-purple-300">
                        <Link
                          to={{
                            pathname: "/equipment/edit",
                            state: { id: equipo.id },
                          }}
                        >
                          Editar
                        </Link>
                      </button>
                    </td>
                  ) : null}

                  {userSelector.user.role === "Admin" ? (
                    <td
                      className={`py-4 border-b transition-padding duration-500 ease-in-out border-gray-300`}
                    >
                      <button className="text-xs underline font-objetive-bold text-app-purple-300">
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
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
    </>
  );
};

export default Search;
