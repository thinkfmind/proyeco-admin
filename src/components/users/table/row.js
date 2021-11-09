import { useState } from "react";
import {
  DocumentDownloadIcon,
  LocationMarkerIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import dateFormat from "dateformat";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const Row = ({ index, isChecked, user, sendToTrash }) => {
  const [checkZip, setCheckZip] = useState(isChecked);

  const handleChange = () => {
    setCheckZip(!checkZip);
  };

  useEffect(() => {
    setCheckZip(isChecked);
  }, [isChecked]);

  return (
    <div
      className={`flex justify-between border-b-2 pt-3 pb-2 space-x-8 ${
        index === 0 ? "border-t" : ""
      }`}
    >
      <div className="flex w-2/12 space-x-4 text-sm text-left font-objetive-regular ">
        <input
          onChange={handleChange}
          type="checkbox"
          className="bg-gray-400 border-2 rounded-sm input-check-downloadZip"
          value={user.id}
          checked={checkZip}
        />
        <p className="w-48 text-xs truncate">{user.name}</p>
      </div>
      <div className="text-xs text-left w-100 font-objetive-regular w-36">
        <p className="truncate">{user.tipo}</p>
      </div>
      <div className="flex w-3/12 text-xs text-left font-objetive-regular ">
        <LocationMarkerIcon className="w-4 h-4 mr-2" />
        <p className="truncate">
          {user.linea.name} - {user.linea.lugar} - {user.estacion.name}
        </p>
      </div>
      <div className="w-1/12 text-xs text-left w-100 font-objetive-regular">
        <p className={`truncate ${user.funciona ? "" : "text-red-600"}`}>
          {user.estado}
        </p>
      </div>
      <div className="w-1/12 text-xs text-center  font-objetive-regular">
        {dateFormat(Date.parse(user.createdAt), "dd/mm/yy")}
      </div>
      <div className="flex ml-20 ">
        {user.historico ? (
          <Link
            to={{
              pathname: "/equipment/activity/historic/update",
              state: { id: user.historicoId },
            }}
            className={` font-objetive-medium text-sm underline text-gray-600 cursor-pointer`}
          >
            <DocumentDownloadIcon className="w-6 h-6" aria-hidden="true" />
          </Link>
        ) : (
          <button disabled className="text-gray-500 disabled:text-gray-200">
            <DocumentDownloadIcon className="w-6 h-6" aria-hidden="true" />
          </button>
        )}

        <Link
          to={{
            pathname: "/equipment/details",
            state: { id: user.id },
          }}
          className={`ml-8 font-objetive-medium text-xs underline text-gray-600 cursor-pointer`}
        >
          Ver
        </Link>

        <Link
          to={{
            pathname: "/equipment/edit",
            state: { id: user.id },
          }}
          className={`mx-8 font-objetive-medium text-xs underline text-app-purple-btn cursor-pointer`}
        >
          Editar
        </Link>
        <div
          onClick={() => {
            sendToTrash(user.id);
          }}
        >
          <TrashIcon
            className={`h-4 w-4 text-app-purple-btn cursor-pointer`}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
};

export default Row;
