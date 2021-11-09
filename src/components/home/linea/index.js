import { LocationMarkerIcon } from "@heroicons/react/solid";

const Linea = ({ name, lugar, equiposQuanty, equiposFuncionando, handler, id, select }) => (
  <div
    onClick={() => {
      handler(id, name, lugar);
    }}
    className={`${select === name ? 'bg-app-yellow-6' : 'bg-app-yellow-3'} cursor-pointer text-center mr-4 rounded-3xl  hover:bg-app-yellow-6`}
  >
    <div className="pt-5 pb-4 px-4">
      <div className="font-objetive-medium text-app-yellow-2">{name}</div>
      <div className="flex justify-center my-2">
        <LocationMarkerIcon
          className="h-5 w-5 text-app-yellow-2 mr-1"
          aria-hidden="true"
        />
        <div className="font-objetive-regular text-app-yellow-2">{lugar}</div>
      </div>
      <div className="font-objetive-bold text-app-yellow-2">
        {equiposQuanty} equipos
      </div>
    </div>
    <div className="bg-app-yellow-2 px-4 pt-5 pb-4 rounded-3xl text-app-yellow-4 text-sm font-objetive-regular">
      <span className="font-objetive-bold">
        {equiposFuncionando}/{equiposQuanty} 
      </span>{' '}
      equipos activos <br /> (
      {equiposQuanty === 0
        ? 0
        : Math.trunc((equiposFuncionando * 100) / equiposQuanty)}
      %)
    </div>
  </div>
);

export default Linea;
