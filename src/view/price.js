const calcTotalPrice = (array) => {
  let price = 0;
  array.forEach((element) => {
    price += element.basePrice;
  });
  return price;
};

const createTripPriceTemplate = (points) => (
  `
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${calcTotalPrice(points)}</span>
      </p>
  `
);

export default createTripPriceTemplate;
