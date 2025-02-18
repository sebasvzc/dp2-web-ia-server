import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';
import PropTypes from 'prop-types';

const DashboardCuponesBarCuponesUsadosCanjeados = ({ dataDash }) => {
  useEffect(() => {
    console.log("dataDashCuponesUsadosCanjeados");
    console.log(dataDash);

    const series = dataDash.map(item => ({
      name: item.variable,
      data: item.cantidades,
    }));

    const categories = dataDash.length > 0 ? dataDash[0].fechas : [];
    const options = {
      series,
      chart: {
        type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        },
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      title: {
        text: 'Cantidad de cupones usados por periodo',
      },
      xaxis: {
        title: {
          text: 'Fecha de compra',
          style: {
            fontSize: '16px',
            fontFamily: 'Roboto, sans-serif',
          }
        },
        categories,
        labels: {
          style: {
            fontSize: '16px', // Aumenta el tamaño de las etiquetas del eje x aquí
          }
        }
      },
      yaxis: {
        title: {
          text: 'Número de cupones',
          style: {
            fontSize: '16px',
            fontFamily: 'Roboto, sans-serif',
          }
        }
      },
      tooltip: {
        y: {
          formatter (val) {
            return `${val.toFixed(0)  } cupones`;
          }
        }
      },
      fill: {
        opacity: 1
      }
    };

    const chart = new ApexCharts(document.querySelector('#dashboard-cupones-canjeados-usados-clientes'), options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [dataDash]);

  return <div id="dashboard-cupones-canjeados-usados-clientes" />;
};
DashboardCuponesBarCuponesUsadosCanjeados.propTypes = {
  dataDash: PropTypes.arrayOf(PropTypes.shape({
    variable: PropTypes.string.isRequired,
    fechas: PropTypes.arrayOf(PropTypes.string).isRequired,
    cantidades: PropTypes.arrayOf(PropTypes.number).isRequired,
  })).isRequired,
};
export default DashboardCuponesBarCuponesUsadosCanjeados;

