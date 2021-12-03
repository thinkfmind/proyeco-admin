import {
  DownloadIcon,
  XIcon,
  LocationMarkerIcon,
  DocumentDownloadIcon,
} from "@heroicons/react/outline";
import { useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import {
  createChartCountBreackdown,
  createChartEquip,
} from "../../../helpers/chart";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import Noimg from "../../../assets/img/noimg.png";
import useFetch from "../../../hooks/useFetch";
import { getYear, getMonth } from "date-fns";
import { backendUrl, s3BucketUrl } from "../../../config";

const yearNow = getYear(new Date());

const Description = ({ id, closeHandler, hidex }) => {
  const userSelector = useSelector((store) => store.user);
  const refChartCountBreackdown = useRef(null);
  const refChartEquip = useRef(null);
  const refFicha = useRef(null);
  const [data, setData] = useState([]);
  const { response: responseActividad } = useFetch({
    url: `${backendUrl}/actividad/equipo/${id}`,
    options: {
      headers: {
        Authorization: `Bearer ${userSelector.user.jwtToken}`,
      },
    },
    initData: [],
  });
  const [img1, setImg1] = useState("");
  const [img2, setImg2] = useState("");
  const [img3, setImg3] = useState("");
  const [percentagePositiveAverias, setPercentagePositiveAverias] = useState(0);
  const [percentageBalancePositive, setPercentageBalancePositive] = useState(0);

  const onErrorImg1 = () => {
    setImg1(Noimg);
  };

  const onErrorImg2 = () => {
    setImg2(Noimg);
  };

  const onErrorImg3 = () => {
    setImg3(Noimg);
  };

  const msToHMS = (ms) => {
    let seconds = ms / 1000;
    const hours = parseInt(seconds / 3600);
    seconds = seconds % 3600;
    return hours
  };

  const consult = async (source) => {
    const res = await axios.get(`${backendUrl}/equipo/${id}`, {
      cancelToken: source.token,
      headers: {
        Authorization: `Bearer ${userSelector.user.jwtToken}`,
      },
    });
    const date = new Date(res.data.updatedAt);
    const dif = Date.now() - date.getTime();
    const days = Math.round(dif / 86400000);
    res.data.updatedAt = days;
    res.data.updateHours = Date.now() - date.getTime();
    setData(res.data);

    setImg1(res.data.imagenUno);
    setImg2(res.data.imagenDos);
    setImg3(res.data.imagenTres);
  };

  const handleClickDownloadFicha = () => {
    var w = refFicha.current.offsetWidth;
    var h = refFicha.current.offsetHeight;
    const shadowElements = document.querySelectorAll(".shadow-md");
    shadowElements.forEach((element) => {
      element.classList.remove("shadow-md");
    });
    html2canvas(refFicha.current, { useCORS: true }).then((canvas) => {
      const img = canvas.toDataURL("image/jpeg", 1);
      const doc = new jsPDF("landscape", "px", [w, h]);
      doc.addImage(img, "JPEG", 0, 0, w, h);
      doc.save("ficha.pdf");

      shadowElements.forEach((element) => {
        element.classList.add("shadow-md");
      });
    });
  };

  const handleClickDownloadHistorico = () => {
    if (data.historico) {
      window.open(`${s3BucketUrl}/${data.historico}`, "_blank");
    }
  };

  const dateFormat = (d) =>{
    const dat = new Date(d);
    return dat.getDate() + "/"+ dat.getMonth()+ "/" +dat.getFullYear();
  }

  useEffect(() => {
    let source = axios.CancelToken.source();
    consult(source);

    return () => {
      source.cancel();
    };
  }, []);

  useEffect(() => {
    if (
      !refChartCountBreackdown.current.classList.contains("active-chart") &&
      responseActividad.length
    ) {
      refChartCountBreackdown.current.classList.add("active-chart");
      let actividadesAveriasMonth = [];
      let actividadesMantenimientoCorrectivoMonth = [];
      let actividadesMantenimientoPreventivoMonth = [];
      for (let i = 0; i < responseActividad.length; i++) {
        const actividad = responseActividad[i];
        const fechaActividad = new Date(actividad.fecha);
        const yearActivity = getYear(fechaActividad);
        if (yearActivity === yearNow) {
          const monthActivity = getMonth(fechaActividad);
          if (actividad.tipo === "Averías") {
            if (!actividadesAveriasMonth[monthActivity]) {
              actividadesAveriasMonth[monthActivity] = 1;
            } else {
              actividadesAveriasMonth[monthActivity] += 1;
            }
            continue;
          }
          if (actividad.tipo === "Mantenimiento correctivo") {
            if (!actividadesMantenimientoCorrectivoMonth[monthActivity]) {
              actividadesMantenimientoCorrectivoMonth[monthActivity] = 1;
            } else {
              actividadesMantenimientoCorrectivoMonth[monthActivity] += 1;
            }
          }
          if (actividad.tipo === "Mantenimiento preventivo") {
            if (!actividadesMantenimientoPreventivoMonth[monthActivity]) {
              actividadesMantenimientoPreventivoMonth[monthActivity] = 1;
            } else {
              actividadesMantenimientoPreventivoMonth[monthActivity] += 1;
            }
          }
        }
      }
      const CANT_CORRECT_AVERIAS = 3;
      const TOTAL_PERCENTAGE = 100;
      const COUNT_MONTHS = 12;
      const percentage = Array.from(
        { length: COUNT_MONTHS },
        () => TOTAL_PERCENTAGE
      );
      const percentageBalance = Array.from(
        { length: COUNT_MONTHS },
        () => TOTAL_PERCENTAGE
      );
      actividadesAveriasMonth.forEach((averias, i) => {
        if (averias >= 4) {
          const INIT_VALUE_PROBLEM_PERCENTAGE = 18;
          const countMentenimientoPreventivo =
            actividadesMantenimientoPreventivoMonth[i];
          const countMentenimientoCorrectivo =
            actividadesMantenimientoCorrectivoMonth[i];
          const averiasProblem = averias - CANT_CORRECT_AVERIAS;
          let solutionAverias = 0;
          let totalProblemPercentage = 0;
          let totalBalancePercentage = 0;

          solutionAverias =
            averiasProblem -
            countMentenimientoCorrectivo -
            countMentenimientoPreventivo / 2;

          if (solutionAverias > 0) {
            for (let i = 1; i <= solutionAverias; i++) {
              totalBalancePercentage += INIT_VALUE_PROBLEM_PERCENTAGE / i;
            }
          }
          for (let i = 1; i <= averiasProblem; i++) {
            totalProblemPercentage += INIT_VALUE_PROBLEM_PERCENTAGE / i;
          }
          const newPercentage = TOTAL_PERCENTAGE - totalProblemPercentage;
          percentage[i] = newPercentage;
          percentageBalance[i] = TOTAL_PERCENTAGE - totalBalancePercentage;
        }
      });
      let balancePercentage = 0;
      let balancePositivePercentage = 0;

      percentage.forEach((monthPercentage) => {
        balancePercentage += monthPercentage;
      });
      percentageBalance.forEach((monthPercentage) => {
        balancePositivePercentage += monthPercentage;
      });
      setPercentageBalancePositive(balancePositivePercentage / COUNT_MONTHS);
      setPercentagePositiveAverias(balancePercentage / COUNT_MONTHS);
      createChartCountBreackdown(refChartCountBreackdown.current, {
        preventivo: actividadesMantenimientoPreventivoMonth,
        correctivo: actividadesMantenimientoCorrectivoMonth,
        averias: actividadesAveriasMonth,
      });
      createChartEquip(refChartEquip.current, actividadesAveriasMonth);
    }
  }, [responseActividad]);

  return (
    <section
      ref={refFicha}
      className="relative w-full px-6 pt-4 pb-12 my-6 bg-gray-100 hola rounded-3xl font-objetive-regular"
    >
      <div className="flex items-center justify-end">
        {userSelector.user.role === "Admin" ? (
          <Link
            to={{
              pathname: "/equipment/edit",
              state: { id: id },
            }}
            className="mt-4 mr-6 text-base underline table-autofont-objetive-bold"
          >
            Editar equipo
          </Link>
        ) : null}
        {hidex ? null : (
          <button>
            <XIcon
              className="w-6 h-6 mt-4 text-gray-400"
              onClick={() => {
                closeHandler("", "");
              }}
            />
          </button>
        )}
      </div>
      <div className="px-10">
        <h2 className="text-3xl font-objetive-bold text-app-green-3">
          {data.name}
        </h2>
      </div>
      <section className="grid grid-cols-2 px-10 gap-x-16">
        <div>
          <div className="flex items-center my-3">
            <LocationMarkerIcon className="w-4 h-4 mr-2" />
            <p>
              {data.linea ? data.linea.name : ""} -{" "}
              {data.linea ? data.linea.lugar : ""} -{" "}
              {data.estacion ? data.estacion.name : ""}
            </p>
          </div>
          <h4
            className={`mb-2 font-objetive-bold ${
              data.funciona ? "text-green-700" : "text-app-red-2"
            }`}
          >
            {data.estado}
            <span className="text-sm text-black font-objetive-regular">
            {/* ${data.updatedAt} dias inactivo ${msToHMS(data.updateHours)} horas inactivo */}
              {data.funciona ? "" : ` · ${msToHMS(data.updateHours) > 24 ? `${data.updatedAt} dias inactivo` : `${msToHMS(data.updateHours)} horas inactivo`}`}
            </span>
          </h4>
          <div className="grid grid-cols-3 mb-3 gap-x-6">
            <div className="col-span-2">
              <img
                className="object-cover w-full h-full rounded-xl"
                src={img1}
                alt="Imagen1"
                onError={onErrorImg1}
                crossOrigin="anonymous"
              />
            </div>
            <div className="grid grid-cols-1 gap-y-6">
              <div>
                <img
                  className="object-cover w-full h-full rounded-xl "
                  src={img2}
                  alt="Imagen2"
                  onError={onErrorImg2}
                  crossOrigin="anonymous"
                />
              </div>
              <div>
                <img
                  className="object-cover w-full h-full rounded-xl"
                  src={img3}
                  alt="Imagen3"
                  onError={onErrorImg3}
                  crossOrigin="anonymous"
                />
              </div>
            </div>
          </div>
          <div className="mb-6 text-sm">
            <p>N de identificación: {data.identificacion}</p>
            <p>Modelo {data.modelo}</p>
            <p className="my-3">{data.detalles}</p>
            <p className="text-app-green-4">
              A cargo de {data.empresa ? data.empresa.name : ""}
            </p>
          </div>
          <div className="text-sm">
            <h4 className="mb-2 font-objetive-bold">
              Mantenimientos del último mes
            </h4>
            {responseActividad.length > 0 ? (
              responseActividad.slice(0, 3).map((actividad) => {
                return (
                  <div
                    key={actividad.id}
                    className="pt-2 mt-2 space-y-1 border-t border-gray-400"
                  >
                    <h5 className="font-objetive-medium">{actividad.tipo}</h5>
                    <p className="text-xs">Fecha de registro - {dateFormat(actividad.createdAt)}</p>
                    <p className="text-xs">
                      {actividad.dias} {actividad.dias === 1 ? "día" : "días"}{" "}
                      parado en reparación
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="pt-2 mt-2 space-y-1 border-t border-gray-400">
                <h5 className="font-objetive-medium">No registra actividad</h5>
              </div>
            )}
          </div>
        </div>
        <div>
          <div>
            <h4 className="mb-4 text-sm">Cantidad de averías</h4>
            <div className="w-full p-6 bg-white shadow-md rounded-3xl">
              <div className="grid grid-cols-3 ">
                <div className="col-span-2">
                  <canvas
                    ref={refChartCountBreackdown}
                    id="chartCantBreackdown"
                    height="250"
                    width="250"
                  ></canvas>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <p className="text-3xl font-objetive-bold text-app-green-3">
                    {percentageBalancePositive} %
                  </p>
                  <p className="text-sm font-objetive-regular">
                    Balance positivo
                  </p>
                </div>
              </div>
              <div className="px-8 mt-8" id="legend-container">
                <ul className="flex flex-col space-y-2 text-xs font-objetive-medium ul-chart" />
              </div>
            </div>
          </div>
          <div className="mt-10 mb-8">
            <h4 className="mb-4 text-sm">Rendimiento general del equipo</h4>
            <div className="grid w-full grid-cols-3 p-6 bg-white shadow-md rounded-3xl">
              <div className="col-span-2">
                <p className="mb-6 ml-4 text-xs text-black font-objetive-medium">
                  Averías totales
                </p>
                <canvas
                  className="ml-10"
                  ref={refChartEquip}
                  id="chartEquip"
                ></canvas>
              </div>
              <div className="flex flex-col items-center justify-center text-black">
                <div className="flex flex-col items-center justify-center w-32 h-32 border rounded-full border-app-red-1">
                  <p className="text-3xl font-objetive-bold">
                    {percentagePositiveAverias} %
                  </p>
                  <p className="text-sm font-objetive-regular">Positivo</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleClickDownloadFicha}
              className="relative py-1 mr-6 text-xs rounded-full font-objetive-medium px-7 bg-app-green-1 text-app-green-3"
            >
              <div className="absolute top-0 bottom-0 left-0 flex items-center">
                <DownloadIcon className="w-6 h-6 p-1 text-white rounded-full bg-app-green-3" />
              </div>
              Descargar ficha
            </button>
            <button
              onClick={handleClickDownloadHistorico}
              className="relative py-1 text-xs rounded-full font-objetive-medium px-7 bg-app-green-1 text-app-green-3"
            >
              <div className="absolute top-0 bottom-0 flex items-center -left-1">
                <DocumentDownloadIcon className="w-6 h-6 p-1 text-white rounded-full bg-app-green-3" />
              </div>
              Descargar datos históricos
            </button>
          </div>
        </div>
      </section>
    </section>
  );
};

export default Description;
