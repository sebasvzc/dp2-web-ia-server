import PropTypes from 'prop-types';
import ApexCharts from 'apexcharts';
import React, { useEffect } from 'react';

import Typography from '@mui/material/Typography';

const DashboardGeneralJuegosGeneral = ({ dataDash }) => {
  useEffect(() => {
    console.log("-----------------------------------------------------------------");
    console.log("dataDashEdadAgrupGral");
    console.log(dataDash);

    // Definir las URLs de las imágenes para cada juego
    const imageUrls = {
      'Enfría al Yeti': '/assets/juegos/JuegoRA1.png',
      'Encesta y Gana': '/assets/juegos/JuegoRA2.png',
      'Mi amix migue': '/assets/juegos/JuegoRA3.png',
      'Bloques caóticos': '/assets/juegos/JuegoRA4.png',
      // Agrega más juegos y sus URLs correspondientes aquí
    };

    const total = dataDash.data.reduce((acc, val) => acc + val, 0); // Total de todos los valores de datos

    const options = {
      series: [{
        name: 'Asistentes',
        data: dataDash.data
      }],
      chart: {
        height: 350,
        type: 'bar',
      },
      colors: ["#005CAE"],
      plotOptions: {
        bar: {
          dataLabels: {
            position: 'top', // top, center, bottom
          },
        }
      },
      dataLabels: {
        enabled: true,
        formatter(val, { seriesIndex, dataPointIndex, w }) {
          const percentage = ((val / total) * 100).toFixed(2);
          return `${val} (${percentage}%)`;
        },
        offsetY: -30,
        style: {
          fontSize: '18px',
          colors: ["#304758"]
        }
      },
      xaxis: {
        categories: dataDash.categoria,
        position: 'bottom',
        axisBorder: {
          show: false
        },
        labels: {
          formatter(val) {
            return val; // Mostrar el nombre de la categoría tal cual
          },
          style: {
            fontSize: '16px', // Cambia el tamaño de la fuente aquí
          },
        },
        axisTicks: {
          show: false
        },
        crosshairs: {
          fill: {
            type: 'gradient',
            gradient: {
              colorFrom: '#D8E3F0',
              colorTo: '#BED1E6',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            }
          }
        },
        tooltip: {
          enabled: true,
        }
      },
      yaxis: {
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
          formatter(val) {
            return `${val}`;
          }
        }
      },
      tooltip: {
        custom: ({ series, seriesIndex, dataPointIndex, w }) => {
          const category = dataDash.categoria[dataPointIndex];
          console.log(category)
          const value = series[seriesIndex][dataPointIndex];
          const percentage = ((value / total) * 100).toFixed(2);
          const imageUrl = imageUrls[category];
          return `
            <div style="padding: 10px; text-align: center;">
              <img src="${imageUrl}" alt="${category}" style="width: 100px; height: 100px;" />
              <div>${category}</div>
              <div>${value} (${percentage}%)</div>
            </div>
          `;
        }
      }
    };

    const chart = new ApexCharts(document.querySelector('#dashboard-juego-tipos'), options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [dataDash]);

  return (
    <div>
      <Typography variant="h4" sx={{ mt: 1 }}>
        Personas que han interactuado con juegos RA
      </Typography>
      <div id="dashboard-juego-tipos" />
    </div>
  );
};

DashboardGeneralJuegosGeneral.propTypes = {
  dataDash: PropTypes.shape({
    categoria: PropTypes.arrayOf(PropTypes.string).isRequired,
    data: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired,
};

export default DashboardGeneralJuegosGeneral;