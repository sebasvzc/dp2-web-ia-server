import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';
import PropTypes from 'prop-types';

const DashboardCuponesMesCliente = ({ dataDash }) => {
  useEffect(() => {
    console.log("-----------------------------------------------------------------");
    console.log(dataDash);
    const seriesData = dataDash.map(item => item.cantidades);
    const categoriesData = dataDash.map(item => item.fechas);
    console.log("series");
    console.log(seriesData);
    console.log("categorias");
    console.log(categoriesData);
    const options = {
      series: [{
        name: "Cupones",
        data: seriesData
      }],
      chart: {
        type: 'bar',
        height: 350
      },
      colors:  [ '#0B5D1E','#EE8700', '#983490', '#007881', '#F2B53D','#73B359','#736256','#5993B3','#5E7356','#9D875C'],
      dataLabels: {
        enabled: false
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded',
          fontSize: '15px',
        },
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        title: {
          text: 'Fecha de compra',
          style: {
            fontSize: '20px',
            fontFamily: 'Roboto, sans-serif',
          }
        },
        categories:categoriesData,
        labels: {
          style: {
            fontSize: '16px', // Aumenta el tamaño de las etiquetas del eje x aquí
          }
        }
      },

      yaxis: {
        title: {
          text: 'Cupones canjeados',
          style: {
            fontSize: '20px',
            fontFamily: 'Roboto, sans-serif',
          }
        },
        labels: {
          style: {
            fontSize: '16px', // Aumenta el tamaño de las etiquetas del eje x aquí
          }
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter (val) {
            return `${val  } cupones`
          }
        }
      }

  };

    const chart = new ApexCharts(document.querySelector('#dashboard-cupones-mes-clientes'), options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [dataDash]);

  return (
    <div > {/* Ajusta el padding superior y centra el texto */}
      <h4 style={{ textAlign: 'center' }}>Cupones por periodo de Canje</h4>
      <div id="dashboard-cupones-mes-clientes" />
    </div>
  );
};
DashboardCuponesMesCliente.propTypes = {
  dataDash: PropTypes.arrayOf(PropTypes.shape({
    fechas: PropTypes.string.isRequired,
    cantidades: PropTypes.number.isRequired,
  })).isRequired,
};
export default DashboardCuponesMesCliente;

