import { compareAsc } from "date-fns";
import Row from "./row";
import { getValue } from "../../../helpers/table";
import useFetch from "../../../hooks/useFetch";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { states } from "../../../helpers/equipment";
import { backendUrl } from "../../../config";
import { tiposEquipos } from "../../../helpers/staticData";

const Table = ({ data, pagination, maxCantRow, changeData, role }) => {
  const userSelector = useSelector((store) => store.user);
	const isEmpresa = userSelector.user.role === "Empresa"
  const [empresas, setEmpresas] = useState([]);
  const [filtroEmpresa, setFiltroEmpresa] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState(null);
  const [filtroLinea, setFiltroLinea] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState(null);

  const { response: responseEquipo } = useFetch({
    url: `${backendUrl}/equipo/${isEmpresa ? `empresa/${userSelector.user.id}` : ""}`,
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
  const { response: responseLinea } = useFetch({
    url: `${backendUrl}/linea/${isEmpresa ? userSelector.user.id : ""}`,
    options: {
      headers: {
        Authorization: `Bearer ${userSelector.user.jwtToken}`,
      },
    },
    initData: [],
  });

  const handleFilterTable = (property, value) => {
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

  return (
    <div>
      <h1 className="mt-8 mb-6 text-xl font-objetive-bold">
        Listado de equipos
      </h1>
      <div className="flex mt-6 mb-14">
        {role === "Gerente" ? (
          <div className="flex items-center">
            <select
              onChange={(e) => handleFiltroEmpresa(e.target.value)}
              className="pl-0 text-sm text-center border-none font-objetive-bold text-app-green-3 hover:cursor-pointer"
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
        ) : null}
        <div className="flex items-center">
          <select
            onChange={(e) => handleFiltroTipo(e.target.value)}
            className={`text-sm text-center border-none font-objetive-bold text-app-green-3 hover:cursor-pointer ${role === 'Gerente' ? '' : 'pl-0'}`}
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
            <option value="">L??nea</option>
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
            className="text-sm text-center truncate border-none w-60 font-objetive-bold text-app-green-3 hover:cursor-pointer"
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

        <div className="flex justify-end w-full">
          <Link
            to="/equipment/disponibility"
            className="inline-flex items-center px-4 pt-4 pb-3 text-base text-white border border-transparent rounded-full shadow-sm bottom--20 right-32 font-objetive-medium bg-app-purple-btn hover:bg-red-500 focus:outline-none "
          >
            Ver disponibilidad
          </Link>
        </div>
      </div>

      {data &&
        data.map((user, index) => {
          if (
            index < maxCantRow * pagination &&
            index >= pagination * maxCantRow - maxCantRow
          ) {
            return <Row key={index + user.id} user={user} index={index} />;
          }
          return null;
        })}
    </div>
  );
};

export default Table;
