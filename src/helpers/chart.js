import { EyeIcon } from "@heroicons/react/outline";
import Chart from "chart.js/auto"
import ReactDOM from "react-dom";

const getOrCreateLegendList = (chart, id) => {
	const legendContainer = document.getElementById(id);
	let listContainer = legendContainer.querySelector('ul');

	if (!listContainer) {
		listContainer = document.createElement('ul');
		listContainer.style.display = 'flex';
		listContainer.style.flexDirection = 'row';
		listContainer.style.margin = 0;
		listContainer.style.padding = 0;

		legendContainer.appendChild(listContainer);
	}

	return listContainer;
};

export const createChartCountBreackdown = (canvas, dataSet) => {
	const data = {
		labels: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
		datasets: [
			{
				label: 'Mantenimiento correctivo',
				data: dataSet.correctivo,
				borderColor: "rgb(48, 108, 103)",
				backgroundColor: "rgb(48, 108, 103)",
				pointStyle: 'circle',
				pointRadius: 3,
			},
			{
				label: 'Mantenimiento preventivo',
				data: dataSet.preventivo,
				borderColor: "rgb(255, 177, 0)",
				backgroundColor: "rgb(255, 177, 0)",
				pointStyle: 'circle',
        pointRadius: 3,
			},
			{
				label: 'Averías',
				data: dataSet.averias,
				borderColor: "rgb(239, 35, 60)",
				backgroundColor: "rgb(239, 35, 60)",
				pointStyle: 'circle',
        pointRadius: 3,
			},
		]
	};

	const htmlLegendPlugin = {
		id: 'htmlLegend',
		afterUpdate(chart, args, options) {
			const ul = getOrCreateLegendList(chart, options.containerID);

			// Remove old legend items
			while (ul.firstChild) {
				ul.firstChild.remove();
			}

			// Reuse the built-in legendItems generator
			const items = chart.options.plugins.legend.labels.generateLabels(chart);

			items.forEach(item => {
				const li = document.createElement('li');
				li.style.alignItems = 'center';
				li.style.cursor = 'pointer';
				li.style.display = 'flex';
				li.style.flexDirection = 'row';
				li.style.marginLeft = '10px';

				li.onclick = () => {
					const {type} = chart.config;
					if (type === 'pie' || type === 'doughnut') {
						// Pie and doughnut charts only have a single dataset and visibility is per item
						chart.toggleDataVisibility(item.index);
					} else {
						chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex));
					}
					chart.update();
				};

				// Color box
				const boxSpan = document.createElement('span');
				// Text
				const textContainer = document.createElement('p');
				textContainer.style.color = item.fillStyle;
				textContainer.style.margin = 0;
				textContainer.style.padding = 0;
				textContainer.style.textDecoration = item.hidden ? 'line-through' : '';

				const text = document.createTextNode(item.text);
				textContainer.appendChild(text)

				li.appendChild(boxSpan);
				li.appendChild(textContainer);
				ul.appendChild(li);

				ReactDOM.render(<EyeIcon className="w-4 h-4 mr-2" style={{ color: item.fillStyle }} />, boxSpan)
			});
		}
	};

	const config = {
		type: 'line',
		data: data,
		options: {
			responsive: true,
			plugins: {
				htmlLegend: {
					containerID: 'legend-container',
				},
				legend: {
					display: false,
				}
			},
			scales: {
				x: {
					title: {
						display: true,
						text: 'Meses 2021'
					},
					grid: {
						display: false,
						drawBorder: false,
						drawOnChartArea: false,
						drawTicks: false,
					}
				},
				y: {
					title: {
						display: true,
						text: 'Averías',
						position: 'top'
					},
					grid: {
						drawBorder: false,
						color: '#000000'
					},
					suggestedMin: 0,
					suggestedMax: 25
				}
			}
		},
		plugins: [htmlLegendPlugin],
	};

	const ctx = canvas.getContext('2d');
	return new Chart(ctx, config)
}

