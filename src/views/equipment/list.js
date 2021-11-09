import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../../@app/navbar";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import { logout } from "../../redux/ducks/user";
import Table from "../../components/users/table/equipos";
import TableOrderPagination from "../../components/tableOrderPagination";
import useOrderTable from "../../hooks/useOrderTable";
import { backendUrl } from "../../config";

const MAX_CANT_ROW = 7;

const EquipmentList = () => {
  const userSelector = useSelector((store) => store.user);
  let history = useHistory();
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(1);

  const changeData = (dataLocal) => {
    setData(dataLocal);
  };

  const { dataOrdered, sortTable } = useOrderTable({
    data,
    initProperty: "createdAt",
  });
  const consult = async () => {
    const toastLoading = toast.loading("Cargando...");
    try {
      const res = await axios.get(`${backendUrl}/equipo/`, {
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
    consult();
  }, []);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="relative">
        <Navbar title="Listado de equipos" />
        <div className="absolute right-28 -bottom-12">
          <Link
            to="/equipment/create"
            className="px-6 py-4 text-white rounded-full bg-app-violet-300 font-objetive-bold"
          >
            Cargar nuevo equipo
          </Link>
        </div>
      </div>
      <div className="px-20 pt-20 pb-10 vp-desktop">
        <Table
          data={dataOrdered}
          pagination={pagination}
          maxCantRow={MAX_CANT_ROW}
          changeData={changeData}
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

export default EquipmentList;
