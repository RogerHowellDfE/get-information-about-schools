import React, {Fragment, useContext, useState, useEffect} from "react";
import EstablishmentSearchContext from '../gias-store/establishment-search-context';

let isInitial = true;

const SearchResultsHeader = (props) => {
  const ctx = useContext(EstablishmentSearchContext);

  const [searchType, setSearchType] = useState(ctx.filterState.searchType);
  const [searchText, setSearchText] = useState(ctx.filterState.locationName);

  useEffect(() => {
    if (isInitial) {
      isInitial = false;
    } else {
      setSearchType(ctx.filterState.searchType);
    }

  }, [ctx.filterState.searchType])

  const locationOnChangeHandler = () => {
    // TODO - suggestions component
    // keep the warnings out the console for now
    return true;
  };

  return (
    <Fragment>
      {(searchType === 'Location') &&
      <Fragment>
        <div className="govuk-grid-column-one-third">
          <div className="govuk-form-group">
            <label className="govuk-label">Location</label>
            <input className="govuk-input govuk-input--width-10"
                   value={searchText} onChange={locationOnChangeHandler}/>
            <div className="govuk-body govuk-!-font-size-14">^^ not working yet, but saved searches coordinates are working</div>
          </div>
        </div>
        <div className="govuk-grid-column-one-third">
          <div className="govuk-form-group">
          <label className="govuk-label">Sort by</label>
          <select className="govuk-select" name="z" id="sortby-selector">
            <option id="distance" value="d">Distance</option>
            <option id="alpha-az" value="a">Alphabetical A-Z</option>
            <option id="alpha-za" value="z">Alphabetical Z-A</option>
          </select>
        </div>
        </div>
        <div className="govuk-grid-column-one-third">
          <div className="govuk-form-group">
            <label className="govuk-label">Within radius of: </label>
            <input type="text" id="RadiusInMiles" name="aa" value="3" className="govuk-input govuk-input--width-5"
                   maxLength="5"/>
            <button className="govuk-button">GO</button>
          </div>
        </div>
        <div className="govuk-grid-column-full">
           <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible" />
        </div>
      </Fragment>
      }
    </Fragment>
  )
};

export default SearchResultsHeader;
