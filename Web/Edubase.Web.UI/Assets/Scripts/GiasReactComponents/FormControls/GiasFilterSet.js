import React, { useState, useEffect, useContext, Fragment } from 'react';
import GiasFilterCheckbox from '../FormControls/GiasFilterCheckbox';
import EstablishmentSearchContext from '../../gias-store/establishment-search-context';

// creates a set of nested checkboxes > where child items are toggleable
// eg in the filters academies > academy sub types
// a filterbox will contain multiple filtersets

const GiasFilterSet = props => {
  const ctx = useContext(EstablishmentSearchContext);
  const childCount = (props.childItems !== undefined) ? props.childItems.length : 0;

  const [expanded, setExpanded] = useState(false);
  const [selectionState, setSelectionState] = useState(ctx.filterState[props.name]);
  const [isPartialSelection, setPartialSelection] = useState(false);

  const [parentChecked, setParentChecked] = useState(false);

  // listens for changes in the the state
  // to check, uncheck and display the partial
  // status on the GROUP parent checkbox
  useEffect(() => {
    if (props.childItems) {
      const childValues = props.childItems.map(c => c.Id);
      const intersect = childValues.filter(v => ctx.filterState[props.name].includes(v));

      setParentChecked(intersect.length > 0);
      setPartialSelection(intersect.length > 0 && intersect.length < childCount);
    }
  },[selectionState, ctx.filterState[props.name]]);


  const expandHandler = (event) => {
    event.preventDefault();
    setExpanded(!expanded);
  }

  const parentChangeHandler = (e) => {
    console.log('checked: ', e.target.checked);
    if (props.childItems) {
      const childValues = props.childItems.map(c => c.Id);
      const currentSelection = [...ctx.filterState[props.name]];
      console.log(currentSelection);
      let updatedFilters;
      if (e.target.checked) {
        const deDuplicated = currentSelection.filter(f => childValues.indexOf(f) === -1);
        updatedFilters = childValues.concat(deDuplicated);

      } else {
        updatedFilters = currentSelection.filter((f) => childValues.indexOf(f) === -1);
      }
      console.log(updatedFilters);
      setSelectionState(updatedFilters);

      ctx.bulkChange(props.name, updatedFilters);
    } else {
      ctx.filterChange(props.name, props.value)
    }
  };

  const onChildChangeHandler = (event) => {
    const target = event.target;
    setSelectionStateHandler(+target.value, target.checked);
    ctx.filterChange(target.name, +target.value)
  }

  const setSelectionStateHandler = (selection, add) => {
    setSelectionState((prevSelections) => {
      if (add) {
        return [...prevSelections, +selection];
      }

      return [...prevSelections].filter(s => +selection !== s);
    });
  }


  return (
    <Fragment key={`parent_${props.name}_${props.Id}`}>
      <GiasFilterCheckbox
        id={`${props.name}_${props.Id}`} key={`${props.name}_${props.Id}`}
        value={childCount > 0 ? '' : props.Id}
        name={props.name}
        label={props.label}
        isPartialSelection={isPartialSelection}
        childCount={childCount}
        expandHandler={expandHandler}
        expanded={expanded}
        isChecked={childCount > 0 ? parentChecked : ctx.filterState[props.name].indexOf(props.Id) > -1}
        onChange={childCount > 0 ? parentChangeHandler : onChildChangeHandler}
        isLoading={props.isLoading} />

      {!!childCount &&
      <div className={`filter-group ${!expanded && 'hidden'}`}>
        {props.childItems.map((child) => {
          return (
            <GiasFilterCheckbox
              id={`${props.name}_${props.Id}_${child.Id}`}
              key={`${props.name}_${props.Id}_${child.Id}`}
              value={child.Id}
              name={props.name}
              label={child.Name}
              isChecked={ctx.filterState[props.name].indexOf(child.Id) > -1}
              onChange={onChildChangeHandler}
              isLoading={props.isLoading} />
          )
        })}
      </div>
      }
    </Fragment>
  )
}

export default GiasFilterSet;
