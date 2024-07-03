import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';

const DashboardGeneralGeneroEvento = ({ dataDash }) => {
  useEffect(() => {
    console.log("-----------------------------------------------------------------");
    console.log("dataDashCategoriaAgrup");
    console.log(dataDash);

    const options = {
      series: dataDash.data,
      chart: {
        type: 'pie',
        height: 350,
      },
      labels: dataDash.categoria,
      legend: {
        position: 'top',
        fontSize: '15px',
      },
      dataLabels: {
        style: {
          fontSize: '20px',
          fontWeight: 'normal',
          color: '#333',
          fontFamily: 'Roboto, sans-serif',
        },
      },
      colors: [ '#AF3B6E','#FEA82F', '#084887'], // Darker base colors
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'top',
          },
        },
      }],
      plotOptions: {
        pie: {
          customScale: 1,
          dataLabels: {
            offset: -5,
          },
        },
      },
    };

    const chart = new ApexCharts(document.querySelector('#dashboard-pie-chart'), options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [dataDash]);

  return (
    <div>
      <Typography variant="h4" sx={{ mt: 1 }}>
        Asistentes a eventos por género
      </Typography>
      <div id="dashboard-pie-chart" />
    </div>
  );
};

DashboardGeneralGeneroEvento.propTypes = {
  dataDash: PropTypes.shape({
    categoria: PropTypes.arrayOf(PropTypes.string).isRequired,
    data: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired,
};

export default DashboardGeneralGeneroEvento;
