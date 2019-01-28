import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { CHEAPEST, DESTINATION, FASTEST, ORIGIN } from "../constants";
import SearchIcon from "../icons/SearchIcon";

const Form = styled.form`
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.1);
  background: white;
  padding: 10px;
  width: 100%;
  margin-bottom: 40px;
`;
const InputsWrapper = styled.div`
  display: flex;
  flex: 1;
  margin-bottom: 10px;
`;
const inputStyles = css`
  flex: 1;
  border: 1px solid #ccc;
  line-height: 40px;
  padding: 0 15px;
  font-size: 1rem;
  margin-right: 5px;
  height: 40px;

  &:focus {
    border-color: cornflowerblue;
    box-shadow: none;
    outline: none;
  }
`;
const OriginSelect = styled.select`
  ${inputStyles};
`;
const DestinationSelect = styled.select`
  ${inputStyles};
  margin-right: 0;
`;
const SortsWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;
const sortButtonStyles = css`
  flex: 1;
  font-size: 0.8rem;
  font-weight: normal;
  border-radius: 4px;
  cursor: pointer;
  transition: 0.3s;
  box-shadow: 2px 2px 0 0 rgba(0, 0, 0, 0.1);
  background: #efefef;
  color: black;
  padding: 8px 0;

  &:hover {
    outline: none;
    box-shadow: none;
  }

  &:active {
    transform: scale(0.98);
    outline: none;
    box-shadow: none;
  }

  ${({ active }) =>
    active &&
    css`
      font-weight: bold;
      background: cornflowerblue;
      color: white;

      &:hover {
        background: deepskyblue;
      }
    `};
`;
const Cheapest = styled.button`
  ${sortButtonStyles};
  margin-right: 5px;
`;
const Fastest = styled.button`
  ${sortButtonStyles}
`;
const SortLabel = styled.p`
  font-size: 1rem;
  font-weight: lighter;
  line-height: 1.4;
  padding: 0;
  margin: 0 20px 0 0;
`;
const SearchBtn = styled.button`
  width: 100%;
  font-size: 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  transition: 0.3s;
  box-shadow: 2px 2px 0 0 rgba(0, 0, 0, 0.1);
  background: forestgreen;
  padding: 12px 0;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    margin-right: 5px;
  }

  &:hover {
    background: green;
    outline: none;
    box-shadow: none;
  }

  &:active {
    transform: scale(0.95);
    outline: none;
    box-shadow: none;
  }
`;

function SearchForm({
  activeSort,
  origin,
  destination,
  onSearch,
  onSort,
  onLocationChange,
  departures,
  arrivals
}) {
  return (
    <Form>
      <InputsWrapper>
        <OriginSelect onChange={onLocationChange(ORIGIN)} value={origin}>
          <option value="">Origin</option>
          {departures.length > 0 &&
            departures
              .filter(departure => departure !== destination)
              .map(departure => (
                <option key={departure} value={departure}>
                  {departure}
                </option>
              ))}
        </OriginSelect>
        <DestinationSelect
          onChange={onLocationChange(DESTINATION)}
          value={destination}
        >
          <option value="">Destination</option>
          {arrivals.length > 0 &&
            arrivals
              .filter(arrival => arrival !== origin)
              .map(arrival => (
                <option key={arrival} value={arrival}>
                  {arrival}
                </option>
              ))}
        </DestinationSelect>
      </InputsWrapper>

      <SortsWrapper>
        <SortLabel>Sort by:</SortLabel>
        <Cheapest onClick={onSort(CHEAPEST)} active={activeSort === CHEAPEST}>
          Cheapest
        </Cheapest>
        <Fastest onClick={onSort(FASTEST)} active={activeSort === FASTEST}>
          Fastest
        </Fastest>
      </SortsWrapper>

      <SearchBtn onClick={onSearch}>
        <SearchIcon size={18} />
        Search
      </SearchBtn>
    </Form>
  );
}

SearchForm.propTypes = {
  activeSort: PropTypes.string.isRequired,
  origin: PropTypes.string.isRequired,
  destination: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
  onSort: PropTypes.func.isRequired,
  onLocationChange: PropTypes.func.isRequired
};

export default SearchForm;
