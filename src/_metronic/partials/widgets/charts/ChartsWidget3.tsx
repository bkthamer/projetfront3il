import React, { useEffect, useState, useRef } from 'react';
import ApexCharts, { ApexOptions } from 'apexcharts';
import axios from 'axios';
import { useThemeMode } from '../../layout/theme-mode/ThemeModeProvider';
import { getCSSVariableValue } from '../../../assets/ts/_utils';
import { Dropdown1 } from '../../content/dropdown/Dropdown1';
import { KTIcon } from '../../../helpers';

type Props = {
  className: string;
};

const ChartsWidget3: React.FC<Props> = ({ className }) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const { mode } = useThemeMode();
  const [chart, setChart] = useState<ApexCharts | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/users`);
        console.log('Données des utilisateurs:', response.data);
        if (chartRef.current) {
          const chartOptions = getChartOptions(chartRef.current.offsetHeight, response.data);
          if (chart) {
            chart.updateOptions(chartOptions);
          } else {
            const newChart = new ApexCharts(chartRef.current, chartOptions);
            newChart.render();
            setChart(newChart);
          }
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();

    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, [mode]);

  const getChartOptions = (height: number, users: any[]): ApexOptions => {

    const rolesCount = users.reduce((acc: { [key: string]: number }, user) => {
      const role = user.role === 'creator' ? 'utilisateur normal' : user.role;
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(rolesCount);
    const seriesData = Object.values(rolesCount) as number[]; // Assurez-vous que c'est un tableau de nombres

    const baseColor = getCSSVariableValue('--bs-info');
    const borderColor = getCSSVariableValue('--bs-gray-200');
    const labelColor = getCSSVariableValue('--bs-gray-500');

    return {
      series: [{
        name: 'Utilisateurs',
        data: seriesData,
      }] as ApexAxisChartSeries, // Utilisez ApexAxisChartSeries pour le typage
      chart: {
        type: 'bar',
        height: height,
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        categories: labels,
        labels: {
          style: {
            colors: labelColor,
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: labelColor,
          },
        },
      },
      grid: {
        borderColor: borderColor,
        strokeDashArray: 4,
      },
      colors: [baseColor],
      dataLabels: {
        enabled: true,
      },
    };
  };

  return (
    <div className={`card ${className}`}>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Distribution des Rôles Utilisateur</span>
          <span className='text-muted fw-semibold fs-7'>Aperçu des rôles utilisateur</span>
        </h3>
        <div className='card-toolbar'>
          <button
            type='button'
            className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
            data-kt-menu-flip='top-end'
          >
            <KTIcon iconName='category' className='fs-2' />
          </button>
          <Dropdown1 />
        </div>
      </div>
      <div className='card-body'>
        <div ref={chartRef} id='bar_chart_widget' style={{ height: '350px' }} />
      </div>
    </div>
  );
};

export { ChartsWidget3 };
