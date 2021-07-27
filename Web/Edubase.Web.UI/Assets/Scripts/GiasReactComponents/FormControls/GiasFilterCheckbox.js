import React from 'react';

const GiasFilterCheckbox = props => {

  return (
    <div className="govuk-checkboxes__item" key={props.id}>
      <input name={props.name}
             value={props.value}
             id={props.id}
             className={`govuk-checkboxes__input js-filter-input trigger-result-update`}
             type="checkbox"
             checked={props.isChecked}
             onChange={props.onChange}
             disabled={props.isLoading} />

      <label htmlFor={props.id} className={`govuk-checkboxes__label govuk-label ${props.isPartialSelection? 'partial-selection': ''}`}>{props.label}</label>
      {
        ((!!props.childCount && props.childCount > 0) &&
         <button data-module="govuk-button" className={`child-option-toggle js-child-option-toggle ${props.expanded && 'open-children'}`}
                 aria-expanded={props.expanded} onClick={props.expandHandler}>
            <span className="govuk-visually-hidden">
                <span className="filter-action-state">{props.expanded ? 'hide' : 'show'}</span>
              {props.childCount} sub types of {props.label}</span>
          </button>)
      }
    </div>
  )
};

export default GiasFilterCheckbox;
