import React, { useEffect, useState } from 'react';
import ApexCharts from 'apexcharts';
import PropTypes from 'prop-types';

const DashboardGeneralBarCategAsist = ({ dataDash}) => {


  useEffect(() => {
    console.log("-----------------------------------------------------------------");
    console.log("dataDashCategoriaAgrupEvento");
    console.log(dataDash);

    const options = {
      series: [
        {
          name: "Visitas",
          data: dataDash.cantidades,
        }
      ],
      chart: {
        type: 'bar',
        height: 650,
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          borderRadiusApplication: 'end',
          horizontal: true,
          dataLabels: {
            position: 'top' // Pone las etiquetas fuera de la barra
          }
        }
      },

      colors:"#EE8700",
      dataLabels: {
        enabled: true,
        offsetX: 45, // Ajusta la posición horizontal
        style: {
          colors: ['#000'], // Color de las etiquetas
          fontSize: '18px'
        }
      },
      stroke: {
        width: 1,
        colors: ['#fff'],
      },
      xaxis: {
        categories: dataDash.categoriaTiendas,
        labels: {
          style: {
            fontSize: '16px', // Cambia el tamaño de la fuente aquí
          }
        },
      },
      yaxis:{
        labels: {
          style: {
            fontSize: '16px', // Cambia el tamaño de la fuente aquí
          }
        },
      }
    };

    const chart2 = new ApexCharts(document.querySelector('#dashboard-general-bar-categ-assist'), options);
    chart2.render();

    return () => {
      chart2.destroy();
    };
  }, [dataDash]);

  return <div id="dashboard-general-bar-categ-assist" />;
};
DashboardGeneralBarCategAsist.propTypes = {
  dataDash: PropTypes.shape({
    categoriaTiendas: PropTypes.arrayOf(PropTypes.string).isRequired,
    cantidades: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired,
};

export default DashboardGeneralBarCategAsist;