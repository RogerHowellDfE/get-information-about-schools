import Awesomplete from 'awesomplete';
import React, {useState} from 'react';


const GiasSearchWithin = props =>{

  return (
    <label className="filter-searchwithin-label">
      <span className="govuk-visually-hidden">{`Search within ${props.id} filter`}</span>
      <input type="text" className="filter-search govuk-input" />
      <button className="field-clear hidden">
        <span className="govuk-visually-hidden">Clear</span></button>
    </label>
  )
};

export default GiasSearchWithin;
