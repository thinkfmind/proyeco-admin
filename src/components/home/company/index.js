const Company = ({ name, id, handler, equiposQuanty, equiposFuncionando, picture, hide, select }) => (
  <div onClick={() => {handler(id, name)}} className={`cursor-pointer flex flex-col items-center mr-4 ${select === name ? '' : 'opacity-40'}`}>
    <div className={`${select === name ? 'bg-app-purple-300 text-app-purple-200' : 'bg-app-purple-300 text-app-purple-300'}  rounded-full  text-center font-objetive-regular ${picture ? 'px-5 pt-1.5 pb-1.5' : 'px-6 pt-4 pb-3'}`}>
      {picture ? (<img alt="Company Logo" className="h-10" src={picture}></img>) : name}
    </div>
    <div className={`bg-app-purple-10 hover:bg-app-purple-20 px-8 pt-4 pb-3 rounded-3xl mt-4 text-app-purple-300 text-center ${hide ? 'hidden': ''}`}>
      <div className="font-objetive-bold">{equiposFuncionando}/{equiposQuanty}</div>
      <div className="font-objetive-regular">equipos activos</div>
      <div className="font-objetive-regular">({equiposQuanty === 0 ? 0 : Math.trunc(equiposFuncionando * 100 / equiposQuanty)}%)</div>
    </div>
  </div>
);

export default Company;
