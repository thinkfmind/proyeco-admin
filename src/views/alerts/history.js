import { useState, useEffect } from "react";
import Navbar from "../../@app/navbar";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import TableOrderPagination from "../../components/tableOrderPagination";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { logout } from "../../redux/ducks/user";
import useOrderTable from "../../hooks/useOrderTable";
import Row from "../../components/alert/row";
import { backendUrl } from "../../config";

const MAX_CANT_ROW = 7;

const AlertHistory = () => {
  const userSelector = useSelector((store) => store.user);
  let history = useHistory();
  const dispatch = useDispatch();
  const [pagination, setPagination] = useState(1);
  const [data, setData] = useState([]);
  const { dataOrdered, sortTable } = useOrderTable({
    data,
    initProperty: "createdAt",
  });

  const consult = async () => {
    const toastLoading = toast.loading("Cargando...");
    try {
      const res = await axios.get(`${backendUrl}/alerta`, {
        headers: {
          Authorization: `Bearer ${userSelector.user.jwtToken}`,
        },
      });


      if (userSelector.user.role === "Empresa") {
        const result = res.data.filter((alerta) => {
          return alerta.to === userSelector.user.name || alerta.to === userSelector.user.name;
        });
        setData(result);
      } else {
        setData(res.data);
      }

      toast.dismiss(toastLoading);
    } catch (error) {
      toast.dismiss(toastLoading);
      toast.error("Error");
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
      <Navbar title="Historial de alertas" />
      <div className="px-20 pt-20 pb-10 vp-desktop">
        <h1 className="mb-2 font-objetive-bold">Últimas alertas emitidas</h1>
        <table className="w-full table-auto">
          <tbody>
            {dataOrdered.map((item, index) => {
              if (
                index < MAX_CANT_ROW * pagination &&
                index >= pagination * MAX_CANT_ROW - MAX_CANT_ROW
              ) {
                return <Row key={item.id} item={item} />;
              }
              return null;
            })}
          </tbody>
        </table>
        <TableOrderPagination
          pagination={pagination}
          newPagination={newPagination}
          cantElements={data.length}
          maxCantRow={MAX_CANT_ROW}
          order={{ sortTable, alphabetic: "equipo", date: "createdAt" }}
        />
      </div>
    </>
  );
};

export default AlertHistory;
