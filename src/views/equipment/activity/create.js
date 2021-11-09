import { useEffect, useState, forwardRef } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Link, useHistory } from "react-router-dom";
import { ChevronLeftIcon, CalendarIcon } from "@heroicons/react/outline";
import InputDataList from "../../../components/form/textInput/datalist";
import { useSelector } from "react-redux";
import NumberPick from "../../../components/form/numberPick";
import ItemSelectorWithIcon from "../../../components/form/itemSelectorWithIcon";
import TextInput from "../../../components/form/textInput";
import Navbar from "../../../@app/navbar";
import DatePicker from "react-datepicker";
import Table from "./table";
import Alert from "../../../components/alert";
import "react-datepicker/dist/react-datepicker.css";
import { backendUrl } from "../../../config";

const EquipmentCreate = () => {
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
  const [estado, setEstado] = useState("Mantenimiento preventivo");
  const [detalle, setDetalle] = useState("");
  const [dataListEquipo, setDataListEquipo] = useState([]);
  const [days, setDays] = useState(1);
  const [detalleError, setDetalleError] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [successAlert, setSuccessAlert] = useState(false);

  let history = useHistory();

  const onChangeDetalles = (value) => {
    setDetalle(value);
    setDetalleError(false);
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

  const handleDays = (value) => {
    setDays(value);
  };

  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <button
      className="flex justify-between pt-4 pb-3 pl-6 pr-2 bg-white border border-gray-300 rounded-full font-objetive-medium sm:text-sm"
      onClick={onClick}
      ref={ref}
    >
      {value} <CalendarIcon className="w-5 h-5 pb-1 ml-8 mr-2 text-gray-700" />
    </button>
  ));

  const successAlertHandler = () => {
    setSuccessAlert(true);
    setTimeout(() => {
      setSuccessAlert(false);
      history.push("/equipment/activity");
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

    if (!errNameEquipo && !errEmpresa & !errLinea && !errEstacion) {
      try {
        await axios({
          method: "POST",
          url: `${backendUrl}/actividad`,
          data: {
            empresa: empresaId,
            equipo: nameEquipo,
            linea: linea,
            estacion: estacion,
            tipo: estado,
            detalles: detalle,
            fecha: startDate,
            dias: days,
          },
          headers: { Authorization: `Bearer ${userSelector.user.jwtToken}` },
        });
        setNameEquipo("");
        setLinea("");
        setEstacion("");
        setEmpresa("");
        setDays(1);
        setDetalle("");

        toast.dismiss(toastLoading);
        successAlertHandler();
      } catch {
        toast.dismiss(toastLoading);
        toast.error("Error al crear el registro!");
      }
    }
    toast.dismiss(toastLoading);
  };

  const [refreshEstacion, setRefreshEstacion] = useState("");
  const handleSelectLinea = (value) => {
    setEmpresa("");
    const result = dataEstaciones.filter((estacion) => {
      return estacion.linea === value;
    });
    setLinea(value);
    setEstacion("");
    setRefreshEstacion(result);
  };

  const handleSelectEstacion = (value) => {
    setEstacion(value);
    setNameEquipo("");
    const result = dataEquipos.filter((equipo) => {
      return equipo.estacion.id === value;
    });
    setDataListEquipo(result);
  };

  const dumb = () => {};

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

      const res7 = await axios.get(`${backendUrl}/actividad`, {
        headers: {
          Authorization: `Bearer ${userSelector.user.jwtToken}`,
        },
      });

      setActivityData(res7.data);

      const sanitize = res.data.filter((user) => {
        return user.role === "Empresa";
      });

      setData(sanitize);
      setDataLineas(res2.data);
      setDataEstaciones(res3.data);
      setDataEquipos(res4.data);
      toast.dismiss(toastLoading);
    } catch {
      toast.dismiss(toastLoading);
      toast.error("Error al conectarse al servidor!");
    }
  };

  const inputRadioSet = (checked, estado) => {
    if (checked) {
      setEstado(estado);
    }
  };

  useEffect(() => {
    consult();
  }, []);

  return (
    <>
      {successAlert ? <Alert text="Registro creado" /> : null}
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
          <h1 className="mb-6 text-xl font-objetive-bold">
            Cargar nuevo registro de actividad
          </h1>
          <div className="flex">
            <div className="flex flex-1">
              <div className="flex-1 pr-6">
                <ItemSelectorWithIcon
                  data={dataLineas}
                  text="Línea"
                  eventHandler={handleSelectLinea}
                  value={linea}
                />
              </div>
              <div className="flex-1 pr-6">
                <ItemSelectorWithIcon
                  data={refreshEstacion}
                  text="Estacion"
                  eventHandler={handleSelectEstacion}
                  value={estacion}
                />
              </div>
            </div>
            <div className="flex-1 pl-14">
              <InputDataList
                placeholder="Nombre del equipo"
                error={nameEquipoError}
                eventHandler={onChangeNameEquipo}
                disabled={estacion ? false : true}
                data={dataListEquipo}
                not="No hay equipos cargados en la estación seleccionada"
                id="empresaselect"
              />
            </div>
          </div>

          <div>
            <h3 className="mt-10 mb-4 font-objetive-medium">
              Tipo de actividad para registrar
            </h3>
            <div className="flex mb-8">
              <div className="flex items-center mr-5 create-equipment">
                <input
                  type="radio"
                  id="e1"
                  onChange={(e) => {
                    inputRadioSet(e.target.checked, "Mantenimiento preventivo");
                  }}
                  name="push-notifications"
                  defaultChecked={true}
                  className="w-3 h-3 text-gray-300 border-gray-900 rounded-full focus:ring-transparent"
                />
                <label
                  htmlFor="e1"
                  className="block pt-1 ml-2 text-sm text-gray-800 font-objetive-medium"
                >
                  Mantenimiento preventivo
                </label>
              </div>
              <div className="flex items-center mr-5 create-equipment">
                <input
                  onChange={(e) => {
                    inputRadioSet(e.target.checked, "Mantenimiento correctivo");
                  }}
                  type="radio"
                  id="e2"
                  name="push-notifications"
                  className="w-3 h-3 text-gray-300 border-gray-900 rounded-full focus:ring-transparent"
                />
                <label
                  htmlFor="e2"
                  className="block pt-1 ml-2 text-sm text-gray-800 font-objetive-medium"
                >
                  Mantenimiento correctivo
                </label>
              </div>
              <div className="flex items-center mr-5 create-equipment">
                <input
                  id="e3"
                  type="radio"
                  name="push-notifications"
                  onChange={(e) => {
                    inputRadioSet(e.target.checked, "Averías");
                  }}
                  className="w-3 h-3 text-gray-300 border-gray-900 rounded-full focus:ring-transparent"
                />
                <label
                  htmlFor="e3"
                  className="block pt-1 ml-2 text-sm text-gray-800 font-objetive-medium"
                >
                  Averías
                </label>
              </div>
            </div>
          </div>

          <TextInput
            placeholder="Detalles de la actividad"
            eventHandler={onChangeDetalles}
            error={detalleError}
            value={detalle}
          />

          <div className="flex justify-between mt-8">
            <div className="w-2/5">
              <div className="pl-2 mb-4 font-objetive-medium">
                Empresa a cargo del mantenimiento
              </div>
              <div className="w-60">
                <TextInput
                  placeholder="Empresa"
                  error={empresaError}
                  eventHandler={dumb}
                  value={empresa}
                  disabled={true}
                />
              </div>
            </div>
            <div className="w-1/4 mr-10">
              <div className="pl-2 mb-4 font-objetive-medium">
                Fecha de registro
              </div>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                customInput={<ExampleCustomInput />}
              />
            </div>

            <div className="w-2/4 mr-4">
              <div className="pl-2 mb-4 font-objetive-medium">
                Cantidad de días que tomo el arreglo
              </div>
              <div className="w-32">
                <NumberPick eventHandler={handleDays} value={days} />
              </div>
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

        <div className="mt-10">
          <div className="mt-20">
            <Table data={activityData} sendToTrash={sendToTrash} />
          </div>
        </div>
      </div>
    </>
  );
};

export default EquipmentCreate;
