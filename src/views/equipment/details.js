import Navbar from "../../@app/navbar";
import Description from "../../components/home/equipo/description";
import { ChevronLeftIcon } from "@heroicons/react/outline";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const EquipmentDetails = (props) => {
  const { id } = props.location.state;
  const userSelector = useSelector((store) => store.user);
  const setEquipoHandler = () => {};
  return (
    <>
      <Navbar title="Carga, edición y registro de equipos" />
      <div className="justify-center px-20 vp-desktop">
        <div className="flex mt-14">
          {userSelector.user.role === "Admin" ? (
            <>
              <Link to="/equipment" className="flex w-full justify-end">
                <ChevronLeftIcon className="w-5 h-5 mr-2 text-gray-700" />
              </Link>
              <Link className="font-objetive-medium" to="/equipment">
                Volver
              </Link>
            </>
          ) : (
            <>
              <Link to="/equipmentalt" className="flex w-full justify-end">
                <ChevronLeftIcon className="w-5 h-5 mr-2 text-gray-700" />
              </Link>
              <Link className="font-objetive-medium" to="/equipmentalt">
                Volver
              </Link>
            </>
          )}
        </div>
        <Description id={id} closeHandler={setEquipoHandler} hidex={true} />
      </div>
    </>
  );
};

export default EquipmentDetails;
