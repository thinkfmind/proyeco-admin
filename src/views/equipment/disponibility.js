import { ChevronLeftIcon, DownloadIcon } from "@heroicons/react/outline"
import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Navbar from "../../@app/navbar"
import { createChartRegisterBreackdown, createChartRegisterMantent } from "../../helpers/chart"
import { useSelector } from "react-redux";
import useFetch from "../../hooks/useFetch";
import { getYear, sub, compareAsc } from 'date-fns'
import { capitalizeFirstLetter } from "../../helpers/string";
import { useState } from "react";
import { getValue } from "../../helpers/table";
import { backendUrl } from "../../config";

const dateActual = new Date()
const yearActual = getYear(dateActual)
const monthActual = capitalizeFirstLetter(dateActual.toLocaleString('es-ES', { month: 'long' }))
const sixMonthPast = sub(dateActual, { months: 6 })
const yearPast = getYear(sixMonthPast)
const monthPast = capitalizeFirstLetter(sixMonthPast.toLocaleString('es-ES', { month: 'long' }))

let chartBrackdown = null
let chartMantent = null

const Disponibility = () => {
  const userSelector = useSelector((store) => store.user);
	const isEmpresa = userSelector.user.role === "Empresa"
	const { response: responseActividad } = useFetch({
    url: `${backendUrl}/actividad/${isEmpresa ? `empresa/${userSelector.user.id}` : ""}`,
    options: {
      headers: {
        Authorization: `Bearer ${userSelector.user.jwtToken}`,
      },
    },
		initData: []
  });
	const { response: responseEquipo } = useFetch({
		url: `${backendUrl}/equipo/${isEmpresa ? `empresa/${userSelector.user.id}` : ""}`,
    options: {
      headers: {
        Authorization: `Bearer ${userSelector.user.jwtToken}`,
      },
    },
		initData: []
	})
	const { response: responseUsers } = useFetch({
		url: `${backendUrl}/user`,
    options: {
      headers: {
        Authorization: `Bearer ${userSelector.user.jwtToken}`,
      },
    },
		initData: []
	})
	const [empresas, setEmpresas] = useState([])
	const refChartRegisterBreackdown = useRef(null)
	const refChartRegisterMantent = useRef(null)
	const refFicha = useRef(null)
	const [dataActividad, setDataActividad] = useState([])
	const [equipos, setEquipos] = useState([])

	useEffect(() => {
		if (responseActividad.length) {
			setDataActividad(responseActividad)
		}
	}, [responseActividad])

	useEffect(() => {
		if (responseEquipo.length) {
			setEquipos(responseEquipo)
		}
	}, [responseEquipo])

	useEffect(() => {
		let actividadesAverias = {
			labels: [],
			data: {}
		}
		let actividadesMantenimiento = {
			labels: [],
			data: {}
		}
		for (let i = 0; i < dataActividad.length; i++) {
			const actividad = dataActividad[i];
			if (compareAsc(new Date(actividad.fecha), sixMonthPast.setHours(0, 0, 0, 0)) === -1) {
				continue
			}
			if (compareAsc(dateActual.setHours(23, 59, 59), new Date(actividad.fecha)) === -1) {
				continue
			}
			if (actividad.tipo === "Averías") {
				const activityName = `${actividad.equipo.name}-${actividad.linea.name}-${actividad.linea.lugar}-${actividad.estacion.name}`
				actividadesAverias.labels.push([actividad.equipo.name, actividad.estacion.name, `${actividad.linea.name} - ${actividad.linea.lugar}`])
				if (!actividadesAverias.data[activityName]) {
					actividadesAverias.data[activityName] = 1
				} else {
					actividadesAverias.data[activityName] += 1
				}
				continue
			}
			if (actividad.tipo.startsWith("Mantenimiento")) {
				const activityName = `${actividad.equipo.name}-${actividad.linea.name}-${actividad.linea.lugar}-${actividad.estacion.name}`
				if (!actividadesMantenimiento.data[activityName]) {
					actividadesMantenimiento.labels.push([actividad.equipo.name, actividad.estacion.name, `${actividad.linea.name} - ${actividad.linea.lugar}`])
					actividadesMantenimiento.data[activityName] = 1
				} else {
					actividadesMantenimiento.data[activityName] += 1
				}
				continue
			}
		}
		if (chartBrackdown) {
			chartBrackdown.destroy()
		}
		if (chartMantent) {
			chartMantent.destroy()
		}
		chartBrackdown = createChartRegisterBreackdown(refChartRegisterBreackdown.current, actividadesAverias.labels, actividadesAverias.data)
		chartMantent = createChartRegisterMantent(refChartRegisterMantent.current, actividadesMantenimiento.labels, actividadesMantenimiento.data)
	}, [dataActividad])

	useEffect(() => {
    if (responseUsers.length) {
      const empresas = [];
      for (let i = 0; i < responseUsers.length; i++) {
        const user = responseUsers[i];
        if (user.role.toUpperCase() === "EMPRESA") {
          if (!empresas.find((empresa) => empresa.id === user.id)) {
            empresas.push({
							name: user.name,
							id: user.id
						});
          }
        }
      }
      setEmpresas(empresas);
    }
  }, [responseUsers]);

	const handleClickDownloadFicha = () => {
		var w = refFicha.current.offsetWidth;
		var h = refFicha.current.offsetHeight;
		html2canvas(refFicha.current).then((canvas) => {
			const img=canvas.toDataURL('image/jpeg', 1);
			const doc = new jsPDF('landscape', "px", [w, h]);
			doc.addImage(img,'JPEG',0,20, w, h);
			doc.save('ficha.pdf');
		})
	}

	const handleFilter = (e) => {
		const selectValue = e.target.value
		let dataFilteredActividad = responseActividad;
		let dataFilteredEquipo = responseEquipo;

    if (selectValue) {
      dataFilteredActividad = [...responseActividad].filter((actividad) => {
        const value = getValue("empresa.id", actividad);
        return value === selectValue;
      });
			dataFilteredEquipo = [...responseEquipo].filter((equipo) => {
        const value = getValue("empresa.id", equipo);
        return value === selectValue;
      });
    }
    setDataActividad(dataFilteredActividad);
    setEquipos(dataFilteredEquipo);
	}

	const calEquipInService = (equipos) => {
		let countEquipInService = 0
		equipos.forEach(equipo => {
			if (equipo.funciona) {
				countEquipInService += 1
			}
		});
		return countEquipInService
	}

	const equipmentInService = calEquipInService(equipos)
	return (
		<>
      <div className="relative">
				<Navbar title="Disponibilidad de equipos" />
        <div className="absolute right-28 -bottom-12">
					<button onClick={handleClickDownloadFicha} className="relative py-2 pl-10 pr-8 text-xs rounded-full font-objetive-medium bg-app-green-1 text-app-green-3">
						<div className="absolute top-0 bottom-0 left-0 flex items-center">
							<DownloadIcon className="w-8 h-8 p-2 text-white rounded-full bg-app-green-3" />
						</div>
						Descargar ficha
					</button>
        </div>
			</div>
			<div className="px-20 pt-14 vp-desktop">
				<Link to="/equipment" className="flex font-objetive-medium">
					<ChevronLeftIcon className="w-5 h-5 mr-2 text-gray-700" />
					Volver
				</Link>
			</div>
			<div ref={refFicha} className="px-20 pb-10 vp-desktop font-objetive-regular">
				<div className="flex items-center justify-center mb-10 space-x-8">
					<div className="text-center">
						{isEmpresa ? (
							<p className="flex items-center justify-center h-10 px-10 text-white rounded-full bg-app-purple-300">{userSelector.user.name}</p>
						) : (
							<select onChange={handleFilter} className="flex items-center justify-center text-center text-white rounded-full h-14 bg-app-purple-300" style={{ textAlignLast: "center" }}>
								<option value="">Todas las empresas</option>
								{empresas.map((empresa) => {
									return <option key={`empresa-${empresa.id}`} value={empresa.id}>{empresa.name}</option>
								})}
							</select>
						)}
					</div>
					<div className="grid grid-cols-2 py-4 rounded-3xl bg-app-purple-100 text-app-purple-300">
						<div className="py-2 pl-10 pr-6 border-r border-app-purple-300">
							<p className="text-3xl font-objetive-bold">{Math.round(((equipmentInService * 100) / equipos.length)) || 0}%</p>
							<p className="text-sm">equipos en servicio</p>
						</div>
						<div className="flex flex-col justify-center py-4 pl-10 pr-6">
							<p className="text-lg font-objetive-bold">{equipmentInService}/{equipos.length}</p>
							<p className="text-sm">equipos totales</p>
						</div>
					</div>
				</div>
				<div className="grid grid-cols-12 gap-x-12">
					<div className="w-full col-span-7 p-6 bg-gray-100 rounded-3xl">
						<div className="flex flex-col items-end">
							<div className="text-right">
								<p className="font-objetive-bold">Registro de averías</p>
								<p className="text-sm">{`(${monthPast} ${yearPast} a ${monthActual} ${yearActual})`}</p>
							</div>
						</div>
						<div>
							<p className="mb-6 text-xs text-black font-objetive-medium">Averías</p>
							<canvas className="ml-2" ref={refChartRegisterBreackdown} id="chartRegisterBreackdown"></canvas>
						</div>
					</div>
					<div className="flex flex-col w-full col-span-5 p-6 bg-gray-100 rounded-3xl">
						<div className="flex flex-col items-end">
							<div className="text-right">
								<p className="font-objetive-bold">Registro mantenimientos correctivos</p>
								<p className="text-sm">{`(${monthPast} ${yearPast} a ${monthActual} ${yearActual})`}</p>
							</div>
						</div>
						<div className="flex items-center justify-center flex-grow">
							<div className="mr-4" id="legend-container-registerMantent">
								<ul className="flex flex-col items-center justify-center space-y-6 text-xs font-objetive-medium ul-chart" />
							</div>
							<div className="relative">
								<canvas ref={refChartRegisterMantent} id="chartRegisterMantent" height="300" width="200"></canvas>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default Disponibility
