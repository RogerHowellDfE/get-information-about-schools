import React, { useState, useEffect } from 'react';
import { getEstablishmentResults, getResultsWithToken, serialize } from './helpers/establishment-search';
import QueryString from '../GiasHelpers/QueryString';
const filterSelections = {...initialFilterSelections};
let isInitial = true;


const EstablishmentSearchContext = React.createContext({
  filterState: {},
  filterChange: (filterKey, filterValue) => {},
  bulkChange: (filterKey, filterValues) => {},
  resetFilters: (openOnly) => {},
  resultsFromToken: (tok) => {},
  token: '',
  results: [],
  count: 0,
  currentPageIndex: 0,
});


export const EstablishmentSearchContextProvider = (props) => {
  const [filterState, setFilterState] = useState(filterSelections);
  const [results, setResults] = useState([...initialResults]);
  const [token, setToken] = useState(QueryString('tok'));
  const [resultCount, setResultCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);


  // code to run on filter state change
  useEffect(() => {
    if (isInitial) {
      isInitial = false;
    } else {
      const filterIntent = setTimeout(() => {
        (async () => {
          setIsLoading(true);
          window.scrollTo(0, 0);
          const params = await serialize(filterState);
          const response = await getEstablishmentResults(params);

          setResults(JSON.parse(response.data).results);
          setToken(response.token);
          setResultCount(response.count);
          setIsLoading(false);
        })();
      }, 1500);

      return () => {
        clearTimeout(filterIntent);
      }
    }
  }, [filterState]);

  useEffect(() => {
    history.pushState({}, null, window.location.href.split('?')[0] + '?tok=' + token);
  },[token]);


  const filterChangeHandler = (filterKey, filterValue) => {
    setFilterState(prevState => {
      const pendingState = {...prevState};

      if (pendingState[filterKey].indexOf(filterValue) === -1) {
        pendingState[filterKey].push(filterValue);
      } else {
        const currentValues = pendingState[filterKey];
        pendingState[filterKey] = currentValues.filter(item => {
          return item !== filterValue;
        });
      }

      return pendingState;
    });
  }

  const bulkFilterChangeHandler = (filterKey, filterValues) => {
    setFilterState(prevState => {
      const pendingState = {...prevState};
      pendingState[filterKey] = filterValues;
      return pendingState;
    });
  }

  const resetFilterState = (openOnly) => {
      setFilterState(prevState => {
        const pendingState = {...prevState }
        for (const key in pendingState) {
          if (pendingState.hasOwnProperty(key) && Array.isArray(pendingState[key])){
            pendingState[key] = [];
          }
        }
        if (openOnly) {
          pendingState.b = [1, 4];
        }

        pendingState.searchType = 'EstablishmentAll';
        return pendingState;
      });
  };

  const resultsFromToken = async (tok) => {
    setIsLoading(true);
    // avoid an additional request by 'pausing' the filter change listener
    // as we are about to set the filters manually
    isInitial = true;

    const response = await getResultsWithToken(tok);
    const res = JSON.parse(response.data);
    setResults(res.results);
    setFilterState(res.filters);
    setToken(response.token);
    setResultCount(response.count);
    setIsLoading(false);
  };

  return (
    <EstablishmentSearchContext.Provider value={{
      filterState: filterState,
      filterChange: filterChangeHandler,
      bulkChange: bulkFilterChangeHandler,
      resetFilters: resetFilterState,
      resultsFromToken: resultsFromToken,
      token: token,
      results: results,
      count: resultCount,
      currentPageIndex: 0,
      isLoading: isLoading,
    }}>
      {props.children}
    </EstablishmentSearchContext.Provider>
  )
};


export default EstablishmentSearchContext;
