import React from 'react';

const GiasFilterRadio = props => {
  return (
    <div className="govuk-radios__item" key={`radio_${props.id}`}>
      <input className="govuk-radios__input"
             id={props.id}
             name={props.name}
             type="radio"
             value={props.value}
             checked={props.checked}
             onChange={props.onChange}
             disabled={props.disabled} />
      <label className="govuk-label govuk-radios__label" htmlFor={props.id}>
        {props.label}
      </label>
    </div>
  )
};

export default GiasFilterRadio;
