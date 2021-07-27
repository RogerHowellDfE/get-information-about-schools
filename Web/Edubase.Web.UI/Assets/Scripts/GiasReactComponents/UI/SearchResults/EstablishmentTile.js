import React from 'react';


const EstablishmentTile = props => {

  // todo - include search params
  const establishmentHref = `/Establishments/Establishment/Details/${props.Urn}`;

  return (
    <li className="gias-result-tile">
      <h3 className="govuk-heading-s govuk-!-margin-bottom-1">
        <a href={establishmentHref}>{props.establishmentName}</a>
      </h3>
      {
        (props.establishmentStatus === "Closed") &&
        <p className="additional-closed">Closed</p>
      }

      <dl>
        <dt>Address:</dt>
        <dd>{props.address}</dd>
        <dt>Phase / type:</dt>
        <dd>
          {props.phase} {props.establishmentType}
        </dd>
        <dt><abbr title="Unique Reference Number">URN</abbr>:</dt>
        <dd>{props.urn}</dd>
        <dt className="inline-details">
          <abbr title="Local authority - Establishment number">LAESTAB</abbr>:
        </dt>
        <dd>{props.laestab}</dd>
        <dt>Status:</dt>
        <dd>{props.establishmentStatus}</dd>
        <dt>Local authority name:</dt>
        <dd>{props.localAuthority}</dd>
        {(props.distance  &&
          <div>
            <dt>Distance:</dt>
            <dd>{props.distance}</dd>
          </div>
          )
        }
      </dl>
    </li>
  )

}

export default EstablishmentTile;
