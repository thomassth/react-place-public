import React, { useEffect, useState } from 'react';

export function Clock(props: any) {
  const [time, setTime] = useState('');
  const offsetTest = props.timeOffset;

  useEffect(() => {

    function currentTime() {
      let date = new Date();
      let hh = date.getHours();
      let mm = date.getMinutes();
      let ss = date.getSeconds();
      let note = ''

      if (props.mapCenter.length !== 0) {
        hh = date.getHours() + Math.floor(date.getTimezoneOffset() / 60) + offsetTest[0];
        mm = date.getMinutes() + (date.getTimezoneOffset()) % 60 + offsetTest[1];
      }

      if (mm > 60) {
        hh += 1;
        mm -= 60;
      }
      if (mm < 0) {
        hh -= 1;
        mm += 60;
      }
      if (hh > 24) {
        hh -= 24;
        note = '(+1 day)'
      }
      if (hh < 0) {
        hh += 24;
        note = '(-1 day)'
      }


      const hhStr = (hh < 10) ? "0" + hh : hh;
      const mmStr = (mm < 10) ? "0" + mm : mm;
      const ssStr = (ss < 10) ? "0" + ss : ss;

      let time = hhStr + ":" + mmStr + ":" + ssStr + " " + note;

      setTime(time);
      setTimeout(function () { currentTime(); }, 1000);
    }
    currentTime();
  });
  return (
    <div>Current Time: {time}</div>
  );
}
