import { CalendarIcon, ChevronDownIcon } from "@heroicons/react/outline";
import { DownloadIcon } from "@heroicons/react/solid";
import { forwardRef, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
import { compareAsc } from "date-fns";
import { useSelector } from "react-redux";
import Row from "./row";
import useFetch from "../../../hooks/useFetch";
import { states } from "../../../helpers/equipment";
import { getValue } from "../../../helpers/table";
import "react-datepicker/dist/react-datepicker.css";
import { backendUrl } from "../../../config";
import { tiposEquipos } from "../../../helpers/staticData";

const Table = ({ data, pagination, maxCantRow, changeData, sendToTrash }) => {
  const userSelector = useSelector((store) => store.user);
  const [isAllEquip, setIsAllEquip] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [filtroEmpresa, setFiltroEmpresa] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState(null);
  const [filtroLinea, setFiltroLinea] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState(null);
  const [filtroStart, setFiltroStart] = useState(null);
  const [filtroEnd, setFiltroEnd] = useState(null);

  const { response: responseLinea } = useFetch({
    url: `${backendUrl}/linea`,
    options: {
      headers: {
        Authorization: `Bearer ${userSelector.user.jwtToken}`,
      },
    },
    initData: [],
  });
  const { response: responseUsers } = useFetch({
    url: `${backendUrl}/user`,
    options: {
      headers: {
        Authorization: `Bearer ${userSelector.user.jwtToken}`,
      },
    },
    initData: [],
  });
  const { response: responseEquipo } = useFetch({
    url: `${backendUrl}/equipo`,
    options: {
      headers: {
        Authorization: `Bearer ${userSelector.user.jwtToken}`,
      },
    },
  });
  const [empresas, setEmpresas] = useState([]);

  const handleClickAllCheck = () => {
    setIsAllEquip(!isAllEquip);
  };

  const handleFilterTable = (property, value, start, end) => {
    let dataFiltered = responseEquipo;

    if (filtroEmpresa || property === 'Empresa') {
      if(property === 'Empresa') {
        if(value !== 'blank') {
          dataFiltered = [...dataFiltered].filter((equipo) => {
            return equipo.empresa.name === value;
          });
        }
      } else {
        if(filtroTipo !== 'blank') {
          dataFiltered = [...dataFiltered].filter((equipo) => {
            return equipo.empresa.name === filtroEmpresa;
          });
        }
      }
    }

    if (filtroTipo || property === 'Tipo') {
      if(property === 'Tipo') {
        if(value !== 'blank') {
          dataFiltered = [...dataFiltered].filter((equipo) => {
            return equipo.tipo === value;
          });
        }
      } else {
        if(filtroTipo !== 'blank') {
          dataFiltered = [...dataFiltered].filter((equipo) => {
            return equipo.tipo === filtroTipo;
          });
        }
      }
    }

    if (filtroLinea || property === 'Linea') {
      if(property === 'Linea') {
        if(value !== 'blank') {
          dataFiltered = [...dataFiltered].filter((equipo) => {
            return equipo.linea.id === value;
          });
        }
      } else {
        if(filtroLinea !== 'blank') {
          dataFiltered = [...dataFiltered].filter((equipo) => {
            return equipo.linea.id === filtroLinea;
          });
        }
      }
      
    }

    if (filtroEstado || property === 'Estado') {
      if(property === 'Estado') {
        if(value !== 'blank') {
          dataFiltered = [...dataFiltered].filter((equipo) => {
            return equipo.estado === value;
          });
        }
      } else {
        if(filtroEstado !== 'blank') {
          dataFiltered = [...dataFiltered].filter((equipo) => {
            return equipo.estado === filtroEstado;
          });
        }
      }

    }

    if (start && end) {
      dataFiltered = [...dataFiltered].filter((equipo) => {
        const equipDate = new Date(equipo.createdAt);
        if (compareAsc(equipDate, start.setHours(0, 0, 0, 0)) === -1) {
          return false;
        }
        if (compareAsc(end.setHours(23, 59, 59), equipDate) === -1) {
          return false;
        }
        return equipo;
      });
    } else {
      if(filtroStart !== 'blank' && filtroEnd !== 'blank') {
        dataFiltered = [...dataFiltered].filter((equipo) => {
          const equipDate = new Date(equipo.createdAt);
          if (compareAsc(equipDate, filtroStart.setHours(0, 0, 0, 0)) === -1) {
            return false;
          }
          if (compareAsc(filtroEnd.setHours(23, 59, 59), equipDate) === -1) {
            return false;
          }
          return equipo;
        });
      }
    }

    changeData(dataFiltered);
  };

  const handleFiltroEstado = (value) => {
    const val = value ? value : 'blank';
    setFiltroEstado(val);
    handleFilterTable('Estado', val);
  };

  const handleFiltroEmpresa = (value) => {
    const val = value ? value : 'blank';
    setFiltroEmpresa(val);
    handleFilterTable('Empresa', val);
  };

  const handleFiltroTipo = (value) => {
    const val = value ? value : 'blank';
    setFiltroTipo(val);
    handleFilterTable('Tipo', val);
  };

  const handleFiltroLinea = (value) => {
    const val = value ? value : 'blank';
    setFiltroLinea(val);
    handleFilterTable('Linea', val);
  };

  const handleClickDownloadZip = () => {
    const inputsDownloadZip = document.querySelectorAll(
      ".input-check-downloadZip"
    );
    const inputsDownloadTrue = Array.prototype.filter.call(
      inputsDownloadZip,
      (input) => input.checked
    );
    if (data) {
      const idsToDownload = data.filter((user) => {
        return inputsDownloadTrue.find((input) => input.value === user.id);
      });
      let keys = [];
      for (let el of idsToDownload) {
        if (el.historico) keys.push({ filename: el.historico });
      }

      axios({
        url: `${backendUrl}/historico/zip`,
        method: "POST",
        headers: { Authorization: `Bearer ${userSelector.user.jwtToken}` },
        data: {
          keys: keys,
        },
        responseType: "blob", // important
      }).then(({ data }) => {
        const downloadUrl = window.URL.createObjectURL(
          new Blob([data], { type: "application/zip" })
        );
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", "file.zip"); //any other extension
        document.body.appendChild(link);
        link.click();
        link.remove();
      });
    }
  };

  const onChangeDate = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      const star = start ? start : 'blank'
      const en = end ? end : 'blank'
      setFiltroStart(star)
      setFiltroEnd(en)
      handleFilterTable(null, null, start, end);
    }
    // if (!end) {
    //   handleFilterTable();
    // }
  };

  useEffect(() => {
    if (responseUsers.length) {
      const empresas = [];
      for (let i = 0; i < responseUsers.length; i++) {
        const user = responseUsers[i];
        if (user.role.toUpperCase() === "EMPRESA") {
          if (!empresas.find((empresa) => empresa === user.name)) {
            empresas.push(user.name);
          }
        }
      }
      setEmpresas(empresas);
    }
  }, [responseUsers]);

  const CustomInputDate = forwardRef(({ value, onClick }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        className="relative flex items-center text-sm font-objetive-bold text-app-green-3"
      >
        <CalendarIcon className="w-6 h-6 mr-1" />
        <p>{endDate ? value : "Fecha de mantenimiento"}</p>
        <ChevronDownIcon className="w-4 h-4 ml-1" />
      </button>
    );
  });

  return (
    <div>
      <h1 className="mt-10 mb-6 text-xl font-objetive-bold">
        Listado de equipos
      </h1>
      <div className="flex justify-between mt-6 mb-14">
        <div className="flex items-center">
          <input
            onChange={handleClickAllCheck}
            type="checkbox"
            className="mb-1 bg-gray-400 border-2 rounded-sm input-check-downloadZip"
          />
          <select
            onChange={(e) => handleFiltroEmpresa(e.target.value)}
            className="text-sm text-center border-none font-objetive-bold text-app-green-3 hover:cursor-pointer"
          >
            <option value="">Empresa a cargo</option>
            {empresas.map((empresa) => {
              return (
                <option key={`empresa-${empresa}`} value={empresa}>
                  {empresa}
                </option>
              );
            })}
          </select>
        </div>
        <div className="flex items-center">
          <select
            onChange={(e) => handleFiltroTipo(e.target.value)}
            className="text-sm text-center border-none font-objetive-bold text-app-green-3 hover:cursor-pointer"
          >
            <option value="">Tipo</option>
            {tiposEquipos.map((equipo) => {
              return (
                <option key={`equipo-${equipo.id}`} value={equipo.id}>
                  {equipo.name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="flex items-center">
          <select
            onChange={(e) => handleFiltroLinea(e.target.value)}
            className="text-sm text-center border-none font-objetive-bold text-app-green-3 hover:cursor-pointer"
          >
            <option value="">Línea</option>
            {responseLinea &&
              responseLinea.map((linea) => {
                return (
                  <option key={`linea-${linea.id}`} value={linea.id}>
                    {linea.name}
                  </option>
                );
              })}
          </select>
        </div>
        <div className="flex items-center">
          <select
            onChange={(e) => handleFiltroEstado(e.target.value)}
            className="w-40 text-sm text-center truncate border-none font-objetive-bold text-app-green-3 hover:cursor-pointer"
          >
            <option value="">Estado de equipo</option>
            {states.map((state) => {
              return (
                <option key={`estado-${state}`} value={state}>
                  {state}
                </option>
              );
            })}
          </select>
        </div>
        <div className="flex items-center">
          <DatePicker
            selected={startDate}
            onChange={onChangeDate}
            selectsRange
            startDate={startDate}
            endDate={endDate}
            customInput={<CustomInputDate />}
          />
        </div>
        <div className="flex items-center mb-2">
          <button
            onClick={handleClickDownloadZip}
            className="relative px-10 py-2 text-sm rounded-full font-objetive-medium bg-app-green-1 text-app-green-3"
          >
            <div className="absolute top-0 bottom-0 flex items-center -left-1">
              <DownloadIcon className="w-8 h-8 p-1 text-white rounded-full bg-app-green-3" />
            </div>
            <p className="-mb-1">Descargar .ZIP</p>
          </button>
        </div>
      </div>
      {data &&
        data.map((user, index) => {
          if (
            index < maxCantRow * pagination &&
            index >= pagination * maxCantRow - maxCantRow
          ) {
            return (
              <Row
                key={index + user.id}
                user={user}
                index={index}
                isChecked={isAllEquip}
                sendToTrash={sendToTrash}
              />
            );
          }
          return null;
        })}
    </div>
  );
};

export default Table;
