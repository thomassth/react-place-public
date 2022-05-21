import React, { useEffect, useState } from 'react';

export function Timezone(props: { mapCenter: Array<number>; changeOffset: any }) {
  const mapCenter = props.mapCenter;
  const testString = props.mapCenter.length === 0 ? '' : `${props.mapCenter[0]}, ${props.mapCenter[1]}`;
  const [timeZoneName, setTimeZoneName] = useState('');
  const [lastReq, setLastreq] = useState(0)

  useEffect(() => {
    if (mapCenter.length === 2) {
      if (Date.now() - lastReq > 200) {
        setLastreq(Date.now())
        fetch(`https://dev.virtualearth.net/REST/v1/TimeZone/${mapCenter[1]},${mapCenter[0]}?key=${process.env.REACT_APP_BING_MAP_KEY}`, {})
          .then(response => response.json())
          .then(data => {
            setTimeZoneName(data.resourceSets[0].resources[0].timeZone.genericName);
            const offset = data.resourceSets[0].resources[0].timeZone.convertedTime.utcOffsetWithDst.split(':')
            props.changeOffset([parseInt(offset[0]), parseInt(offset[1])])
          });
      }

    }
  }, [mapCenter, lastReq, props]
  );
  if (mapCenter.length !== 2)
    return <div></div>;

  return (
    <div className='text'>
      Coordinates: {testString},
      time zone: {timeZoneName}
    </div>
  );
}
