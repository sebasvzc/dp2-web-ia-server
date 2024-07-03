import ApexCharts from 'apexcharts';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const FictionBooksSalesChart = ({ dataDash}) => {



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

      colors:"#005CAE",
      dataLabels: {
        enabled: true,
        offsetX: 45, // Ajusta la posición horizontal
        style: {
          colors: ['#000'],
          fontSize: '18px'
        },

      },
      stroke: {
        width: 1,
        colors: ['#fff'],
      },
      xaxis: {
        categories: dataDash.nombreTiendas,
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

    const chart = new ApexCharts(document.querySelector('#fiction-books-sales-chart'), options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [dataDash]);

  return <div id="fiction-books-sales-chart" />;
};
FictionBooksSalesChart.propTypes = {
  dataDash: PropTypes.shape({
    nombreTiendas: PropTypes.arrayOf(PropTypes.string).isRequired,
    cantidades: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired
};

export default FictionBooksSalesChart;