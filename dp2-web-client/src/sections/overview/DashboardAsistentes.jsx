
import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';
import PropTypes from 'prop-types';

const DashboardAsistentes = ({ dataDash }) => {
  useEffect(() => {

    console.log("-----------------------------------------------------------------");
    console.log("indicadors");
    console.log(dataDash);
    const porc= (dataDash.totalAsistencia/dataDash.totalInscritos)*100;
    const porcRounded = porc.toFixed(2);
    const options = {
      series: [{
        data: [dataDash.totalAsistencia]
      }],
      chart: {
        type: 'bar',
        height: 100
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          borderRadiusApplication: 'end',
          horizontal: true,
        }
      },
      dataLabels: {
        enabled: false,
      },
      grid: {
        padding: {
          top: -10
        }
      },
      colors: ['#0B5D1E'], // Cambia el color a azul (puedes usar otros valores de color válidos)
      xaxis: {
        categories: ['Asistentes'],
        max: dataDash.totalInscritos,
        tickAmount: Math.min(dataDash.totalInscritos, 10), // Limita la cantidad de ticks
        labels: {
          style: {
            fontSize: '16px' // Aumenta el tamaño de los números del eje x aquí
          },
          formatter (val) {
            return parseInt(val, 10); // Asegura que los valores sean enteros y no se repitan
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            fontSize: '16px' // Aumenta el tamaño del texto "Asistentes" aquí
          }
        }
      }
    };

    const chart = new ApexCharts(document.querySelector('#dashboard-bar-asist'), options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [dataDash]);

  return (
    <div > {/* Ajusta el padding superior y centra el texto */}
      <h4 style={{ textAlign: 'center' }}>Número de asistentes</h4>
      <div id="dashboard-bar-asist"  />
      {/* Aplica el borde */}
    </div>
  );
};

DashboardAsistentes.propTypes = {
  dataDash: PropTypes.shape({
    totalAsistencia: PropTypes.number.isRequired,
    totalInscritos: PropTypes.number.isRequired,
  }).isRequired,
};

export default DashboardAsistentes;

