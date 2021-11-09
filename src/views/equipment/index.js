import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import Navbar from "../../@app/navbar";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { logout } from "../../redux/ducks/user";
import Table from "../../components/users/table/equipos";
import TableOrderPagination from "../../components/tableOrderPagination";
import useOrderTable from "../../hooks/useOrderTable";
import { backendUrl } from "../../config";

const MAX_CANT_ROW = 7;

const Equipment = () => {
  const userSelector = useSelector((store) => store.user);
  let history = useHistory();
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(1);
  const { dataOrdered, sortTable } = useOrderTable({
    data,
    initProperty: "createdAt",
  });

  const changeData = (dataLocal) => {
    setData(dataLocal);
  };

  const sendToTrash = async (id) => {
    const toastLoading = toast.loading("Cargando...");
    try {
      await axios({
        method: "PUT",
        url: `${backendUrl}/equipo/trash/${id}`,
        data: { state: true },
        headers: {
          Authorization: `Bearer ${userSelector.user.jwtToken}`,
        },
      });
      getEquipment();
      toast.dismiss(toastLoading);
      toast.success("Equipo enviado a la papelera!");
    } catch {
      toast.dismiss(toastLoading);
      toast.error("Error al enviar a la papelera!");
    }
  };

  const getEquipment = async () => {
    const toastLoading = toast.loading("Cargando...");
    try {
      const res = await axios.get(`${backendUrl}/equipo`, {
        headers: {
          Authorization: `Bearer ${userSelector.user.jwtToken}`,
        },
      });
      setData(res.data);
      toast.dismiss(toastLoading);
    } catch (e) {
      toast.dismiss(toastLoading);
    }
  };

  const consult = async (source) => {
    const toastLoading = toast.loading("Cargando...");
    try {
      const res = await axios.get(`${backendUrl}/equipo`, {
        cancelToken: source.token,
        headers: {
          Authorization: `Bearer ${userSelector.user.jwtToken}`,
        },
      });
      setData(res.data);
      toast.dismiss(toastLoading);
    } catch (error) {
      toast.dismiss(toastLoading);
      if (error.response) {
        if (error.response.status === 401) {
          dispatch(logout(history));
        }
      }
    }
  };

  const newPagination = (newPaginationValue) => {
    setPagination(newPaginationValue);
  };

  useEffect(() => {
    let source = axios.CancelToken.source();
    consult(source);

    return () => {
      source.cancel();
    };
  }, []);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar title="Carga, edición y registro de equipos" />
      <div className="px-20 vp-desktop">
        <div className="flex mt-14">
          <Link to="/equipment/create">
            <button
              type="button"
              className="px-6 pt-4 pb-3 mr-6 text-base text-white border border-transparent rounded-full shadow-sm right-32 font-objetive-medium bg-app-purple-btn focus:outline-none "
            >
              Cargar nuevo equipo
            </button>
          </Link>
          <Link to="/equipment/activity">
            <button
              type="button"
              className="px-6 pt-4 pb-3 mr-8 text-base bg-white border-2 rounded-full shadow-sm right-32 font-objetive-medium text-app-purple-btn border-app-purple-btn focus:outline-none"
            >
              Crear registro de actividad
            </button>
          </Link>
          <Link to="/equipment/disponibility">
            <button
              type="button"
              className="pt-4 pb-3 text-base underline bg-white right-32 font-objetive-medium text-app-purple-btn focus:outline-none"
            >
              Disponibilidad de equipos
            </button>
          </Link>
        </div>
      </div>
      <div className="px-20 pb-10 vp-desktop">
        <Table
          data={dataOrdered}
          pagination={pagination}
          maxCantRow={MAX_CANT_ROW}
          changeData={changeData}
          sendToTrash={sendToTrash}
        />
        <TableOrderPagination
          pagination={pagination}
          newPagination={newPagination}
          cantElements={data.length}
          maxCantRow={MAX_CANT_ROW}
          order={{ sortTable, alphabetic: "name", date: "createdAt" }}
        />
      </div>
    </>
  );
};

export default Equipment;
