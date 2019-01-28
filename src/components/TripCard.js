import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { tripType } from "../models/trip.model";
import Leg from "./Leg";

const Wrapper = styled.div`
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.1);
  background: white;
  padding: 10px;
  width: 100%;
  margin-bottom: 5px;
`;
const TripTotal = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 10px 10px;
`;
const TotalLabel = styled.div`
  font-weight: bold;
`;
const TotalDuration = styled.div``;
const TotalPrice = styled.div`
  font-weight: bold;
`;

function TripCard({ trip, currency }) {
  return (
    <Wrapper>
      {trip.legs.length > 0 &&
        trip.legs.map(leg => (
          <Leg key={leg.reference} leg={leg} currency={currency} />
        ))}

      <TripTotal>
        <TotalLabel>Total</TotalLabel>
        <TotalDuration>
          {trip.totalDuration.hours}h{trip.totalDuration.minutes}m
        </TotalDuration>
        <TotalPrice>
          {trip.totalPrice.final} {currency}
        </TotalPrice>
      </TripTotal>
    </Wrapper>
  );
}

TripCard.propTypes = {
  trip: tripType.isRequired,
  currency: PropTypes.string.isRequired
};

export default TripCard;
