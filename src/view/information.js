import dayjs from 'dayjs';

const renderTripPoints = (array) => {
  const uniquePoint = new Set(array.map(({ destination }) => destination.name));
  return Array.from(uniquePoint).join('&nbsp;&mdash;&nbsp;');
};

const renderDataInformation = ((array) => `${dayjs(array[0].dateFrom).format('DD MMM')}&nbsp;&mdash;&nbsp;${dayjs(array[array.length - 1].dateTo).format('DD MMM')}`);

const createTripInformationTemplate = (points) => (`
    <section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
      <h1 class="trip-info__title">${renderTripPoints(points)}</h1>
        <p class="trip-info__dates">${renderDataInformation(points)}</p>
      </div>
    </section>`
);

export default createTripInformationTemplate;
