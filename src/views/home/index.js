import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../../@app/navbar";
import Company from "../../components/home/company";
import Linea from "../../components/home/linea";
import Estacion from "../../components/home/estacion";
import Equipo from "../../components/home/equipo";
import HorizontalList from "../../containers/home/horizontalList";
import HorizontalListMod from "../../containers/home/horizontalList/mod";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as Scroll from "react-scroll";
import { LocationMarkerIcon, CogIcon } from "@heroicons/react/solid";
import Rail from "../../assets/img/rail.svg";
import Escalator from "../../assets/img/escalator.svg";
import Station from "../../assets/img/station.svg";
import Description from "../../components/home/equipo/description";
import { logout } from "../../redux/ducks/user";
import { backendUrl } from "../../config";

const Home = () => {
  const userSelector = useSelector((store) => store.user);
  const [load, setLoad] = useState(true);
  const [data, setData] = useState([]);
  const [dataLineas, setDataLineas] = useState([]);
  const [dataEstaciones, setDataEstaciones] = useState([]);
  const [dataEquipos, setDataEquipos] = useState([]);
  const dispatch = useDispatch();
  const history = useHistory();

  const [allSelector, setAllSelector] = useState(
    userSelector.user.role === "Empresa" ? false : true
  );

  const [freshLineas, setFreshLineas] = useState([]);
  const [freshEstaciones, setFreshEstaciones] = useState([]);
  const [equiposFresh, setEquiposFresh] = useState([]);

  const [empresa, setEmpresa] = useState("");
  const [linea, setLinea] = useState("");
  const [estacion, setEstacion] = useState("");
  const [estacionName, setEstacionName] = useState("");
  const [lineaName, setLineaName] = useState("");
  const [lineaLugar, setLineaLugar] = useState("");
  const [empresaName, setEmpresaName] = useState("");
  const [equipo, setEquipo] = useState("");
  const [equipoId, setEquipoId] = useState("");
  const [allEstaciones, setAllEstaciones] = useState(false)

  let scroll = Scroll.animateScroll;

  const setAllSelectorHandler = (value) => {
    setAllSelector(value);
    setEmpresa("ALL");
    setEmpresaName("ALL");
    setAllEstaciones(true);
    setFreshLineas(dataLineas);
  };

  const setEmpresaHandler = (value, name) => {
    setLineaName("");
    setEmpresa(value);
    setEmpresaName(name);
    setAllEstaciones(false);
    const sanitize = dataLineas.filter((linea) => {
      return linea.empresas.includes(value);
    });
    if (empresa !== value) {
      setLinea("");
      setEstacion("");
    }
    setFreshLineas(sanitize);
  };

  const setLineaHandler = (value, name, lugar) => {
    setLinea(value);
    setLineaName(name);
    setLineaLugar(lugar);
    const sanitize = dataEstaciones.filter((estacion) => {
      return estacion.linea === value;
    });
    if (linea !== value) {
      setEstacion("");
    }
    setFreshEstaciones(sanitize);
    scroll.scrollToBottom();
  };

  const setEstacionHandler = (value, name) => {
    if (empresa !== "ALL") {
      setEstacion(value);
      setEstacionName(name);
      const sanitize = dataEquipos.filter((equipo) => {
        return equipo.estacion.id === value && equipo.empresa.id === empresa;
      });
      setEquiposFresh(sanitize);
    } else {
      setEstacion("ALL");
      const sanitize = dataEquipos.filter((equipo) => {
        return equipo.estacion.id === value;
      });
      setEquiposFresh(sanitize);
    }
    scroll.scrollToBottom();
  };

  const setEquipoHandler = (value, id) => {
    setEquipo(value);
    setEquipoId(id);
    scroll.scrollToBottom();
  };

  const equiposByEmpresaCount = (empresa) => {
    const result = dataEquipos.filter((equipo) => {
      return equipo.empresa.id === empresa;
    });
    return result.length;
  };

  const equiposByEmpresaFuncionandoCount = (empresa) => {
    const result = dataEquipos.filter((equipo) => {
      return equipo.empresa.id === empresa && equipo.funciona === true;
    });
    return result.length;
  };

  const equiposByLineaCount = (linea) => {
    if (empresa !== "ALL") {
      const result = dataEquipos.filter((equipo) => {
        return equipo.linea.id === linea && equipo.empresa.id === empresa;
      });
      return result.length;
    } else {
      const result = dataEquipos.filter((equipo) => {
        return equipo.linea.id === linea;
      });
      return result.length;
    }
  };

  const equiposByLineaFuncionandoCount = (linea) => {
    if (empresa !== "ALL") {
      const result = dataEquipos.filter((equipo) => {
        return (
          equipo.linea.id === linea &&
          (equipo.funciona === true) & (equipo.empresa.id === empresa)
        );
      });
      return result.length;
    } else {
      const result = dataEquipos.filter((equipo) => {
        return equipo.linea.id === linea && equipo.funciona === true;
      });
      return result.length;
    }
  };

  const equiposByEstacionCount = (estacion) => {
    if (empresa !== "ALL") {
      const result = dataEquipos.filter((equipo) => {
        return (
          (equipo.estacion.id === estacion) & (equipo.empresa.id === empresa)
        );
      });
      return result.length;
    } else {
      const result = dataEquipos.filter((equipo) => {
        return equipo.estacion.id === estacion;
      });
      return result.length;
    }
  };

  const equiposByEstacionFuncionandoCount = (estacion) => {
    if (empresa !== "ALL") {
      const result = dataEquipos.filter((equipo) => {
        return (
          equipo.estacion.id === estacion &&
          (equipo.funciona === true) & (equipo.empresa.id === empresa)
        );
      });
      return result.length;
    } else {
      const result = dataEquipos.filter((equipo) => {
        return equipo.estacion.id === estacion && equipo.funciona === true;
      });
      return result.length;
    }
  };

  const consult = async (source) => {
    const toastLoading = toast.loading("Cargando...");

    try {
      const res = await axios.get(`${backendUrl}/user/`, {
        cancelToken: source.token,
        headers: {
          Authorization: `Bearer ${userSelector.user.jwtToken}`,
        },
      });
      const res2 = await axios.get(`${backendUrl}/linea/`, {
        cancelToken: source.token,
        headers: {
          Authorization: `Bearer ${userSelector.user.jwtToken}`,
        },
      });
      const res3 = await axios.get(`${backendUrl}/estacion/`, {
        cancelToken: source.token,
        headers: {
          Authorization: `Bearer ${userSelector.user.jwtToken}`,
        },
      });
      const res4 = await axios.get(`${backendUrl}/equipo/`, {
        cancelToken: source.token,
        headers: {
          Authorization: `Bearer ${userSelector.user.jwtToken}`,
        },
      });

      if (userSelector.user.role === "Empresa") {
        const sanitize = res.data.filter((user) => {
          return user.id === userSelector.user.id;
        });
        setData(sanitize);
      } else {
        const sanitize = res.data.filter((user) => {
          return user.role === "Empresa";
        });
        setData(sanitize);
      }

      setDataEstaciones(res3.data);
      setDataEquipos(res4.data);

      setDataLineas(res2.data);
      setLoad(false);

      // setTimeout(() => {
      //   setEmpresaHandler("614ccb08fb36610045bc2d82", "Imen");
      //   setLineaHandler("614d35880cdb68003a696d0b", "Rawson", "Chubut");
      //   setEstacionHandler("614d35dfbceb8d005b874873", "Margarita");
      // }, 3000);

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

  const dubmHandler = () => {};

  useEffect(() => {
    let source = axios.CancelToken.source();
    consult(source);

    return () => {
      source.cancel();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (equipo) {
    return (
      <>
        <Navbar title="Sistema de monitoreo y control" />
        <div className="relative pl-20 pr-20 vp-desktop">
          <div className="flex justify-between">
            <div className="text-center">
              <div
                className="items-center cursor-pointer justify-center px-10 pt-4 pb-3 rounded-full bg-app-purple-200 text-app-purple-300 mt-14 font-objetive-bold left-28 top-8"
                onClick={() => {
                  setEquipoHandler("", "");
                  setEstacionHandler("", "");
                  setLineaHandler("", "", "");
                  setEmpresaHandler("", "");
                }}
              >
                Todas
              </div>
            </div>
            <div
              className="flex flex-col items-center content-center justify-center cursor-pointer"
              onClick={() => {
                setEquipoHandler("", "");
                setEstacionHandler("", "");
                setLineaHandler("", "", "");
              }}
            >
              <div className="flex items-center justify-center px-10 pt-4 pb-3 rounded-full bg-app-yellow-5 text-app-yellow-4 mt-14 font-objetive-bold left-28 top-8">
                Lineas
                <img src={Rail} alt="Rail" className="w-6 h-6 ml-3"></img>
              </div>
              <div className="flex mt-3 font-objetive-bold text-sm text-yellow-700 justify-center">
                <CogIcon
                  className="h-4 w-4 text-yellow-700 mr-1"
                  aria-hidden="true"
                />
                <div>{empresaName}</div>
              </div>
            </div>
            <div
              className="flex items-center flex-col content-center justify-center cursor-pointer"
              onClick={() => {
                setEquipoHandler("", "");
                setEstacionHandler("", "");
              }}
            >
              <div className="flex items-center justify-center px-10 pt-4 pb-3 rounded-full bg-app-red-2 text-app-yellow-4 mt-14 font-objetive-bold left-28 top-8">
                Estaciones
                <img src={Station} alt="Station" className="w-6 h-6 ml-3"></img>
              </div>
              <div className="flex mt-3 font-objetive-bold text-sm text-red-700 justify-center">
                <LocationMarkerIcon
                  className="h-4 w-4 text-red-700 mr-1"
                  aria-hidden="true"
                />
                <div>
                  {lineaLugar} - {lineaName}
                </div>
              </div>
            </div>
            <div
              className="flex flex-col items-center content-center justify-center cursor-pointer"
              onClick={() => {
                setEquipoHandler("", "");
              }}
            >
              <div className="flex items-center content-center justify-center px-10 pt-4 pb-3 rounded-full bg-app-green-3 text-app-yellow-4 mt-14 font-objetive-bold left-28 top-8">
                Equipos
                <img
                  src={Escalator}
                  alt="Station"
                  className="w-6 h-6 ml-3"
                ></img>
              </div>
              <div className="flex mt-3 font-objetive-bold text-sm text-green-700 justify-center">
                <LocationMarkerIcon
                  className="h-4 w-4 text-green-700 mr-1"
                  aria-hidden="true"
                />
                <div className="">
                  {lineaLugar} - {lineaName} - {estacionName}
                </div>
              </div>
            </div>
          </div>
          <Description id={equipoId} closeHandler={setEquipoHandler} />
        </div>
      </>
    );
  } else {
    return (
      <>
        <Toaster position="top-right" reverseOrder={false} />
        <Navbar title="Sistema de monitoreo y control" />
        <HorizontalListMod
          theme="violet"
          handler={setAllSelectorHandler}
          hide={allSelector}
          role={userSelector.user.role}
          select={empresaName}
        >
          {load ? (
            <Company
              name="Empresa"
              key="asjbdhahisdabhjsd"
              equiposQuanty={0}
              equiposFuncionando={0}
              handler={dubmHandler}
              hide={true}
            />
          ) : null}

          {data.length > 0 ? (
            data.map((item, index) => {
              return (
                <Company
                  select={empresaName}
                  name={item.name}
                  id={item.id}
                  key={item.id}
                  picture={item.picture}
                  equiposQuanty={equiposByEmpresaCount(item.id)}
                  equiposFuncionando={equiposByEmpresaFuncionandoCount(item.id)}
                  handler={setEmpresaHandler}
                  hide={allSelector}
                />
              );
            })
          ) : !load ? (
            <div className="py-3 pl-5 opacity-50 font-objetive-medium">
              No se encontraron datos relacionados
            </div>
          ) : null}
        </HorizontalListMod>

        {empresa ? (
          <HorizontalList theme="yellow">
            {load ? (
              <Linea
                name="asdasd"
                key="asdasdasdasd2"
                equiposQuanty={0}
                equiposFuncionando={0}
                handler={dubmHandler}
              />
            ) : null}

            {freshLineas.length > 0 ? (
              freshLineas.map((item, index) => {
                return (
                  <Linea
                    select={lineaName}
                    name={item.name}
                    lugar={item.lugar}
                    id={item.id}
                    key={item.id}
                    equiposQuanty={equiposByLineaCount(item.id)}
                    equiposFuncionando={equiposByLineaFuncionandoCount(item.id)}
                    handler={setLineaHandler}
                  />
                );
              })
            ) : !load ? (
              <div className="py-3 pl-5 opacity-50 font-objetive-medium">
                No se encontraron datos relacionados
              </div>
            ) : null}
          </HorizontalList>
        ) : null}

        {linea ? (
          <HorizontalList theme="red">
            {load ? (
              <Company
                name="Empresa"
                key="asjbdhahisdabhjsd3"
                equiposQuanty={0}
                equiposFuncionando={0}
                handler={dubmHandler}
              />
            ) : null}

            {freshEstaciones.length > 0 ? (
              freshEstaciones.map((item, index) => {
                return (
                  <Estacion
                    select={estacionName}
                    name={item.name}
                    key={item.id}
                    id={item.id}
                    allEstaciones={allEstaciones}
                    equiposQuanty={equiposByEstacionCount(item.id)}
                    equiposFuncionando={equiposByEstacionFuncionandoCount(
                      item.id
                    )}
                    handler={setEstacionHandler}
                  />
                );
              })
            ) : !load ? (
              <div className="py-3 pl-5 opacity-50 font-objetive-medium">
                No se encontraron datos relacionados
              </div>
            ) : null}
          </HorizontalList>
        ) : null}

        {estacion ? (
          <HorizontalList theme="green">
            {load ? (
              <Company
                name="Empresa"
                key="asjbdhahisdabhjsd4"
                equiposQuanty={0}
                equiposFuncionando={0}
                handler={dubmHandler}
              />
            ) : null}
            {equiposFresh.length > 0 ? (
              equiposFresh.map((item, index) => {
                return (
                  <Equipo
                    name={item.name}
                    id={item.id}
                    handler={setEquipoHandler}
                  />
                );
              })
            ) : !load ? (
              <div className="py-3 pl-5 opacity-50 font-objetive-medium">
                No se encontraron datos relacionados
              </div>
            ) : null}
          </HorizontalList>
        ) : null}

        <div className="mt-10" />
      </>
    );
  }
};

export default Home;
