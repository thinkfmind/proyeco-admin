import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../@app/navbar";
import { useSelector } from "react-redux";
import Table from "./table";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";
import { backendUrl } from "../../config";

const Trash = () => {
  const userSelector = useSelector((store) => store.user);
  const [data, setData] = useState([]);

  const alert = (id, tag) => {
    Swal.fire({
      title: "¿Eliminar de forma permanente?",
      showCancelButton: true,
      html: "Se eliminaran todos los datos asociados",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      customClass: {
        container: 'sw-container',
        title: 'sw-title text-lg font-objetive-bold',
        confirmButton: 'sw-confirm font-objetive-bold',
        cancelButton: 'sw-cancel font-objetive-bold',
        htmlContainer: 'sw-html font-objetive-medium'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        deleteItem(id, tag);
      }
    });
  };

  const consult = async () => {
    const toastLoading = toast.loading("Cargando...");
    try {
      const res2 = await axios.get(
        `${backendUrl}/actividad/trash/get`,
        {
          headers: {
            Authorization: `Bearer ${userSelector.user.jwtToken}`,
          },
        }
      );
      setData(res2.data);
      toast.dismiss(toastLoading);
    } catch (error) {
      toast.dismiss(toastLoading);
      toast.error("Error al conectarse al servidor!");
    }
  };

  const removeFromTrash = async (id, tag) => {
    const toastLoading = toast.loading("Cargando...");
    try {
      await axios({
        method: "PUT",
        url: `${backendUrl}/${tag.toLowerCase()}/trash/${id}`,
        data: { state: false },
        headers: {
          Authorization: `Bearer ${userSelector.user.jwtToken}`,
        },
      });
      toast.dismiss(toastLoading);
      toast.success("Restaurado con éxito!");
      consult();
    } catch {
      toast.dismiss(toastLoading);
      toast.error("Error al restaurar!");
    }
  };

  const deleteItem = async (id, tag) => {
    const toastLoading = toast.loading("Eliminando...");
    try {
      await axios({
        method: "DELETE",
        url: `${backendUrl}/${tag.toLowerCase()}/${id}`,
        headers: {
          Authorization: `Bearer ${userSelector.user.jwtToken}`,
        },
      });
      toast.dismiss(toastLoading);
      toast.success("Eliminado con éxito!");
      consult();
    } catch {
      toast.dismiss(toastLoading);
      toast.error("Error al eliminar!");
    }
  };

  useEffect(() => {
    consult();
  }, []);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar title="Papelera" />
      <div className="px-20 pt-20 pb-10 vp-desktop">
        <h3 className="mb-2 font-objetive-bold">Papelera</h3>
        <div className="my-4 space-x-10 text-base font-objetive-bold text-app-purple-300">
          <button className="text-app-purple-300 font-objetive-bold">
            Todos
          </button>
        </div>
        <Table data={data} removeFromTrash={removeFromTrash} alert={alert} />
      </div>
    </>
  );
};

export default Trash;
