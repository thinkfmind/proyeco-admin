import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../../../@app/navbar";
import Table from "./table";
import { useSelector } from "react-redux";
import { ChevronLeftIcon } from "@heroicons/react/outline";
import { backendUrl } from "../../../config";

const Equipment = () => {
  const userSelector = useSelector((store) => store.user);
  const [data, setData] = useState([]);

  const consult = async () => {
    const toastLoading = toast.loading("Cargando...");
    try {
      const res = await axios.get(`${backendUrl}/actividad`, {
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

  const sendToTrash = async (id) => {
    const toastLoading = toast.loading("Cargando...");
    try {
      await axios({
        method: "PUT",
        url: `${backendUrl}/actividad/trash/${id}`,
        data: { state: true },
        headers: {
          Authorization: `Bearer ${userSelector.user.jwtToken}`,
        },
      });
      consult();
      toast.dismiss(toastLoading);
      toast.success("Registro enviado a la papelera!");
    } catch {
      toast.dismiss(toastLoading);
      toast.error("Error al enviar a la papelera!");
    }
  };

  useEffect(() => {
    consult();
  }, []);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar title="Carga, edición y registro de equipos" />
      <div className="px-20 vp-desktop">
        <div className="flex mt-14">
          <Link to="/equipment">
            <ChevronLeftIcon className="w-5 h-5 mr-2 text-gray-700" />
          </Link>
          <Link className="font-objetive-medium" to="/equipment">
            Volver
          </Link>
        </div>
        <div className="flex mt-10">
          <Link to="/equipment/activity/create">
            <button
              type="button"
              className="px-6 pt-4 pb-3 mr-6 text-base bg-gray-200 border border-transparent rounded-full shadow-sm text-app-blue-600 right-32 font-objetive-bold focus:outline-none "
            >
              Cargar nuevo registro de actividad
            </button>
          </Link>
          <Link to="/equipment/activity/historic/create">
            <button
              type="button"
              className="px-6 pt-4 pb-3 mr-8 text-base bg-gray-200 border border-transparent rounded-full shadow-sm text-app-blue-600 right-32 font-objetive-bold focus:outline-none"
            >
              Cargar pdf historico
            </button>
          </Link>
        </div>
      </div>
      <div className="px-20 pb-10 vp-desktop">
        <div className="mt-10">
          <Table data={data} sendToTrash={sendToTrash} />
        </div>
      </div>
    </>
  );
};

export default Equipment;
