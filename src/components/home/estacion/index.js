const Estacion = ({ name, allEstaciones, id, handler, equiposQuanty, equiposFuncionando, select }) => {
  if (equiposQuanty > 0 || allEstaciones) {
    return (
      <div
        onClick={() => {
          handler(id, name);
        }}
        className={`${select === name ? 'bg-app-red-4': 'bg-app-red-3'} cursor-pointer text-center mr-4 rounded-3xl hover:bg-app-red-4`}
      >
        <div className="pt-6 pb-4 px-4">
          <div className="font-objetive-medium text-app-red-2">{name}</div>
          <div className="font-objetive-bold text-app-red-2">
            {equiposQuanty} equipos
          </div>
        </div>
        <div className="bg-app-red-2 px-4 pt-5 pb-4 rounded-3xl text-app-yellow-4 text-sm font-objetive-regular">
          <span className="font-objetive-bold">
            {equiposFuncionando}/{equiposQuanty}
          </span>{" "}
          equipos activos <br /> (
          {equiposQuanty === 0
            ? 0
            : Math.trunc((equiposFuncionando * 100) / equiposQuanty)}
          %)
        </div>
      </div>
    );
  } else {
    return <div />;
  }
};

export default Estacion;
