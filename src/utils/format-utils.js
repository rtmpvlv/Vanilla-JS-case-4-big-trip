const setFormat = (time) => {
  if (time <= 10 && time >= 0) {
    return `0${time}`;
  }
  return time;
};

const convertDuration = (minutes) => {
  const mins = minutes % 60;
  const hours = Math.floor(minutes / 60) % 24;
  const days = Math.floor(minutes / 1440);

  if (days >= 1) {
    return `${setFormat(days)}d ${setFormat(hours)}h ${setFormat(mins)}m`;
  }
  if (hours >= 1) {
    return `${setFormat(hours)}h ${setFormat(mins)}m`;
  }
  return `${setFormat(mins)}m`;
};

export default convertDuration;