export const createChartEquip = (canvas, averiasTotalesPerMonth) => {
	const data = {
		labels: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
		datasets: [
			{
				label: 'Averías totales',
				data: averiasTotalesPerMonth,
				borderColor: "rgb(239, 35, 60)",
				backgroundColor: "rgb(239, 35, 60)"
			}
		]
	};

	const config = {
		type: 'bar',
		data: data,
		options: {
			responsive: true,
			plugins: {
				legend: {
					display: false,
				},
				title: {
					display: false,
				}
			},
			scales: {
				x: {
					title: {
						display: false
					},
					grid: {
						display: false,
						drawBorder: false,
						drawOnChartArea: false,
						drawTicks: false,
					}
				},
				y: {
					title: {
						display: false
					},
					grid: {
						display: false,
						drawBorder: false,
						drawOnChartArea: false,
						drawTicks: false,
					},
					suggestedMin: 10,
					suggestedMax: 40
				}
			}
		},
	};

	const ctx = canvas.getContext('2d');
	return new Chart(ctx, config)
}

export const createChartRegisterBreackdown = (canvas, labels, dataSet) => {
	function colorize() {
		return (ctx) => {
			var v = ctx.parsed?.y || 0;
			var c = v <= 5 ? '#D5F5F4'
				: v <= 7 ? '#95CCCA'
				: v <= 10 ? '#6AB0AD'
				: v <= 13 ? '#306C67'
				: '#EF233C';

			return c
		};
	}

	let dataResult = []

	for (const key in dataSet) {
		if (Object.hasOwnProperty.call(dataSet, key)) {
			const result = dataSet[key];
			dataResult.push(result)
		}
	}

	const data = {
		labels,
		datasets: [
			{
				label: 'Averías',
				data: dataResult,
				borderColor: colorize(),
				backgroundColor: colorize(),
				borderRadius:  20,
				borderSkipped: false,
			}
		]
	};

	const config = {
		type: 'bar',
		data: data,
		options: {
			responsive: true,
			plugins: {
				legend: {
					display: false,
				},
				title: {
					display: false
				}
			},
			scales: {
				x: {
					title: {
						display: false
					},
					grid: {
						display: false,
						drawBorder: false,
						drawOnChartArea: false,
						drawTicks: false,
					},
				},
				y: {
					title: {
						display: false
					},
					grid: {
						display: false,
						drawBorder: false,
						drawOnChartArea: false,
						drawTicks: false,
					},
					suggestedMin: 0,
					suggestedMax: 20
				}
			}
		}
	};

	const ctx = canvas.getContext('2d');
	return new Chart(ctx, config)
}

export const createChartRegisterMantent = (canvas, labels, dataSet) => {
	function colorize() {
		return (ctx) => {
			var v = ctx.parsed?.y || 0;
			var c = v <= 0 ? '#FEF6E2'
				: v <= 1 ? '#F8E19E'
				: v <= 2 ? '#F6D271'
				: v <= 3 ? '#FFB100'
				: '#C38802';

			return c
		};
	}

	let dataResult = []

	for (const key in dataSet) {
		if (Object.hasOwnProperty.call(dataSet, key)) {
			const result = dataSet[key];
			dataResult.push(result)
		}
	}

	const data = {
		labels,
		datasets: [
			{
				label: 'Mantenimientos',
				data: dataResult,
				borderColor: colorize(),
				backgroundColor: colorize(),
				borderRadius:  20,
				borderSkipped: false,
			}
		]
	};

	const config = {
		type: 'bar',
		data: data,
		options: {
			indexAxis: 'y',
			responsive: true,
			plugins: {
				legend: {
					display: false,
				},
				title: {
					display: false,
				}
			},
			scales: {
				x: {
					title: {
						display: true,
						text: "Mantenimientos"
					},
					grid: {
						display: false,
						drawBorder: false,
						drawOnChartArea: false,
						drawTicks: false,
					},
					suggestedMin: 0,
					suggestedMax: 20
				},
				y: {
					title: {
						display: false
					},
					grid: {
						display: false,
						drawBorder: false,
						drawOnChartArea: false,
						drawTicks: false,
					},
				}
			}
		}
	};

	const ctx = canvas.getContext('2d');
	return new Chart(ctx, config)
}