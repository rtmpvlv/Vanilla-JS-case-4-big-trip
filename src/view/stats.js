/* eslint-disable no-underscore-dangle */
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from './smart';
import { sortTypesForCosts, sortPointsForTypes, sortTypesForDuration } from '../utils/sort-utils';
import convertDuration from '../utils/format-utils';

const BAR_HEIGHT = 55;

const renderMoneyGraph = (moneyCtx, data) => (new Chart(moneyCtx, {
  plugins: [ChartDataLabels],
  type: 'horizontalBar',
  data: {
    labels: sortTypesForCosts(data)[0],
    datasets: [{
      data: sortTypesForCosts(data)[1],
      backgroundColor: '#ffffff',
      hoverBackgroundColor: '#ffffff',
      anchor: 'start',
    }],
  },
  options: {
    plugins: {
      datalabels: {
        font: {
          size: 13,
        },
        color: '#000000',
        anchor: 'end',
        align: 'start',
        formatter: (val) => `€ ${val}`,
      },
    },
    title: {
      display: true,
      text: 'MONEY',
      fontColor: '#000000',
      fontSize: 23,
      position: 'left',
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: '#000000',
          padding: 5,
          fontSize: 13,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
        barThickness: 44,
      }],
      xAxes: [{
        ticks: {
          display: false,
          beginAtZero: true,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
        minBarLength: 50,
      }],
    },
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
    },
  },
}));

const renderTypeGraph = (typeCtx, data) => (new Chart(typeCtx, {
  plugins: [ChartDataLabels],
  type: 'horizontalBar',
  data: {
    labels: sortPointsForTypes(data)[0],
    datasets: [{
      data: sortPointsForTypes(data)[1],
      backgroundColor: '#ffffff',
      hoverBackgroundColor: '#ffffff',
      anchor: 'start',
    }],
  },
  options: {
    plugins: {
      datalabels: {
        font: {
          size: 13,
        },
        color: '#000000',
        anchor: 'end',
        align: 'start',
        formatter: (val) => `${val}x`,
      },
    },
    title: {
      display: true,
      text: 'TYPE',
      fontColor: '#000000',
      fontSize: 23,
      position: 'left',
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: '#000000',
          padding: 5,
          fontSize: 13,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
        barThickness: 44,
      }],
      xAxes: [{
        ticks: {
          display: false,
          beginAtZero: true,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
        minBarLength: 50,
      }],
    },
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
    },
  },
}));

const renderTimeGraph = (timeCtx, data) => (new Chart(timeCtx, {
  plugins: [ChartDataLabels],
  type: 'horizontalBar',
  data: {
    labels: sortTypesForDuration(data)[0],
    datasets: [{
      data: sortTypesForDuration(data)[1],
      backgroundColor: '#ffffff',
      hoverBackgroundColor: '#ffffff',
      anchor: 'start',
    }],
  },
  options: {
    plugins: {
      datalabels: {
        font: {
          size: 13,
        },
        color: '#000000',
        anchor: 'end',
        align: 'start',
        formatter: (val) => `${convertDuration(val)}`,
      },
    },
    title: {
      display: true,
      text: 'TIME',
      fontColor: '#000000',
      fontSize: 23,
      position: 'left',
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: '#000000',
          padding: 5,
          fontSize: 13,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
        barThickness: 44,
      }],
      xAxes: [{
        ticks: {
          display: false,
          beginAtZero: true,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
        minBarLength: 50,
      }],
    },
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
    },
  },
}));

export default class Stats extends SmartView {
  constructor(points) {
    super();
    this._markup = `
    <section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>
      <div class="statistics__item">
        <canvas class="statistics__chart" id="money" width="900"></canvas>
      </div>
      <div class="statistics__item">
        <canvas class="statistics__chart" id="type" width="900"></canvas>
      </div>
      <div class="statistics__item">
        <canvas class="statistics__chart" id="time-spend" width="900"></canvas>
      </div>
    </section>`;
    this._data = points;
    this._moneyChart = null;
    this._typeChart = null;
    this._timeChart = null;

    this._setCharts();
  }

  getTemplate() {
    return this._markup;
  }

  removeElement() {
    super.removeElement();

    if (this._moneyChart !== null || this._typeChart !== null || this._timeChart !== null) {
      this._moneyChart = null;
      this._typeChart = null;
      this._timeChart = null;
    }
  }

  hide() {
    this._element.classList.add('visually-hidden');
  }

  show() {
    this._element.classList.remove('visually-hidden');
  }

  _setCharts() {
    if (this._moneyChart !== null || this._typeChart !== null || this._timeChart !== null) {
      this._moneyChart = null;
      this._typeChart = null;
      this._timeChart = null;
    }

    const moneyCtx = this.getElement().querySelector('#money');
    const typeCtx = this.getElement().querySelector('#type');
    const timeCtx = this.getElement().querySelector('#time-spend');

    moneyCtx.height = BAR_HEIGHT * 7;
    typeCtx.height = BAR_HEIGHT * 7;
    timeCtx.height = BAR_HEIGHT * 7;

    this._moneyChart = renderMoneyGraph(moneyCtx, this._data);
    this._typeChart = renderTypeGraph(typeCtx, this._data);
    this._timeChart = renderTimeGraph(timeCtx, this._data);
  }
}
