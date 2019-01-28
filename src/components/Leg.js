import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { legType } from "../models/leg.model";
import TrainIcon from "../icons/TrainIcon";
import BusIcon from "../icons/BusIcon";
import CarIcon from "../icons/CarIcon";
import ResetIcon from "../icons/ResetIcon";
import SearchIcon from "../icons/SearchIcon";
import { TRANSPORT_TYPES } from "../constants";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;

  &:last-of-type {
    border-bottom: 0;
  }
`;
const TripInfo = styled.div``;
const TripPrice = styled.div``;
const TripMeta = styled.div`
  margin-top: 15px;
`;
const Transport = styled.span`
  text-transform: capitalize;
`;
const Duration = styled.span`
  font-weight: bold;
  font-size: 0.8rem;
  display: inline-block;
`;
const Reference = styled.span`
  font-weight: bold;
  font-size: 0.8rem;
  display: inline-block;
  margin-left: 5px;
`;
const Path = styled.div`
  display: flex;
  align-items: center;
`;

const TransportIcon = styled.div`
  position: relative;
  width: 80px;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    position: relative;
    z-index: 2;
  }

  &:after {
    position: absolute;
    content: "";
    display: block;
    height: 1px;
    width: 80%;
    border-top: 1px dashed gray;
    margin: 0 10px;
    left: 0;
    top: 70%;
    z-index: 1;
  }
`;

function Leg({ leg, currency }) {
  return (
    <Wrapper>
      <TripInfo>
        <Path>
          <span>{leg.departure}</span>
          <TransportIcon>
            {leg.transport === TRANSPORT_TYPES.CAR && <CarIcon />}
            {leg.transport === TRANSPORT_TYPES.BUS && <BusIcon />}
            {leg.transport === TRANSPORT_TYPES.TRAIN && <TrainIcon />}
          </TransportIcon>
          <span>{leg.arrival}</span>
        </Path>
        <TripMeta>
          <Transport>{leg.transport}</Transport>
          <Reference>{leg.reference}</Reference> for{" "}
          <Duration>
            {leg.duration.h}h{leg.duration.m}m
          </Duration>
        </TripMeta>
      </TripInfo>

      <TripPrice>
        {leg.finalPrice} {currency}
      </TripPrice>
    </Wrapper>
  );
}

Leg.propTypes = {
  leg: legType.isRequired,
  currency: PropTypes.string.isRequired
};

export default Leg;
