import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/ducks/user";
import { ChevronLeftIcon } from "@heroicons/react/outline";
import TextInput from "../../components/form/textInput";
import ItemSelector from "../../components/form/itemSelector";
import { useDropzone } from "react-dropzone";
import ItemSelectorWithIcon from "../../components/form/itemSelectorWithIcon";
import Navbar from "../../@app/navbar";
import Alert from "../../components/alert";
import Dropzone from "../../components/home/equipo/dropzone";
import { backendUrl } from "../../config";

const EquipmentCreate = (props) => {
  const { id } = props.location.state;
  const [data, setData] = useState([]);
  const [nameEquipo, setNameEquipo] = useState("");
  const [nameEquipoError, setNameEquipoError] = useState(false);
  const [nameDest, setNameDest] = useState("");
  const [nameDestError, setNameDestError] = useState(false);
  const [asunto, setAsunto] = useState("");
  const [asuntoError, setAsuntoError] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [mensajeError, setMensajeError] = useState(false);
  const [linea, setLinea] = useState("");
  const [lineaError, setLineaError] = useState(false);
  const [estacion, setEstacion] = useState("");
  const [estacionError, setEstacionError] = useState(false);
  const [empresa, setEmpresa] = useState("");
  const [empresaError, setEmpresaError] = useState(false);
  const [tipo, setTipo] = useState("");
  const [tipoError, setTipoError] = useState(false);
  const [dataLineas, setDataLineas] = useState([]);
  const [dataEstaciones, setDataEstaciones] = useState([]);
  const [estado, setEstado] = useState("En servicio");
  const [funciona, setFuncionando] = useState(true);
  const [successAlert, setSuccessAlert] = useState(false);
  const [imgUno, setImgUno] = useState("");
  const [imgDos, setImgDos] = useState("");
  const [imgTres, setImgTres] = useState("");
  const [file, setFile] = useState([]);
  const [file2, setFile2] = useState([]);
  const [file3, setFile3] = useState([]);


  const userSelector = useSelector((store) => store.user);
  let history = useHistory();
  const dispatch = useDispatch();

  const tiposEquipos = [
    {
      id: "Elevador",
      name: "Elevador",
    },
    {
      id: "Escalera",
      name: "Escalera",
    },
    {
      id: "Salvaescalera",
      name: "Salvaescalera",
    },
    {
      id: "Montacargas",
      name: "Montacargas",
    },
    {
      id: "Acera móvil",
      name: "Acera móvil",
    },
  ];

  const onDrop = useCallback(acceptedFiles => {
    setFile([...file, ...acceptedFiles])
  }, [file])

  const onDrop2 = useCallback(acceptedFiles => {
    setFile2([...file2, ...acceptedFiles])
  }, [file2])

  const onDrop3 = useCallback(acceptedFiles => {
    setFile3([...file3, ...acceptedFiles])
  }, [file3])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: "image/jpeg, image/png",
  });

  const {
    getRootProps: getRootProps2,
    getInputProps: getInputProps2,
  } = useDropzone({
    onDrop: onDrop2,
    multiple: false,
    accept: "image/jpeg, image/png",
  });

  const {
    getRootProps: getRootProps3,
    getInputProps: getInputProps3,
  } = useDropzone({
    onDrop: onDrop3,
    multiple: false,
    accept: "image/jpeg, image/png",
  });
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
      history.push("/equipment");
    }, 1500);
  };

  const deleteImg = () => {
    setImgUno("")
    setFile([])
  };

  const deleteImg2 = () => {
    setImgDos("")
    setFile2([])
  };

  const deleteImg3 = () => {
    setImgTres("")
    setFile2([])
  };

  const onSubmit = async () => {
    const toastLoading = toast.loading("Cargando...");
    let errNameEquipo = false;
    let errNameDest = false;
    let errAsunto = false;
    let errMensaje = false;
    let errLinea = false;
    let errEstacion = false;
    let errEmpresa = false;
    let errTipo = false;

    if (nameEquipo.length < 1) {
      setNameEquipoError(true);
      errNameEquipo = true;
    }

    if (nameDest.length < 1) {
      setNameDestError(true);
      errNameDest = true;
    }

    if (tipo.length < 1) {
      setTipoError(true);
      errTipo = true;
    }

    if (asunto.length < 1) {
      setAsuntoError(true);
      errAsunto = true;
    }

    if (mensaje.length < 1) {
      setMensajeError(true);
      errMensaje = true;
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

    if (
      !errNameEquipo &&
      !errNameDest &&
      !errAsunto &&
      !errMensaje &&
      !errLinea &&
      !errEstacion &&
      !errEmpresa &&
      !errTipo
    ) {
      try {
        const formData = new FormData();
        formData.append("name", nameEquipo);
        formData.append("linea", linea);
        formData.append("estacion", estacion);
        formData.append("empresa", empresa);
        formData.append("identificacion", nameDest);
        formData.append("modelo", asunto);
        formData.append("tipo", tipo);
        formData.append("detalles", mensaje);
        formData.append("estado", estado);
        formData.append("funciona", funciona);
        formData.append("imagenUno", file[0]);
        formData.append("imagenDos", file2[0]);
        formData.append("imagenTres", file3[0]);

        await axios({
          method: "PUT",
          url: `${backendUrl}/equipo/${id}`,
          data: formData,
          headers: {
            Authorization: `Bearer ${userSelector.user.jwtToken}`,
            "Content-Type":
              "multipart/form-data boundary=" +
              Math.random().toString().substr(2),
          },
        });
        setNameDest("");
        setNameEquipo("");
        setAsunto("");
        setMensaje("");
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
      toast.dismiss(toastLoading);
  };

  const [refreshEstacion, setRefreshEstacion] = useState("");
  const handleSelectLinea = (value) => {
    const result = dataEstaciones.filter((estacion) => {
      return estacion.linea === value;
    });
    setLinea(value);
    setEstacion("");
    setRefreshEstacion(result);
  };

  const handleSelectEstacion = (value) => {
    setEstacion(value);
  };

  const handleSelectEmpresa = (value) => {
    setEmpresa(value);
  };

  const handleSelectTipo = (value) => {
    setTipo(value);
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

      const sanitize = res.data.filter((user) => {
        return user.role === "Empresa";
      });

      setData(sanitize);
      setDataLineas(res2.data);
      setDataEstaciones(res3.data);

      const res4 = await axios.get(
        `${backendUrl}/equipo/${id}`,
        {
          headers: {
            Authorization: `Bearer ${userSelector.user.jwtToken}`,
          },
        }
      );

      setNameEquipo(res4.data.name);
      setNameDest(res4.data.identificacion);
      setAsunto(res4.data.modelo);
      setMensaje(res4.data.detalles);
      setTipo(res4.data.tipo);
      setLinea(res4.data.linea.id);
      setEmpresa(res4.data.empresa.id);
      setImgUno(res4.data.imagenUno);
      setImgDos(res4.data.imagenDos);
      setImgTres(res4.data.imagenTres);

      const result = res3.data.filter((estacion) => {
        return estacion.linea === res4.data.linea.id;
      });

      setRefreshEstacion(result);
      setEstacion(res4.data.estacion.id);
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

  const inputRadioSet = (checked, estado, funcionando) => {
    if (checked) {
      setEstado(estado);
      setFuncionando(funcionando);
    }
  };

  useEffect(() => {
    consult();
  }, []);

  return (
    <>
      {successAlert ? <Alert text="Registro creado" /> : null}
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar title="Carga y edición de equipos" />
      <div className="px-20 pb-20 vp-desktop">
        <div className="flex items-end justify-between mt-14">
          <h1 className="text-xl font-objetive-bold">Cargar nuevo equipo</h1>
          <div className="flex">
            <Link to="/home">
              <ChevronLeftIcon className="w-5 h-5 mr-2 text-gray-700" />
            </Link>
            <Link className="font-objetive-medium" to="/equipment">
              Volver
            </Link>
          </div>
        </div>
        <div className="relative w-full px-10 pt-10 pb-24 mt-6 bg-gray-100 rounded-3xl">
          <div className="flex">
            <div className="flex-1 pr-14">
              <TextInput
                placeholder="Nombre"
                error={nameEquipoError}
                eventHandler={onChangeNameEquipo}
                value={nameEquipo}
              />
            </div>
            <div className="flex flex-1">
              <div className="flex-1 pr-6">
                <ItemSelectorWithIcon
                  data={dataLineas}
                  text="Línea"
                  eventHandler={handleSelectLinea}
                  value={linea}
                />
              </div>
              <div className="flex-1 pl-6">
                <ItemSelectorWithIcon
                  data={refreshEstacion}
                  text="Estacion"
                  eventHandler={handleSelectEstacion}
                  value={estacion}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex">
            <div className="flex-1 pr-6"></div>
            <div className="flex-1 pl-8">
              <ItemSelector
                data={tiposEquipos}
                text="Tipo"
                eventHandler={handleSelectTipo}
                value={tipo}
              />
            </div>
          </div>

          <hr className="my-8 border-gray-300" />

          <div className="flex mb-8">
            <div className="flex-1 pr-14">
              <div className="w-4/6">
                <div className="pl-2 mb-4 font-objetive-medium">
                  Empresa a cargo del mantenimiento
                </div>
                <ItemSelector
                  data={data}
                  text="Empresa"
                  eventHandler={handleSelectEmpresa}
                  value={empresa}
                />
              </div>
            </div>
            <div className="flex flex-1">
              <div className="flex-1 pr-6">
                <div className="pl-2 mb-4 font-objetive-medium">
                  Nº de identificación
                </div>
                <TextInput
                  placeholder=""
                  error={nameDestError}
                  eventHandler={onChangeNameDest}
                  value={nameDest}
                />
              </div>
              <div className="flex-1 pl-6">
                <div className="pl-2 mb-4 font-objetive-medium">
                  Marca y modelo
                </div>
                <TextInput
                  placeholder=""
                  eventHandler={onChangeAsunto}
                  error={asuntoError}
                  value={asunto}
                />
              </div>
            </div>
          </div>

          <div className="mt-1">
            <textarea
              onChange={onChangeMensaje}
              id="about"
              name="about"
              rows={3}
              value={mensaje}
              className={`w-full  font-objetive-medium pt-4 pb-3 pl-6 pr-10 shadow-sm block  sm:text-sm rounded-3xl border  ${
                mensajeError
                  ? "placeholder-red-300 focus:ring-red-300 focus:border-red-300 border-red-300"
                  : "placeholder-gray-800 border-gray-300 focus:ring-gray-300 focus:border-gray-300"
              }`}
              placeholder="Otros detalles del equipo"
            />
          </div>

          <hr className="my-8 border-gray-300" />

          <div>
            <h3 className="mb-2 font-objetive-medium">Imágenes del equipo</h3>
            <p className="mb-10 text-sm text-gray-800 font-objetive-regular">
              Formatos aceptados JPEG, JPG, PNG en 72 dpi. Máximo 3 imágenes
            </p>

            <div className="flex">
              <Dropzone
                img={imgUno}
                getRootProps={getRootProps}
                getInputProps={getInputProps}
                acceptedFiles={file}
                deleteImg={deleteImg}
              />
              <Dropzone
                img={imgDos}
                getRootProps={getRootProps2}
                getInputProps={getInputProps2}
                acceptedFiles={file2}
                deleteImg={deleteImg2}
              />
              <Dropzone
                img={imgTres}
                getRootProps={getRootProps3}
                getInputProps={getInputProps3}
                acceptedFiles={file3}
                deleteImg={deleteImg3}
              />
            </div>
          </div>

          <hr className="my-8 border-gray-300" />

          <div>
            <h3 className="mb-10 font-objetive-medium">
              Estado actual del equipo
            </h3>
            <div className="flex mb-5">
              <div className="flex items-center mr-5 create-equipment">
                <input
                  type="radio"
                  id="e1"
                  onChange={(e) => {
                    inputRadioSet(e.target.checked, "En servicio", true);
                  }}
                  name="push-notifications"
                  defaultChecked={true}
                  className="w-3 h-3 text-gray-300 border-gray-900 rounded-full focus:ring-transparent"
                />
                <label
                  htmlFor="e1"
                  className="block pt-1 ml-2 text-sm text-gray-800 font-objetive-medium"
                >
                  En servicio
                </label>
              </div>
              <div className="flex items-center mr-5 create-equipment">
                <input
                  onChange={(e) => {
                    inputRadioSet(
                      e.target.checked,
                      "Fuera de servicio por mantenimiento",
                      false
                    );
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
                  Fuera de servicio por mantenimiento
                </label>
              </div>
              <div className="flex items-center mr-5 create-equipment">
                <input
                  id="e3"
                  type="radio"
                  name="push-notifications"
                  onChange={(e) => {
                    inputRadioSet(
                      e.target.checked,
                      "Fuera de servicio por afectaciones externas",
                      false
                    );
                  }}
                  className="w-3 h-3 text-gray-300 border-gray-900 rounded-full focus:ring-transparent"
                />
                <label
                  htmlFor="e3"
                  className="block pt-1 ml-2 text-sm text-gray-800 font-objetive-medium"
                >
                  Fuera de servicio por afectaciones externas
                </label>
              </div>
              <div className="flex items-center mr-5 create-equipment">
                <input
                  type="radio"
                  id="e4"
                  onChange={(e) => {
                    inputRadioSet(e.target.checked, "Siniestrado", false);
                  }}
                  name="push-notifications"
                  className="w-3 h-3 text-gray-300 border-gray-900 rounded-full focus:ring-transparent"
                />
                <label
                  htmlFor="e4"
                  className="block pt-1 ml-2 text-sm text-gray-800 font-objetive-medium"
                >
                  Siniestrado
                </label>
              </div>
            </div>
            <div className="flex">
              <div className="flex items-center mr-5 create-equipment">
                <input
                  id="e5"
                  type="radio"
                  name="push-notifications"
                  onChange={(e) => {
                    inputRadioSet(
                      e.target.checked,
                      "Fuera de servicio por disponibilidad de refaccionamiento",
                      false
                    );
                  }}
                  className="w-3 h-3 text-gray-300 border-gray-900 rounded-full focus:ring-transparent"
                />
                <label
                  htmlFor="e5"
                  className="block pt-1 ml-2 text-sm text-gray-800 font-objetive-medium"
                >
                  Fuera de servicio por disponibilidad de refaccionamiento
                </label>
              </div>
              <div className="flex items-center mr-5 create-equipment">
                <input
                  id="e6"
                  type="radio"
                  name="push-notifications"
                  onChange={(e) => {
                    inputRadioSet(e.target.checked, "En avería", false);
                  }}
                  className="w-3 h-3 text-gray-300 border-gray-900 rounded-full focus:ring-transparent"
                />
                <label
                  htmlFor="e6"
                  className="block pt-1 ml-2 text-sm text-gray-800 font-objetive-medium"
                >
                  En avería
                </label>
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
      </div>
    </>
  );
};

export default EquipmentCreate;
