import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

const roundToNext30Minutes = (time) => {
  const minutes = time.minute();
  if (minutes % 30 === 0) {
    return time;
  }
  const remainder = 30 - (minutes % 30);
  return time.add(remainder, 'minutes').startOf('minute');
};


const initialState = {
  time: `${roundToNext30Minutes(moment()).format('HH:mm, DD/MM')} - ${roundToNext30Minutes(moment().add(1, 'day')).format('HH:mm, DD/MM')}`,
};

const extractDates = (timeString) => {
  const [start, end] = timeString.split(' - ').map((time) => moment(time, 'HH:mm, DD/MM'));
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
