import { useState } from "react";
import dateFormat from "dateformat";

const Row = ({ item }) => {
  const [openDescription, setOpenDescription] = useState(false);
  const [fadeActive, setFadeActive] = useState(false);

	const handleClick = () => {
    if (fadeActive === openDescription) {
      setOpenDescription(!openDescription);
      setTimeout(() => {
        setFadeActive(!fadeActive);
      }, 0);
    }
  };

	return (
		<tr className="relative">
			<td
				className={`${
					openDescription ? "pb-20 pt-4" : "py-4"
				} text-xs transition-padding duration-500 ease-in-out border-b border-gray-300 font-objetive-medium`}
			>
				{dateFormat(Date.parse(item.createdAt), "dd/mm/yy - hh:ss")}
			</td>
			<td
				className={`${
					openDescription ? "pb-20 pt-4" : "py-4"
				} text-xs transition-padding duration-500 ease-in-out truncate border-b border-gray-300 font-objetive-regular`}
			>
				{item.equipo} - {item.linea.name} - {item.estacion.name}
			</td>
			<td
				className={`${
					openDescription ? "pb-20 pt-4" : "py-4"
				} text-xs transition-padding duration-500 ease-in-out border-b border-gray-300 font-objetive-regular`}
			>
				De: {item.from} - Para {item.to}
			</td>
			<td
				className={`${
					openDescription ? "pb-20 pt-4" : "py-4"
				} text-xs transition-padding duration-500 ease-in-out border-b border-gray-300 font-objetive-medium`}
			>
				Asunto: {item.asunto}
			</td>
			<td
				className={`${
					openDescription ? "pb-20 pt-4" : "py-4"
				} border-b transition-padding duration-500 ease-in-out border-gray-300`}
			>
				<button
					className="text-xs underline font-objetive-medium text-app-purple-300"
					onClick={handleClick}
				>
					Ver detalles
				</button>
				{openDescription && (
					<div className="absolute bottom-0 left-0 right-0">
						<div className="flex items-center h-20 text-xs font-objetive-regular">
							<p
								className={`${
									fadeActive ? "opacity-100" : "opacity-0"
								} transition-opacity duration-1000 ease-in-out`}
							>
								{item.mensaje}
							</p>
						</div>
					</div>
				)}
			</td>
		</tr>
	)
}

export default Row
