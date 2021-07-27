import React from "react";

const WaitSpinner = () => {
  return(
    <div aria-live="polite" className="gias-wait-mask gias-wait-mask--inline">
      <p className="govuk-visually-hidden">Please wait</p>
      <div className="lds-spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}

export default WaitSpinner;
