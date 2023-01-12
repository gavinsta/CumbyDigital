import React from 'react';
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';
import { useColorMode } from '@chakra-ui/react';

import 'react-datepicker/dist/react-datepicker.css';
import '../../styling/date-picker.css';

function DatePicker(props: ReactDatePickerProps) {
  const {
    isClearable = false,
    showPopperArrow = false,
    ...rest
  } = props
  const isLight = useColorMode().colorMode === 'light';//you can check what theme you are using right now however you want
  //const years = Array(2000, new Date().getFullYear() + 1, 1);
  return (
    // if you don't want to use chakra's colors or you just wwant to use the original ones,
    // set className to "light-theme-original" ↓↓↓↓
    <div
      style={{ width: "300px" }}
      className={isLight ? "light-theme" : "dark-theme"}>
      <ReactDatePicker
        isClearable={isClearable}
        showPopperArrow={showPopperArrow}
        minDate={new Date()}

        className="react-datapicker__input-text"//input is white by default and there is no already defined class for it so I created a new one
        {...rest}
      />
    </div>
  );
};

export { DatePicker }