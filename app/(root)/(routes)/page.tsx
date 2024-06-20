"use client"
import React, { useState } from 'react';

import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';


export default function Home() {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs(new Date()));

  return(
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker defaultValue={dayjs(new Date())} value={value} onChange={(newValue) => setValue(newValue)} ampm={false} disablePast={true} views={['year', 'day', 'hours', 'minutes', 'seconds']} />
      </LocalizationProvider>
    </div>
  );
}
