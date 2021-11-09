import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import TextInput from "../../components/form/textInput";
import InputDataList from "../../components/form/textInput/datalist";
import ItemSelectorWithIcon from "../../components/form/itemSelectorWithIcon";
import { logout } from "../../redux/ducks/user";
import Alert from "../../components/alert";
import Navbar from "../../@app/navbar";
import { backendUrl } from "../../config";

const EquipmentCreate = () => {
  const userSelector = useSelector((store) => store.user);
  const [nameEquipo, setNameEquipo] = useState("");
  const [nameEquipoError, setNameEquipoError] = useState(false);
  const [nameDest, setNameDest] = useState("");
  const [nameDestError, setNameDestError] = useState(false);
  const [asunto, setAsunto] = useState("");
  const [asuntoError, setAsuntoError] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [mensajeError, setMensajeError] = useState(false);
  const [dataUser, setDataUser] = useState([]);
  const [dataEquipo, setDataEquipo] = useState([]);
  const [dataLinea, setDataLinea] = useState([]);
  const [dataEstacion, setDataEstacion] = useState([]);
  const [linea, setLinea] = useState("");
  const [estacion, setEstacion] = useState("");
  const [dataListEquipo, setDataListEquipo] = useState([]);
  const [successAlert, setSuccessAlert] = useState(false);

  let history = useHistory();
  const dispatch = useDispatch();

  const onChangeNameEquipo = (value) => {
    setNameEquipo(value);
    setNameEquipoError(false);
  };

  const onChangeNameDest = (value) => {
    setNameDest(value);
    setNameDestError(false);
  };

  const onChangeAsunto = (value) => {
    setAsunto(value);
    setAsuntoError(false);
  };

  const onChangeMensaje = (e) => {
    setMensaje(e.target.value);
    setMensajeError(false);
  };

  const successAlertHandler = () => {
    setSuccessAlert(true);
    setTimeout(() => {
      setSuccessAlert(false);
      history.push("/alerts");
    }, 1500);
  };

  const [refreshEstacion, setRefreshEstacion] = useState("");
  const handleSelectLinea = (value) => {
    const result = dataEstacion.filter((estacion) => {
      return estacion.linea === value;
    });
    setLinea(value);
    setEstacion("");
    setNameEquipo("");
    setRefreshEstacion(result);
  };

  const handleSelectEstacion = (value) => {
    setEstacion(value);
    setNameEquipo("");
    const result = dataEquipo.filter((equipo) => {
      return equipo.estacion.id === value;
    });
    setDataListEquipo(result);
  };

  const onSubmit = async () => {
    let errNameEquipo = false;
    let errNameDest = false;
    let errAsunto = false;
    let errMensaje = false;

    if (nameEquipo.length < 1) {
      setNameEquipoError(true);
      errNameEquipo = true;
    }

    if (nameDest.length < 1) {
      setNameDestError(true);
      errNameDest = true;
    }

    if (asunto.length < 1) {
      setAsuntoError(true);
      errAsunto = true;
    }

    if (mensaje.length < 1) {
      setMensajeError(true);
      errMensaje = true;
    }

    if (!errNameEquipo && !errNameDest && !errAsunto && !errMensaje) {
      const toastLoading = toast.loading("Cargando...");

      try {
        await axios.post(
          `${backendUrl}/alerta`,
          {
            equipo: nameEquipo,
            linea: linea,
            estacion: estacion,
            from: userSelector.user.name,
            to: nameDest,
            asunto: asunto,
            mensaje: mensaje,
          },
          {
            headers: {
              Authorization: `Bearer ${userSelector.user.jwtToken}`,
            },
          }
        );
        setNameDest("");
        setNameEquipo("");
        setAsunto("");
        setMensaje("");
        toast.dismiss(toastLoading);
        successAlertHandler();
      } catch {
        toast.dismiss(toastLoading);
        toast.error("Error al crear la alerta");
      }
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

      setDataUser(res.data);

      if (userSelector.user.role === "Empresa") {
        const result = res4.data.filter((equipo) => {
          return equipo.empresa.id === userSelector.user.id;
        });
        setDataEquipo(result);
      } else {
        setDataEquipo(res4.data);
      }

      if (userSelector.user.role === "Empresa") {
        const result = res2.data.filter((linea) => {
          return linea.empresas.includes(userSelector.user.id);
        });
        setDataLinea(result);
      } else {
        setDataLinea(res2.data);
      }

      if (userSelector.user.role === "Empresa") {
        const result = res3.data.filter((estacion) => {
          return estacion.empresas.includes(userSelector.user.id);
        });
        setDataEstacion(result);
      } else {
        setDataEstacion(res3.data);
      }

      // setDataEquipo(res4.data);
      // setDataLinea(res2.data);
      // setDataEstacion(res3.data);
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

  useEffect(() => {
    consult();
  }, []);

  return (
    <>
      {successAlert ? <Alert text="Alerta enviada" /> : null}
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar title="Proyeco" subtitle="Seguimiento, control y mantenimiento" />
      <div className="px-20 pb-20 vp-desktop">
        <div className="relative w-full px-10 pt-10 pb-24 bg-gray-100 mt-14 rounded-3xl">
          <h1 className="mt-2 mb-8 text-xl text-red-500 font-objetive-bold">
            Emitir nueva alerta
          </h1>
          <div className="flex">
            <div className="flex-1">
              <div className="mb-4 font-objetive-medium">
                Seleccione equipos comprometidos
              </div>
              <div className="flex flex-1">
                <div className="flex-1 pr-6">
                  <ItemSelectorWithIcon
                    text="Linea"
                    error={false}
                    data={dataLinea}
                    eventHandler={handleSelectLinea}
                    value={linea}
                  />
                </div>
                <div className="flex-1 pr-6">
                  <ItemSelectorWithIcon
                    text="Estacion"
                    error={false}
                    data={refreshEstacion}
                    eventHandler={handleSelectEstacion}
                    value={estacion}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-1 mb-6">
              <div className="flex-1 pl-6">
                <div className="mb-4 font-objetive-medium">De:</div>
                <div className="pt-4 font-objetive-bold">
                  {userSelector.user.name}
                </div>
              </div>
              <div className="w-3/5 ">
                <div className="pl-2 mb-4 font-objetive-medium">Para:</div>
                <InputDataList
                  placeholder="Nombre del destinatario"
                  error={nameDestError}
                  eventHandler={onChangeNameDest}
                  data={dataUser}
                  not="No hay usuarios cargados"
                  id="usuarioselect"
                />
              </div>
            </div>
          </div>

          <div className="flex mb-6">
            <div className="flex-1 pr-12">
              <InputDataList
                placeholder="Nombre del equipo"
                error={nameEquipoError}
                eventHandler={onChangeNameEquipo}
                data={dataListEquipo}
                disabled={estacion ? false : true}
                not="No hay equipos cargados en la estación seleccionada"
                id="empresaselect"
              />
            </div>
            <div className="flex-1">
              <div className="w-full"></div>
            </div>
          </div>

          <div className="flex-1 mb-6">
            <TextInput
              placeholder="Asunto"
              eventHandler={onChangeAsunto}
              error={asuntoError}
              value={asunto}
            />
          </div>

          <div className="mt-1">
            <textarea
              onChange={onChangeMensaje}
              id="about"
              name="about"
              value={mensaje}
              rows={8}
              className={`w-full  font-objetive-medium pt-4 pb-3 pl-6 pr-10 shadow-sm block  sm:text-sm rounded-3xl border  ${
                mensajeError
                  ? "placeholder-red-300 focus:ring-red-300 focus:border-red-300 border-red-300"
                  : "placeholder-gray-800 border-gray-300 focus:ring-gray-300 focus:border-gray-300"
              }`}
              placeholder="Mensaje de alerta"
            />
          </div>

          <button
            type="button"
            onClick={onSubmit}
            className="absolute inline-flex items-center px-4 pt-4 pb-3 text-base text-white border border-transparent rounded-full shadow-sm bottom--20 left-custom-alert-btn font-objetive-medium bg-app-btn-gradient focus:outline-none "
          >
            Guardar y cargar
          </button>
        </div>
      </div>
    </>
  );
};

export default EquipmentCreate;
