
import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';
import PropTypes from 'prop-types';

const DashboardEventosAsistentes = ({ dataDash }) => {
  useEffect(() => {

    console.log("-----------------------------------------------------------------");
    console.log("indicadors");
    console.log(dataDash);
    const porc= (dataDash.totalAsistencia/dataDash.totalInscritos)*100;
    const porcRounded = porc.toFixed(2);
    const options = {
      series: [porcRounded],
      chart: {
        type: 'radialBar',
        sparkline: {
          enabled: true
        }
      },
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          track: {
            background: "#e7e7e7",
            margin: 5,
          },
          dataLabels: {
            name: {
              show: false
            },
            value: {
              offsetY: -2,
              fontSize: '22px'
            }
          }
        }
      },
      grid: {
        padding: {
          top: -10
        }
      },
      fill: {
        type: 'solid', // Asegúrate de especificar el tipo de relleno
      },
      colors: ['#00489D'], // Cambia el color a azul (puedes usar otros valores de color válidos)
      labels: ['% de Asistencia '],
    };

    const chart = new ApexCharts(document.querySelector('#dashboard-semi-circle'), options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [dataDash]);

  return (
    <div > {/* Ajusta el padding superior y centra el texto */}
      <h4 style={{ textAlign: 'center' }}>Indicador de asistencia</h4>
      <div id="dashboard-semi-circle"  />
      {/* Aplica el borde */}
    </div>
  );
};

DashboardEventosAsistentes.propTypes = {
  dataDash: PropTypes.shape({
    totalAsistencia: PropTypes.number.isRequired,
    totalInscritos: PropTypes.number.isRequired,
  }).isRequired,
};

export default DashboardEventosAsistentes;

