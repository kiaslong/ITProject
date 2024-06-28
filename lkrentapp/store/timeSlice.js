import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

// Custom function to format date with day abbreviation
const formatDateWithDay = (date) => {
  const dayMap = {
    0: "CN",
    1: "T2",
    2: "T3",
    3: "T4",
    4: "T5",
    5: "T6",
    6: "T7",
  };
  const day = dayMap[moment(date).day()];
  return `${moment(date).format('HH:mm')} ${day}, ${moment(date).format('DD/MM')}`;
};

const roundToNext30Minutes = (time) => {
  const minutes = time.minute();
  if (minutes % 30 === 0) {
    return time;
  }
  const remainder = 30 - (minutes % 30);
  return time.add(remainder, 'minutes').startOf('minute');
};

const initialState = {
  time: `${formatDateWithDay(roundToNext30Minutes(moment()))} - ${formatDateWithDay(roundToNext30Minutes(moment().add(1, 'day')))}`,
};

const extractDates = (timeString) => {
  const [start, end] = timeString.split(' - ').map((time) => {
    const parts = time.split(' ');
    const dateString = parts.slice(0, -1).join(' ');
    return moment(dateString, 'HH:mm, DD/MM');
  });
  return { startDate: start, endDate: end };
};

const timeSlice = createSlice({
  name: 'time',
  initialState,
  reducers: {
    setTime(state, action) {
      state.time = action.payload;
    },
  },
});

export const { setTime } = timeSlice.actions;
export const getStartDate = (state) => extractDates(state.time).startDate;
export const getEndDate = (state) => extractDates(state.time).endDate;

export default timeSlice.reducer;
