import  React, { Fragment, useState } from 'react';
import GiasFilterSet from '../FormControls/GiasFilterSet';

const GiasFilterBox = props => {
  const filterId = `option-select-${props.id.toLowerCase().replace(' ', '-')}`;

  const [filterExpanded, setFilterExpanded] = useState(props.startExpanded);

  const setFilterExpandedHandler = (event) => {
    event.preventDefault();
    setFilterExpanded(!filterExpanded);
  }

  return (
    <div className={`govuk-option-select  js-collapsible ${filterExpanded ? '' : 'js-closed'}`} id={filterId}>
      <button className="js-container-head" aria-expanded={filterExpanded}
              aria-controls={filterId} onClick={setFilterExpandedHandler}>
        <div className="option-select-label">{props.id}</div>
        <div className="js-selected-counter">
          <span className="js-selected-counter-text"></span>
        </div>
      </button>
      { props.searchWithin &&
      <div className="search-field-wrap">
        <label className="filter-searchwithin-label">
          <span className="govuk-visually-hidden">{`Search within ${props.id} filter`}</span>
          <input type="text" className="filter-search govuk-input" />
            <button className="field-clear hidden">
              <span className="govuk-visually-hidden">Clear</span></button>
        </label>
      </div>
        }
      <div className="options-container">
        <div className="gias-filter-checkboxes govuk-checkboxes">
          {
            props.items.map((filterParent) => {
              return (
                <Fragment key={`parent_${props.Name}_${filterParent.Id}`}>
                  <GiasFilterSet
                    Id={filterParent.Id}
                    name={props.name}
                    label={filterParent.Name}
                    childItems={filterParent.ChildItems}
                    isLoading={props.isLoading} />

                </Fragment>);
            })
          }

        </div>
      </div>
    </div>);
}

export default GiasFilterBox;
