import React , { useState, useEffect, useContext } from 'react';
import GiasFilterBox from '../GiasReactComponents/SearchFiltersUI/GiasFilterBox';
import SaveFilterSet from '../GiasReactComponents/SearchFiltersUI/SaveFilterSet';
import EstablishmentSearchContext from "../gias-store/establishment-search-context";
const saveFiltersConfig = {
  initialValue: 'open',
  name: 'filter-set',
  items: [
    {
      id: 'filter-set-all',
      value: 'all',
      label: 'All establishments'
    },
    {
      id: 'filter-set-open',
      value: 'open',
      label: 'Open establishments'
    },
    {
      id: 'filter-set-custom',
      value: 'custom',
      label: 'Custom set (choose filters below)'
    },
    {
      id: 'filter-set-saved',
      value: 'saved',
      label: ' My saved filter set'
    },
  ]
};


const EstablishmentSearchFilters = (props) => {
  const filters = window.filterConfig.slice(0);

  const initialFilters = filters.filter(filter => {
    return filter.initialFilter;
  });


  const [visibleFilters, setVisibleFilters] = useState(initialFilters);

  const [isLoggedIn, setIsLoggedIn] = useState(window.isLoggedIn);

  const ctx = useContext(EstablishmentSearchContext);


  return (
    <React.Fragment>
      {isLoggedIn &&
      <SaveFilterSet
        items={saveFiltersConfig.items}
        name={saveFiltersConfig.name}
        initialValue={saveFiltersConfig.initialValue}
        isLoading={ctx.isLoading} />
      }

      {visibleFilters.map(config => (
        <GiasFilterBox key={config.id.replace(' ', '_')}
          name={config.name}
          id={config.id}
          items={config.items}
          startExpanded={config.startExpanded}
          isLoading={ctx.isLoading} />
      ))}
    </React.Fragment>
  )
};


export default EstablishmentSearchFilters;
