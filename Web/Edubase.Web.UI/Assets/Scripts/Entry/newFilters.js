import React from "react";
import ReactDom from "react-dom";

import GiasFilterBox from '../GiasReactComponents/SearchFiltersUI/GiasFilterBox';
import SaveFilterSet from '../GiasReactComponents/SearchFiltersUI/SaveFilterSet';

const target = document.getElementById('test');
const target1 = document.getElementById('test2');
const target2 = document.getElementById('test3');
const target3 = document.getElementById('test4');
const target4 = document.getElementById('test5');


const filterConfig = [...window.filterConfig];
const estabTypeConfig = filterConfig.filter((config) => {
  return config.id === 'Establishment type'
})[0];


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

const prepareResults = () => {
  [... window.initialResults].map((estab) => {
    return {
      establishmentName: estab.Name,
      establishmentStatus: estab
    }
  })
};
estabTypeConfig.startExpanded = true;
const establishmentTypeFilter = <GiasFilterBox id={estabTypeConfig.id}
                                               name={estabTypeConfig.name}
                                               items={estabTypeConfig.items}
                                               selectedItems={estabTypeConfig.selectedItems}
                                               startExpanded={true} />
console.log(estabTypeConfig);


const statusFilterConfig = filterConfig.filter((config) => {
  return config.id === 'Status'
})[0];

statusFilterConfig.startExpanded = true;
console.log(statusFilterConfig);
const establishmentStatusFilter = <GiasFilterBox id={statusFilterConfig.id}
                                                 name={statusFilterConfig.name}
                                                 items={statusFilterConfig.items}
                                                 selectedItems={statusFilterConfig.selectedItems}
                                                 startExpanded={true} />

const phasesFilterConfig = filterConfig.filter((config) => {
  return config.id === 'Phase of education';
})[0];
console.log(phasesFilterConfig);
const phaseFilter = <GiasFilterBox id={phasesFilterConfig.id}
                                   name={phasesFilterConfig.name}
                                   items={phasesFilterConfig.items}
                                   selectedItems={phasesFilterConfig.selectedItems}
                                   startExpanded={false} />

const laConfig = filterConfig.filter((config) => {
  return config.id === 'Local authority';
})[0];
console.log(laConfig);
const laFilter = <GiasFilterBox id={laConfig.id}
                                name={laConfig.name}
                                items={laConfig.items}
                                selectedItems={laConfig.selectedItems}
                                startExpanded={false}
                                searchWithin={true}/>

const relConfig = filterConfig.filter((config)=>{
  return config.id === 'Religious character';
})[0];
console.log(relConfig);

const relFilter = <GiasFilterBox id={relConfig.id}
                                 name={relConfig.name}
                                 items={relConfig.items}
                                 selectedItems={relConfig.selectedItems}
                                 startExpanded={false}/>

const SaveFilters = <SaveFilterSet items={saveFiltersConfig.items}
                                   name={saveFiltersConfig.name}
                                   initialValue={saveFiltersConfig.initialValue} />

ReactDom.render(SaveFilters, document.getElementById('test0'));

ReactDom.render(establishmentTypeFilter, target);
ReactDom.render(establishmentStatusFilter, target1);
ReactDom.render(phaseFilter, target2);
ReactDom.render(laFilter, target3);
ReactDom.render(relFilter, target4);
