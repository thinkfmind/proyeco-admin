import {
  ChevronLeftIcon,
  DocumentDownloadIcon,
} from "@heroicons/react/outline";
import axios from "axios";
import { LinearScale } from "chart.js";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { Link, useHistory } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import Navbar from "../../../@app/navbar";
import Table from "../../../components/registerActivity/table";
import useFetch from "../../../hooks/useFetch";
import useField from "../../../hooks/useField";
import Message from "../../../assets/img/message.svg";
import {backendUrl} from '../../../config'

const EquipmentRegisterActivity = () => {
  const history = useHistory();
  const userSelector = useSelector((store) => store.user);
  const [chargeNewRegister, setChargeNewRegister] = useState(false);
  const [chargePdf, setChargePdf] = useState(false);
  const { response: responseActivities } = useFetch({
    url: `${backendUrl}/actividad`,
    options: {
      headers: {
        Authorization: `Bearer ${userSelector.user.jwtToken}`,
      },
    },
    initData: [],
  });
  const { response: responseEquipments } = useFetch({
    url: `${backendUrl}/equipo`,
    options: {
      headers: {
        Authorization: `Bearer ${userSelector.user.jwtToken}`,
      },
    },
    initData: [],
  });
  const [empresas, setEmpresas] = useState([]);
  const [lineas, setLineas] = useState([]);
  const [estaciones, setEstaciones] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [empresaField, setEmpresaField] = useState("");
  const [lineaField, setLineaField] = useState("");
  const [estacionField, setEstacionField] = useState("");
  const [equipoField, setEquipoField] = useState({
    value: "",
    name: "",
  });
  const tipoActividadField = useField();
  const fechaRegistroField = useField();
  const cantDiasField = useField({
    value: "0",
  });
  const tipoActividadRadioField = useField();
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: "application/pdf",
  });
  const files = acceptedFiles.map((file) => (
    <li key={file.path}>{file.path}</li>
  ));

  const handleClickBack = () => {
    if (!chargeNewRegister && !chargePdf) {
      history.push("/equipment");
    }
    setChargeNewRegister(false);
    setChargePdf(false);
  };
  const handleClickCargeNewRegister = () => {
    setChargeNewRegister(true);
  };

  const handleClickCargePdf = () => {
    setChargePdf(true);
  };

  useEffect(() => {
    if (responseEquipments.length > 0) {
      const empresasLocal = [];
      const lineasLocal = [];
      const estacionesLocal = [];
      const equiposLocal = [];

      responseEquipments.forEach((equipment) => {
        if (!equiposLocal.find((equipo) => equipo.value === equipment.id)) {
          equiposLocal.push({
            name: equipment.name,
            value: equipment.id,
          });
        }
        if (!lineasLocal.find((linea) => linea.value === equipment.linea.id)) {
          lineasLocal.push({
            name: equipment.linea.name,
            value: equipment.linea.id,
          });
        }
        if (
          !estacionesLocal.find(
            (estacion) => estacion.value === equipment.estacion.id
          )
        ) {
          estacionesLocal.push({
            name: equipment.estacion.name,
            value: equipment.estacion.id,
          });
        }
        if (
          !empresasLocal.find(
            (empresa) => empresa.value === equipment.empresa.id
          )
        ) {
          empresasLocal.push({
            name: equipment.empresa.name,
            value: equipment.empresa.id,
          });
        }
      });
      setEmpresas(empresasLocal);
      setLineas(lineasLocal);
      setEstaciones(estacionesLocal);
      setEquipos(equiposLocal);
      setEmpresaField(empresasLocal.length === 1 ? empresasLocal[0].value : "");
      setLineaField(lineasLocal.length === 1 ? lineasLocal[0].value : "");
      setEstacionField(
        estacionesLocal.length === 1 ? estacionesLocal[0].value : ""
      );
      setEquipoField(
        equiposLocal.length === 1
          ? {
              value: equiposLocal[0].value,
              name: equiposLocal[0].value,
            }
          : {
              value: "",
              name: "",
            }
      );
    }
  }, [responseEquipments, chargePdf]);

  const handleChangeLinea = (e) => {
    const empresasLocal = [];
    const estacionesLocal = [];
    const equiposLocal = [];
    const valueId = e.currentTarget.value;

    for (let i = 0; i < responseEquipments.length; i++) {
      const equipment = responseEquipments[i];
      if (equipment.linea.id === valueId) {
        if (!equiposLocal.find((equipo) => equipo.value === equipment.id)) {
          equiposLocal.push({
            name: equipment.name,
            value: equipment.id,
          });
        }
        if (
          !estacionesLocal.find(
            (estacion) => estacion.value === equipment.estacion.id
          )
        ) {
          estacionesLocal.push({
            name: equipment.estacion.name,
            value: equipment.estacion.id,
          });
        }
        if (
          !empresasLocal.find(
            (empresa) => empresa.value === equipment.empresa.id
          )
        ) {
          empresasLocal.push({
            name: equipment.empresa.name,
            value: equipment.empresa.id,
          });
        }
      }
    }
    setEstaciones(estacionesLocal);
    setEquipos(equiposLocal);
    setEmpresas(empresasLocal);
    setLineaField(valueId);
  };

  const handleChangeEstacion = (e) => {
    const empresasLocal = [];
    const lineasLocal = [];
    const equiposLocal = [];
    const valueId = e.currentTarget.value;

    for (let i = 0; i < responseEquipments.length; i++) {
      const equipment = responseEquipments[i];
      if (equipment.estacion.id === valueId) {
        if (!equiposLocal.find((equipo) => equipo.value === equipment.id)) {
          equiposLocal.push({
            name: equipment.name,
            value: equipment.id,
          });
        }
        if (!lineasLocal.find((linea) => linea.value === equipment.linea.id)) {
          lineasLocal.push({
            name: equipment.linea.name,
            value: equipment.linea.id,
          });
        }
        if (
          !empresasLocal.find(
            (empresa) => empresa.value === equipment.empresa.id
          )
        ) {
          empresasLocal.push({
            name: equipment.empresa.name,
            value: equipment.empresa.id,
          });
        }
      }
    }
    setLineas(lineasLocal);
    setEquipos(equiposLocal);
    setEmpresas(empresasLocal);
    setEstacionField(valueId);
  };

  const handleChangeEquipo = (e) => {
    const empresasLocal = [];
    const estacionesLocal = [];
    const lineasLocal = [];
    const valueName = e.currentTarget.value;
    const option = document.querySelector(
      "#datalist-equipments option[value='" + valueName + "']"
    );
    let valueId = "";
    if (option) {
      valueId = option.dataset.value;
      for (let i = 0; i < responseEquipments.length; i++) {
        const equipment = responseEquipments[i];
        if (equipment.id === valueId) {
          if (
            !lineasLocal.find((linea) => linea.value === equipment.linea.id)
          ) {
            lineasLocal.push({
              name: equipment.linea.name,
              value: equipment.linea.id,
            });
          }
          if (
            !estacionesLocal.find(
              (estacion) => estacion.value === equipment.estacion.id
            )
          ) {
            estacionesLocal.push({
              name: equipment.estacion.name,
              value: equipment.estacion.id,
            });
          }
          if (
            !empresasLocal.find(
              (empresa) => empresa.value === equipment.empresa.id
            )
          ) {
            empresasLocal.push({
              name: equipment.empresa.name,
              value: equipment.empresa.id,
            });
          }
        }
      }
      setEstaciones(estacionesLocal);
      setLineas(lineasLocal);
      setEmpresas(empresasLocal);
    }
    setEquipoField({ value: valueId, name: valueName });
  };

  const handleChangeEmpresa = (e) => {
    const lineasLocal = [];
    const estacionesLocal = [];
    const equiposLocal = [];
    const valueId = e.currentTarget.value;

    for (let i = 0; i < responseEquipments.length; i++) {
      const equipment = responseEquipments[i];
      if (equipment.empresa.id === valueId) {
        if (!equiposLocal.find((equipo) => equipo.value === equipment.id)) {
          equiposLocal.push({
            name: equipment.name,
            value: equipment.id,
          });
        }
        if (
          !estacionesLocal.find(
            (estacion) => estacion.value === equipment.estacion.id
          )
        ) {
          estacionesLocal.push({
            name: equipment.estacion.name,
            value: equipment.estacion.id,
          });
        }
        if (!lineasLocal.find((linea) => linea.value === equipment.linea.id)) {
          lineasLocal.push({
            name: equipment.linea.name,
            value: equipment.linea.id,
          });
        }
      }
    }
    setEstaciones(estacionesLocal);
    setEquipos(equiposLocal);
    setLineas(lineasLocal);
    setEmpresaField(valueId);
  };

  const handleSubmitNewRegister = async (e) => {
    e.preventDefault();
    const toastLoading = toast.loading("Cargando...");

    await axios.post(`${backendUrl}/actividad`, {
      data: {
        empresa: empresaField,
        equipo: equipoField.value,
        linea: lineaField,
        estacion: estacionField,
        tipo: tipoActividadRadioField.value,
        detalles: tipoActividadField.value,
        fecha: fechaRegistroField.value,
        dias: cantDiasField.value,
      },
      headers: {
        Authorization: `Bearer ${userSelector.user.jwtToken}`,
      },
    });
    toast.dismiss(toastLoading);
    toast.custom(
      <div className="alert-success">
        <img src={Message} alt="Message" className="w-24 h-24 mb-4"></img>
        <div className="text-xl font-objetive-bold">
          Registro de actividad <br />
          creada de manera exitosa!
        </div>
      </div>,
      { position: "top-center", duration: 1500 }
    );
  };

  const handleSubmitPdf = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    await axios({
      method: "POST",
      url: `${backendUrl}/equipo`,
      data: formData,
      headers: {
        "Content-Type":
          "multipart/form-data boundary=" + Math.random().toString().substr(2),
      },
    });
  };

  return (
    <>
      <Toaster
        containerStyle={{
          top: "30%",
          left: 20,
          bottom: 20,
          right: 20,
        }}
        reverseOrder={false}
      />
      <Navbar title="Registro de mantenimiento" />
      <div className="px-20 pt-14 vp-desktop">
        <button onClick={handleClickBack} className="flex font-objetive-medium">
          <ChevronLeftIcon className="w-5 h-5 mr-2 text-gray-700" />
          Volver
        </button>
      </div>
      <div className="px-20 pb-10 vp-desktop">
        <div
          className={`${
            !chargeNewRegister && !chargePdf
              ? "space-x-10 hover:cursor-pointer"
              : ""
          } mt-10 mb-14 flex`}
        >
          {!chargePdf && (
            <div
              onClick={
                !chargeNewRegister ? handleClickCargeNewRegister : undefined
              }
              className={`${
                chargeNewRegister
                  ? "pt-8 pb-12 pl-6 pr-16 w-full rounded-3xl"
                  : "rounded-full"
              } relative px-4 py-2 bg-gray-200`}
            >
              <h2 className="text-sm font-objetive-bold">
                Cargar nuevo registro de actividad
              </h2>
              {chargeNewRegister && (
                <form
                  className="mt-8 font-objetive-regular"
                  onSubmit={handleSubmitNewRegister}
                >
                  <h3 className="mb-2 text-sm font-objetive-medium">
                    Seleccione línea, estación y equipo
                  </h3>
                  <div className="flex items-center space-x-8">
                    <select
                      value={lineaField}
                      onChange={handleChangeLinea}
                      className="w-full max-w-xs py-4 pl-4 text-xs border-0 rounded-full pr-7 font-objetive-medium"
                      required
                    >
                      <option value=""></option>
                      {lineas.map((linea) => {
                        return (
                          <option
                            key={`option-linea-${linea.value}`}
                            value={linea.value}
                          >
                            {linea.name}
                          </option>
                        );
                      })}
                    </select>
                    <select
                      value={estacionField}
                      onChange={handleChangeEstacion}
                      className="w-full max-w-xs py-4 pl-4 text-xs border-0 rounded-full pr-7 font-objetive-medium"
                      required
                    >
                      <option value=""></option>
                      {estaciones.map((estacion) => {
                        return (
                          <option
                            key={`option-estacion-${estacion.value}`}
                            value={estacion.value}
                          >
                            {estacion.name}
                          </option>
                        );
                      })}
                    </select>
                    <input
                      value={equipoField.name}
                      onChange={handleChangeEquipo}
                      className="flex-grow px-4 py-4 text-xs border-none rounded-full font-objetive-regular"
                      list="datalist-equipments"
                      type="text"
                      placeholder="Nombre del equipo"
                      required
                    />
                    <datalist id="datalist-equipments">
                      {equipos.map((equipo) => {
                        return (
                          <option
                            key={`option-equipo-${equipo.value}`}
                            data-value={equipo.value}
                            value={equipo.name}
                          />
                        );
                      })}
                    </datalist>
                  </div>
                  <div className="my-8">
                    <h3 className="mb-4 text-sm font-objetive-medium">
                      Tipo de actividad para registrar
                    </h3>
                    <div
                      {...tipoActividadRadioField}
                      className="flex space-x-6 text-xs font-objetive-medium"
                    >
                      <label className="flex items-center">
                        <input
                          className="mr-2"
                          type="radio"
                          name="typeActivity"
                          defaultValue="preventMaintenance"
                          required
                        />
                        <p>Mantenimiento preventivo</p>
                      </label>
                      <label className="flex items-center">
                        <input
                          className="mr-2"
                          type="radio"
                          name="typeActivity"
                          defaultValue="correctMaintenance"
                          required
                        />
                        <p>Mantenimiento correctivo</p>
                      </label>
                      <label className="flex items-center">
                        <input
                          className="mr-2"
                          type="radio"
                          name="typeActivity"
                          defaultValue="breackdown"
                          required
                        />
                        <p>Averías</p>
                      </label>
                    </div>
                    <input
                      className="flex-grow w-full px-4 py-4 mt-6 text-sm border-none rounded-full font-objetive-regular"
                      type="text"
                      placeholder="Presenta problemas en el funcionamiento de velocidad"
                      {...tipoActividadField}
                      required
                    />
                  </div>
                  <div className="flex justify-between">
                    <label>
                      <p className="mb-4 text-sm font-objetive-medium">
                        Empresa a cargo del mantenimiento
                      </p>
                      <select
                        value={empresaField}
                        onChange={handleChangeEmpresa}
                        className="w-40 py-4 pl-4 text-xs border-0 rounded-full pr-7 font-objetive-medium"
                        required
                      >
                        <option value=""></option>
                        {empresas.map((empresa) => {
                          return (
                            <option
                              key={`option-empresa-${empresa.value}`}
                              value={empresa.value}
                            >
                              {empresa.name}
                            </option>
                          );
                        })}
                      </select>
                    </label>
                    <label>
                      <p className="mb-4 text-sm font-objetive-medium">
                        Fecha de registro
                      </p>
                      <input
                        className="flex-grow px-4 py-4 text-xs border-none rounded-full w-52 font-objetive-regular"
                        type="date"
                        min="1960-01-01"
                        max="2099-12-31"
                        {...fechaRegistroField}
                        required
                      />
                    </label>
                    <label>
                      <p className="mb-4 text-sm font-objetive-medium">
                        Cantidad de días que tomó el arreglo
                      </p>
                      <input
                        className="flex-grow w-24 px-4 py-4 text-xs border-none rounded-full font-objetive-regular"
                        type="number"
                        min={0}
                        required
                        {...cantDiasField}
                      />
                    </label>
                  </div>
                  <div className="absolute right-14 -bottom-7">
                    <button
                      type="submit"
                      className="px-6 py-4 text-white rounded-full bg-app-violet-300 font-objetive-medium"
                    >
                      Registrar actividad
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
          {!chargeNewRegister && (
            <div
              onClick={!chargePdf ? handleClickCargePdf : undefined}
              className={`${
                chargePdf
                  ? "pt-8 pb-12 pl-6 pr-16 w-full rounded-3xl"
                  : "rounded-full"
              } relative px-4 py-2 bg-gray-200`}
            >
              <h2 className="text-sm font-objetive-bold">
                Cargar PDF datos históricos
              </h2>
              {chargePdf && (
                <form
                  onSubmit={handleSubmitPdf}
                  className="mt-8 font-objetive-regular"
                >
                  <div className="flex items-center mb-8 space-x-8">
                    <input
                      value={equipoField.name}
                      onChange={handleChangeEquipo}
                      className="flex-grow px-4 py-4 text-xs border-none rounded-full font-objetive-regular"
                      list="datalist-equipments-pdf"
                      type="text"
                      placeholder="Nombre del equipo"
                      required
                    />
                    <datalist id="datalist-equipments-pdf">
                      {equipos.map((equipo) => {
                        return (
                          <option
                            key={`option-equipo-${equipo.value}`}
                            data-value={equipo.value}
                            value={equipo.name}
                          />
                        );
                      })}
                    </datalist>
                    <select
                      value={lineaField}
                      onChange={handleChangeLinea}
                      className="w-full max-w-xs py-4 pl-4 text-xs border-0 rounded-full pr-7 font-objetive-medium"
                      required
                    >
                      <option value=""></option>
                      {lineas.map((linea) => {
                        return (
                          <option
                            key={`option-linea-${linea.value}`}
                            value={linea.value}
                          >
                            {linea.name}
                          </option>
                        );
                      })}
                    </select>
                    <select
                      value={estacionField}
                      onChange={handleChangeEstacion}
                      className="w-full max-w-xs py-4 pl-4 text-xs border-0 rounded-full pr-7 font-objetive-medium"
                      required
                    >
                      <option value=""></option>
                      {estaciones.map((estacion) => {
                        return (
                          <option
                            key={`option-estacion-${estacion.value}`}
                            value={estacion.value}
                          >
                            {estacion.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="flex justify-between">
                    <label className="flex items-center">
                      <p className="mr-8 text-sm font-objetive-medium">
                        Mantenimiento a cargo de
                      </p>
                      <select
                        className="w-40 py-4 pl-4 text-xs border-0 rounded-full pr-7 font-objetive-medium"
                        required
                      >
                        <option value=""></option>
                        {estaciones.map((estacion) => {
                          return (
                            <option
                              key={`option-estacion-${estacion.value}`}
                              value={estacion.value}
                            >
                              {estacion.name}
                            </option>
                          );
                        })}
                      </select>
                    </label>
                    <div {...getRootProps({ className: "dropzone" })}>
                      <input {...getInputProps()} required />
                      <div className="flex items-center mr-10 cursor-pointer">
                        <div className="p-4 mr-6 bg-gray-300 rounded-xl">
                          <DocumentDownloadIcon className="w-10 h-10 text-gray-700" />
                        </div>
                        <div>
                          <h3 className="underline font-objetive-bold text-app-violet-300">
                            Seleccionar PDF
                          </h3>
                          <h4 className="text-sm text-gray-700 font-objetive-regular">
                            {files.length > 0
                              ? files
                              : "No se seleccionó archivo"}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute right-14 -bottom-7">
                    <button
                      type="submit"
                      className="px-6 py-4 text-white rounded-full bg-app-violet-300 font-objetive-medium"
                    >
                      Guardar datos
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
        <Table registerActivities={responseActivities} />
      </div>
    </>
  );
};

export default EquipmentRegisterActivity;
