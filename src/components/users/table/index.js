import { TrashIcon } from "@heroicons/react/outline";
import dateFormat from "dateformat";
import usePagination from "../../../hooks/usePagination";
import useOrderTable from "../../../hooks/useOrderTable";
import TableOrderPagination from "../../tableOrderPagination";

const Table = ({ data, handleEdit, alert }) => {
  const paginationObject = usePagination({
    maxCantRow: 7,
    cantElements: data.length,
  });
  const { dataOrdered, sortTable } = useOrderTable({
    data,
    initProperty: "createdAt",
  });

  if (dataOrdered.length > 0) {
    return (
      <div className="px-20 pb-10 vp-desktop">
        <h1 className="mt-10 mb-6 text-xl font-objetive-bold">
          Usuarios creados
        </h1>
        {dataOrdered.map((user, index) => {
          if (
            index < paginationObject.maxCantRow * paginationObject.pagination &&
            index >=
              paginationObject.pagination * paginationObject.maxCantRow -
                paginationObject.maxCantRow
          ) {
            return (
              <div
                className="flex justify-between pt-3 pb-2 border-b-2"
                key={index + user.id}
              >
                <div className="flex-1 text-sm text-left font-objetive-regular">
                  {user.name}
                </div>
                <div className="flex-1 text-sm text-center font-objetive-regular">
                  Rol: {user.role}
                </div>
                <div className="flex-1 text-sm text-center font-objetive-regular">
                  Usuario: {user.username}
                </div>
                <div className="flex-1 text-sm text-center font-objetive-regular">
                  Creado el {dateFormat(Date.parse(user.createdAt), "dd/mm/yy")}
                </div>
                <div className="flex ml-20">
                  <div
                    className={`mr-4 font-objetive-medium text-sm underline ${
                      user.username === "admin"
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-app-purple-btn cursor-pointer"
                    }`}
                    onClick={() => {
                      if (user.username !== "admin") {
                        handleEdit(
                          user.id,
                          user.name,
                          user.role,
                          user.username,
                          user.picture
                        );
                      }
                    }}
                  >
                    Editar
                  </div>
                  <div
                    onClick={() => {
                      alert(user.id);
                    }}
                  >
                    <TrashIcon
                      className={`h-5 w-5 ${
                        user.username === "admin"
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-app-purple-btn cursor-pointer"
                      }`}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
            );
          }
          return null;
        })}

        <TableOrderPagination
          {...paginationObject}
          order={{ sortTable, alphabetic: "name", date: "createdAt" }}
        />
      </div>
    );
  } else {
    return null;
  }
};

export default Table;
