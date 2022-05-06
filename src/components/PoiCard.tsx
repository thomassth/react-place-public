import React, { Fragment } from "react";
import { Checkbox } from '@fluentui/react';

//Sample: (id:0, name: 'Hong Kong', coord: {lat: 22.3, long: 114.18})


const PoiCard = (props: any) => {
  const poi = props.poi
  const key = props.poi.key
  return (
    <Fragment>
      <div className="col-sm-6 col-md-4 country-card"
        onClick={() => {
          props.onCrdChanged(poi.geometry.coordinates)
        }}
      >
        <div className="country-card-container border-gray rounded border mx-2 my-3 d-flex flex-row align-items-center p-0 bg-light">
          <Checkbox
            id={`poi-checkbox-${key}`}
            onChange={(event: any) => {
              if (event.target.checked) {
                props.changeSelectedBox(key, 'add')
              } else {
                props.changeSelectedBox(key, 'minus')

              }
            }}
          />
          <div className="px-3">
            <span className="country-name text-dark d-block font-weight-bold">
              {poi.properties.name}
            </span>
            <span className="coord">
              {poi.geometry.coordinates}
            </span>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default PoiCard;
