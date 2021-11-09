import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Link, useHistory } from "react-router-dom";
import {
  ChevronLeftIcon,
  DocumentDownloadIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import { useSelector } from "react-redux";
import InputDataList from "../../../../components/form/textInput/datalist";
import ItemSelector from "../../../../components/form/itemSelector";
import { useDropzone } from "react-dropzone";
import ItemSelectorWithIcon from "../../../../components/form/itemSelectorWithIcon";
import Navbar from "../../../../@app/navbar";
import Alert from "../../../../components/alert";
import Table from "../table";
import { backendUrl } from "../../../../config";

const EquipmentCreate = (props) => {
  const { id } = props.location.state;
  const userSelector = useSelector((store) => store.user);
  const [data, setData] = useState([]);
  const [nameEquipo, setNameEquipo] = useState("");
  const [nameEquipoError, setNameEquipoError] = useState(false);
  const [linea, setLinea] = useState("");
  const [lineaError, setLineaError] = useState(false);
  const [estacion, setEstacion] = useState("");
  const [estacionError, setEstacionError] = useState(false);
  const [empresa, setEmpresa] = useState("");
  const [empresaId, setEmpresaId] = useState("");
  const [empresaError, setEmpresaError] = useState(false);
  const [dataLineas, setDataLineas] = useState([]);
  const [dataEquipos, setDataEquipos] = useState([]);
  const [dataEstaciones, setDataEstaciones] = useState([]);
  const [successAlert, setSuccessAlert] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [dataListEquipo, setDataListEquipo] = useState([]);
  const [uploadadFile, setUploadadFile] = useState("");
  const [file, setFile] = useState([]);

  let history = useHistory();

  const onDrop = useCallback(
    (acceptedFiles) => {
      setFile([...file, ...acceptedFiles]);
    },
    [file]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: "application/pdf",
  });

  const files = file.map((file) => <div key={file.path}>{file.path}</div>);

  const deleteFile = () => {
    setUploadadFile("");
    setFile([]);
  };

  const onChangeNameEquipo = (value) => {
    setNameEquipo(value);
    setNameEquipoError(false);

    const result = dataEquipos.filter((equipo) => {
      return equipo.identificacion === value;
    });

    setEmpresa(result.length > 0 ? result[0].empresa.name : "");
    setEmpresaId(result.length > 0 ? result[0].empresa.id : "");
  };

  const successAlertHandler = () => {
    setSuccessAlert(true);
    setTimeout(() => {
      setSuccessAlert(false);
      history.push("/equipment");
    }, 1500);
  };

  const onSubmit = async () => {
    const toastLoading = toast.loading("Cargando...");
    let errNameEquipo = false;
    let errLinea = false;
    let errEstacion = false;
    let errEmpresa = false;

    if (nameEquipo.length < 1) {
      setNameEquipoError(true);
      errNameEquipo = true;
    }

    if (linea.length < 1) {
      setLineaError(true);
      errLinea = true;
    }

    if (estacion.length < 1) {
      setEstacionError(true);
      errEstacion = true;
    }

    if (empresa.length < 1) {
      setEmpresaError(true);
      errEmpresa = true;
    }

    if (!errNameEquipo && !errLinea && !errEstacion && !errEmpresa) {
      try {
        const formData = new FormData();
        formData.append("equipo", nameEquipo);
        formData.append("linea", linea);
        formData.append("estacion", estacion);
        formData.append("empresa", empresaId);
        formData.append("pdf", file[0]);

        await axios({
          method: "PUT",
          url: `${backendUrl}/historico/${id}`,
          data: formData,
          headers: {
            Authorization: `Bearer ${userSelector.user.jwtToken}`,
            "Content-Type":
              "multipart/form-data boundary=" +
              Math.random().toString().substr(2),
          },
        });
        setNameEquipo("");
        setLinea("");
        setEstacion("");
        setEmpresa("");
        toast.dismiss(toastLoading);
        successAlertHandler();
      } catch {
        toast.dismiss(toastLoading);
        toast.error("Error al cargar el equipo!");
      }
    }
  };

  const [refreshEstacion, setRefreshEstacion] = useState("");
  const handleSelectLinea = (value) => {
    setNameEquipo(""); // para borrar el nombre de equipo alc ambiar linea
    const result = dataEstaciones.filter((estacion) => {
      return estacion.linea === value;
    });
    setLinea(value);
    setEstacion("");
    setNameEquipo("");
    setRefreshEstacion(result);
  };

  const handleSelectEstacion = (value) => {
    setEstacion(value);
    setNameEquipo(""); // para borrar el nombre de equipo alc ambiar estacion
    const result = dataEquipos.filter((equipo) => {
      console.log(value);
      return equipo.estacion.id === value;
    });
    setDataListEquipo(result);
  };

  const handleSelectEmpresa = (value) => {
    setEmpresa(value);
  };

  const sendToTrash = async (id) => {
    console.log(id);
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
      getActivityData();
      toast.dismiss(toastLoading);
      toast.success("Registro enviado a la papelera!");
    } catch {
      toast.dismiss(toastLoading);
      toast.error("Error al enviar a la papelera!");
    }
  };

  const [activityData, setActivityData] = useState([]);
  const getActivityData = async () => {
    const toastLoading = toast.loading("Cargando...");
    try {
      const res = await axios.get(`${backendUrl}/actividad`, {
        headers: {
          Authorization: `Bearer ${userSelector.user.jwtToken}`,
        },
      });
      setActivityData(res.data);
      toast.dismiss(toastLoading);
    } catch (e) {
      toast.dismiss(toastLoading);
    }
  };

  const consult = async () => {
    const toastLoading = toast.loading("Cargando...");
    try {
      const res = await axios.get(`${backendUrl}/user/`, {
        headers: {
          Authorization: `Bearer ${userSelector.user.jwtToken}`,
        },
      });
      const res2 = await axios.get(`${backendUrl}/linea/`, {
        headers: {
          Authorization: `Bearer ${userSelector.user.jwtToken}`,
        },
      });
      const res3 = await axios.get(`${backendUrl}/estacion/`, {
        headers: {
          Authorization: `Bearer ${userSelector.user.jwtToken}`,
        },
      });
      const res4 = await axios.get(`${backendUrl}/equipo/`, {
        headers: {
          Authorization: `Bearer ${userSelector.user.jwtToken}`,
        },
      });

      const sanitize = res.data.filter((user) => {
        return user.role === "Empresa";
      });

      setData(sanitize);
      setDataLineas(res2.data);
      setDataEstaciones(res3.data);
      setDataEquipos(res4.data);

      const res5 = await axios.get(
        `${backendUrl}/historico/${id}`,
        {
          headers: {
            Authorization: `Bearer ${userSelector.user.jwtToken}`,
          },
        }
      );

      setLinea(res5.data.linea);
      setEmpresa(res5.data.empresa);
      setUploadadFile(res5.data.key);
      setEmpresaId(res5.data.empresa.id);

      const result = res3.data.filter((estacion) => {
        return estacion.linea === res5.data.linea;
      });

      const res7 = await axios.get(`${backendUrl}/actividad`, {
        headers: {
          Authorization: `Bearer ${userSelector.user.jwtToken}`,
        },
      });

      setActivityData(res7.data);

      setRefreshEstacion(result);
      setEstacion(res5.data.estacion);

      setNameEquipo(res5.data.equipo.identificacion);

      toast.dismiss(toastLoading);
    } catch {
      toast.dismiss(toastLoading);
      toast.error("Error al conectarse al servidor!");
    }
  };

  useEffect(() => {
    consult();
  }, [id]);

  return (
    <>
      {successAlert ? <Alert text="Historico cargado" /> : null}
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar title="Registro de mantenimiento" />
      <div className="px-20 pb-20 vp-desktop">
        <div className="flex items-end justify-end mt-14">
          <div className="flex">
            <Link to="/equipment/activity">
              <ChevronLeftIcon className="w-5 h-5 mr-2 text-gray-700" />
            </Link>
            <Link className="font-objetive-medium" to="/equipment/activity">
              Volver
            </Link>
          </div>
        </div>
        <div className="relative w-full px-10 pt-10 pb-24 mt-6 bg-gray-100 rounded-3xl">
          <h1 className="text-xl font-objetive-bold mb-6">
            Cargar PDF datos histórico
          </h1>
          <div className="flex">
            <div className="flex flex-1">
              <div className="flex-1 pr-6">
                <ItemSelectorWithIcon
                  data={dataLineas}
                  text="Línea"
                  eventHandler={handleSelectLinea}
                  value={linea}
                  disabled={true}
                />
              </div>
              <div className="flex-1 pr-6">
                <ItemSelectorWithIcon
                  data={refreshEstacion}
                  text="Estacion"
                  eventHandler={handleSelectEstacion}
                  value={estacion}
                  disabled={true}
                />
              </div>
            </div>
            <div className="flex-1 pl-14">
              <InputDataList
                placeholder="Nombre del equipo"
                error={nameEquipoError}
                eventHandler={onChangeNameEquipo}
                value={nameEquipo}
                disabled={true}
                data={dataListEquipo}
                not="No hay equipos cargados en la estación seleccionada"
                id="empresaselect"
              />
            </div>
          </div>

          <div className="flex mt-8">
            <div className="flex-1 pr-14">
              <div className="w-5/6">
                <div className="pl-2 mb-4 font-objetive-medium">
                  Mantenimiento a cargo de
                </div>
                <ItemSelector
                  data={data}
                  text="Empresa"
                  eventHandler={handleSelectEmpresa}
                  value={empresa}
                  disabled={true}
                />
              </div>
            </div>
            <div className="flex flex-col flex-1 mt-4 ml-2">
              <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />
                <div className="flex items-center mr-10 cursor-pointer">
                  <div className="w-20 h-20 flex justify-center align-middle content-center items-center bg-gray-300 rounded-xl">
                    <DocumentDownloadIcon className="w-10 h-10 text-gray-700 " />
                  </div>
                  <div className="ml-2">
                    <h3 className="underline font-objetive-bold text-app-violet-300">
                      Seleccionar pdf
                    </h3>
                    <h4 className="text-sm text-gray-700 font-objetive-regular w-52">
                      {files.length > 0
                        ? files
                        : uploadadFile
                        ? uploadadFile
                        : "No se selecciono un pdf"}
                    </h4>
                  </div>
                </div>
              </div>
              {files.length > 0 || uploadadFile ? (
                <div
                  onClick={deleteFile}
                  className="flex items-center justify-center w-20 h-5 mt-2 bg-red-600 cursor-pointer rounded-xl"
                >
                  <TrashIcon className="w-4 h-4 text-white" />
                </div>
              ) : null}
            </div>
          </div>

          <button
            onClick={onSubmit}
            type="button"
            className="absolute inline-flex items-center px-4 pt-4 pb-3 text-base text-white border border-transparent rounded-full shadow-sm bottom--20 right-32 font-objetive-medium bg-app-purple-btn hover:bg-red-500 focus:outline-none "
          >
            Guardar y cargar
          </button>
        </div>

        <div className="mt-20">
          <Table data={activityData} sendToTrash={sendToTrash} />
        </div>
      </div>
    </>
  );
};

export default EquipmentCreate;
