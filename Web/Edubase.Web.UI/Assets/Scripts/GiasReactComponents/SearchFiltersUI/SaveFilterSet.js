import React, {useContext, useEffect, useState} from 'react';
import axios from "axios";
import GiasFilterRadio from "../FormControls/GiasFilterRadio";
import EstablishmentSearchContext from "../../gias-store/establishment-search-context";
let isInitial = true;
let isIntialSave = true;

const SaveFilterSet = props => {
  const ctx = useContext(EstablishmentSearchContext);

  const [selected, setSelected] = useState(props.initialValue);
  const [savedToken, setSavedToken] = useState(window.savedToken);
  const [canSaveFilterSet, setCanSaveFilterSet] = useState(false);
  const [showingSaveMessage, setShowingSaveMessage] = useState(false);
  const [showingDeleteMessage, setShowingDeleteMessage] = useState(false);


  const radioChangeHandler = (e) => {
    const radioValue = e.target.value;
    setSelected(radioValue);
  };

  const updateSavedToken = async (tok) => {
    return await axios.post('/api/save-search-token', {token: tok});
  };

  const deleteFilterSetHandler = (e) => {
    e.preventDefault();
     setSavedToken('');
     isInitial = true;
     setSelected('custom');
  };

  const saveFilterSetHandler = (e) => {
    e.preventDefault();
    setSavedToken(ctx.token);
    isInitial = true;
    setSelected('custom');
  };

  useEffect(() => {
    if (isIntialSave) {
      isIntialSave = false;
    } else {
      updateSavedToken(savedToken).then(() => {
        let messageFlash;
        if (savedToken === null) {
          setShowingDeleteMessage(true);
          messageFlash = setTimeout(() => {
            setShowingDeleteMessage(false);
          }, 5000);

        } else {
          setShowingSaveMessage(true);
          messageFlash = setTimeout(() => {
            setShowingSaveMessage(false);
          }, 5000);
        }
      });
    }
  },[savedToken]);

  useEffect(() => {
    if (!isInitial) {
      setCanSaveFilterSet(false);

      switch (selected) {
        case 'all':
          ctx.resetFilters(false);
          break;
        case 'open':
          ctx.resetFilters(true);
          break;

        case 'custom':
          setCanSaveFilterSet(true);
          break;

        case 'saved':
          ctx.resultsFromToken(savedToken);
          break;
      }
    }
    isInitial = false;

  }, [selected])

  return (
    <div className="gias-savefiltersetoptions" id="save-filter-options">
      <div className="govuk-form-group">
        <fieldset className="govuk-fieldset">
          <div className="gias-savefiltersetoptions--header govuk-fieldset__legend govuk-fieldset__legend--s">
            Filter sets
          </div>
          <div className="gias-savefiltersetoptions--inner">
            <div className="govuk-radios govuk-radios--small">
              <GiasFilterRadio
                id='filter-set-all'
                value='all'
                label='All establishments'
                name='filter-set'
                checked={selected === 'all'}
                onChange={radioChangeHandler} />

              <GiasFilterRadio
                id='filter-set-open'
                value='open'
                label='Open establishments'
                name='filter-set'
                checked={selected === 'open'}
                onChange={radioChangeHandler} />

              <GiasFilterRadio
                id='filter-set-custom'
                value='custom'
                label='Custom set (choose filters below)'
                name='filter-set'
                checked={selected === 'custom'}
                onChange={radioChangeHandler} />

              <GiasFilterRadio
                id='filter-set-saved'
                value='saved'
                label='My saved filter set'
                name='filter-set'
                checked={selected === 'saved'}
                onChange={radioChangeHandler}
                disabled={savedToken === ''} />

            </div>
            <div className="gias-savefilterset--controls">
              <div className={`govuk-form-group gias-savefilterset--save-container ${selected === 'custom'  ? '': 'hidden' }`}
                   id="gias-filterset--save-container">
                <div className="gias-filter-save--alert__container">
                  <p className={`gias-filter-save--alert ${showingSaveMessage ? '': 'hidden'}`} aria-live="assertive">
                    Filter set saved
                  </p>
                </div>
                <div className="controls-container">
                  <button className="govuk-button govuk-button--secondary" onClick={saveFilterSetHandler}
                          id="gias-filterset--save-button" disabled={ctx.isLoading}>
                    Save filter set
                  </button>
                  <button className="gias-link-button" data-module="govuk-button" id="clear-filters">Clear all filters
                  </button>
                </div>
              </div>
              <div className={`govuk-form-group ${selected === 'saved'? '': 'hidden' }`}
                   id="gias-filterset--delete-container">
                <div className="gias-filter-save--alert__container">
                  <p className={`gias-filter-save--alert ${showingDeleteMessage ? '': 'hidden'}`} aria-live="assertive">
                    Filter set deleted
                  </p>
                </div>
                <button className="govuk-button govuk-button--secondary" onClick={deleteFilterSetHandler}
                        id="gias-filterset--delete-button" disabled={ctx.isLoading}>
                  Delete my saved filter set
                </button>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
    </div>)
};

export default SaveFilterSet;
