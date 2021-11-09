import { LocationMarkerIcon } from "@heroicons/react/outline";

import { Link } from "react-router-dom";

const Row = ({ index, user }) => {
  return (
    <div
      className={`flex justify-between border-b-2 pt-3 pb-2  ${
        index === 0 ? "border-t" : ""
      }`}
    >
      <div className="flex w-48 space-x-4 text-xs text-left font-objetive-regular">
        <p className="truncate">{user.name}</p>
      </div>
      <div className="w-48 text-xs text-left w-42 font-objetive-regular">
        <p className="truncate">{user.tipo}</p>
      </div>
      <div className="flex w-64 text-xs font-objetive-regular">
        <LocationMarkerIcon className="w-4 h-4 mr-2" />
        <p className="truncate">
          {user.linea.name} - {user.linea.lugar} - {user.estacion.name} 
        </p>
      </div>
      <div className="text-xs text-left w-42 font-objetive-regular">
        <p className={`truncate ${user.funciona ? "" : "text-red-600"}`}>
          {user.estado}
        </p>
      </div>
      <div className="flex ml-20">
        <Link
          to={{
            pathname: "/equipment/details",
            state: { id: user.id },
          }}
          className={`ml-8 font-objetive-medium text-xs underline text-gray-600 cursor-pointer`}
        >
          Ver Ficha
        </Link>
      </div>
    </div>
  );
};

export default Row;
