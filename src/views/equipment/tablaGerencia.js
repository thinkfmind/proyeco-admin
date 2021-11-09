import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import { logout } from "../../redux/ducks/user";
import Navbar from "../../@app/navbar";
import Table from "./tablas/gerencia";
import TableOrderPagination from "../../components/tableOrderPagination";
import useOrderTable from "../../hooks/useOrderTable";
import { ChevronLeftIcon } from "@heroicons/react/outline";
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

  const consult = async () => {
    const toastLoading = toast.loading("Cargando...");
    try {
      const res = await axios.get(`${backendUrl}/equipo`, {
        headers: {
          Authorization: `Bearer ${userSelector.user.jwtToken}`,
        },
      });

      if (userSelector.user.role === "Empresa") {
        const result = res.data.filter((equipo) => {
          return equipo.empresa.id === userSelector.user.id;
        });
        setData(result);
      } else {
        setData(res.data);
      }

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
      <Navbar title="Carga, edición y registro de equipos" />
      <div className="px-20 pb-10 vp-desktop">
        <div className="flex justify-end w-full mt-14">
          <Link to="/home">
            <ChevronLeftIcon className="w-5 h-5 mr-2 text-gray-700" />
          </Link>
          <Link className="font-objetive-medium" to="/home">
            Volver
          </Link>
        </div>
        <Table
          role={userSelector.user.role}
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

export default Equipment;
