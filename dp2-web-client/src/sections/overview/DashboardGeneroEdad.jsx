
import PropTypes from 'prop-types';
import ApexCharts from 'apexcharts';
import React, { useEffect } from 'react';

const DashboardGeneroEdad = ({ dataDash }) => {
  useEffect(() => {

    console.log("-----------------------------------------------------------------");
    console.log("indicadors");
    console.log(dataDash);

    // Extraer categorías únicas (edadAgrup)
    const categories = [...new Set(dataDash.map(item => item.edadAgrup))];

    // Extraer géneros únicos
    const generos = [...new Set(dataDash.map(item => item.genero))];

    // Crear series de datos agrupados por género
    const series = generos.map(genero => ({
        name: genero,
        data: categories.map(category => {
          const item = dataDash.find(d => d.edadAgrup === category && d.genero === genero);
          return item ? item.conteo : 0;
        })
      }));

    console.log(series)

    const options = {
      series,
      chart: {
        type: 'bar',
        height: 430
      },
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            position: 'top',
          },
        }
      },
      dataLabels: {
        enabled: false, // Deshabilita las etiquetas de datos en el gráfico
      },
      stroke: {
        show: true,
        width: 1,
        colors: ['#fff']
      },
      tooltip: {
        shared: true,
        intersect: false
      },
      xaxis: {
        categories,
        labels: {
          style: {
            fontSize: '16px' // Aumenta el tamaño de los números del eje x aquí
          }
        },
        title: {
          text: 'Conteo',
          style: {
            fontSize: '16px' // Aumenta el tamaño de la leyenda del eje x aquí
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            fontSize: '16px' // Aumenta el tamaño de los números del eje y aquí
          }
        }
      },
      colors: [ '#AF3B6E','#FEA82F', '#084887'],
      legend: {
        position: 'top',
        horizontalAlign: 'center',
        fontSize: '16px',  // Aumenta el tamaño de la fuente de la leyenda
        markers: {
          width: 12,
          height: 12,
        },
        itemMargin: {
          horizontal: 10,
          vertical: 5
        }
      },
    };
    const chart = new ApexCharts(document.querySelector('#dashboard-bar-genre-age'), options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [dataDash]);

  return (
    <div > {/* Ajusta el padding superior y centra el texto */}
      <h4 style={{ textAlign: 'center' }}>Distribución de personas inscritas por edad y género</h4>
      <div id="dashboard-bar-genre-age"  />
      {/* Aplica el borde */}
    </div>
  );
};

DashboardGeneroEdad.propTypes = {
  dataDash: PropTypes.arrayOf(
    PropTypes.shape({
      edadAgrup: PropTypes.string.isRequired,
      genero: PropTypes.string.isRequired,
      conteo: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default DashboardGeneroEdad;

