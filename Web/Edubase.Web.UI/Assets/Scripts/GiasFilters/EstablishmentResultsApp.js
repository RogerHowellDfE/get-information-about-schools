import React, { useState, useContext } from 'react';
import { EstablishmentSearchContextProvider } from '../gias-store/establishment-search-context';
import EstablishmentSearchFilters from './EstablishmentSearchFilters';
import EstablishmentSearchResults from './EstablishmentSearchResults';
import SearchResultsHeader from './SearchResultsHeader';


function EstablishmentResultsApp() {
//todo notification component

  return (
    <EstablishmentSearchContextProvider>
      <SearchResultsHeader />
      <div className="govuk-grid-column-one-third">
        <div className="search-result-filters">
          <EstablishmentSearchFilters />
        </div>
      </div>
      <div className="govuk-grid-column-two-thirds">
        <EstablishmentSearchResults  />
      </div>
    </EstablishmentSearchContextProvider>
  )
}

export default EstablishmentResultsApp;
