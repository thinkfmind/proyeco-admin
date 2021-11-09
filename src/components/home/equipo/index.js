const Equipo = ({ name, id, handler }) => (
  <div key={id} onClick={() => {
    handler(name, id);
  }} className="cursor-pointer flex flex-col items-center mr-4">
    <div className="bg-app-green-2 hover:bg-app-green-4  px-6 pt-4 pb-3 rounded-full text-app-green-1 text-center font-objetive-regular">
      {name}
    </div>
  </div>
);

export default Equipo;
