import React, { Fragment, useContext } from "react";

import EstablishmentSearchContext from '../gias-store/establishment-search-context';
import EstablishmentTile from '../GiasReactComponents/UI/SearchResults/EstablishmentTile';
import NoResultsMessage from './NoResultsMessage';
import WaitSpinner from "../GiasReactComponents/UI/SearchResults/WaitSpinner";
const EstablishmentSearchResults = (props) => {

  const ctx = useContext(EstablishmentSearchContext);

  return (
    <Fragment>
    <ul className="school-results-listing">
      {(ctx.results != null && !ctx.isLoading) && ctx.results.map(res => (
        <EstablishmentTile
            key={res.urn}
            establishmentName={res.name}
            address={res.fullAddress}
            establishmentStatus={res.statusLabel}
            phase={res.phaseLabel}
            establishmentType={res.typeLabel}
            localAuthority={res.laName}
            urn={res.urn}
            laestab={res.laEstabValue}
            distance={ res.distance || null }
        />

      ))}

    </ul>
      {(ctx.results === null || ctx.results?.length === 0) &&
      <NoResultsMessage/>
      }
      {ctx.isLoading &&
        <WaitSpinner />
      }
    </Fragment>
  )
};

export default EstablishmentSearchResults;
