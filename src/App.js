import React, { Component } from "react";
import styled from "styled-components";
import SearchForm from "./components/SearchForm";
import TripCard from "./components/TripCard";
import { CHEAPEST } from "./constants";
import response from "./db/response";
import { searchRoutes, getCities } from "./utils/trip.utils";
import LegModel from "./models/leg.model";
import ResetIcon from "./icons/ResetIcon";

const Wrapper = styled.div`
  width: 450px;
  margin: 50px auto;

  &,
  & * {
    box-sizing: border-box;
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  color: #333;
  text-align: center;
  font-weight: lighter;
`;

const Notification = styled.p`
  text-align: center;
`;

const ResetButton = styled.button`
  cursor: pointer;
  width: 100%;
  font-size: 16px;
  padding: 10px 0;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    margin-right: 5px;
  }
`;

class App extends Component {
  state = {
    origin: "",
    destination: "",
    currency: "",
    activeSort: CHEAPEST,
    deals: [],
    trips: [],
    departures: [],
    arrivals: [],
    showResults: false,
    noResults: false,
    showNote: false
  };

  componentDidMount() {
    // here it would be the actual ajax request to fetch trips
    const deals = response.deals.map(leg => new LegModel(leg));
    const { departures, arrivals } = getCities(deals);
    this.setState({
      deals,
      currency: response.currency,
      departures,
      arrivals
    });
  }

  /**
   * handle sort
   * @param activeSort
   */
  handleSort = activeSort => e => {
    e.preventDefault();
    this.setState({ activeSort });
  };

  /**
   * handle location change
   * @param location
   */
  handleLocationChange = location => e => {
    this.setState({ [location]: e.target.value });
  };

  /**
   * reset results
   */
  reset = () => {
    this.setState({
      origin: "",
      destination: "",
      trips: [],
      showResults: false
    });
  };

  /**
   * handle search
   * @param {Event} e
   */
  handleSearch = e => {
    e.preventDefault();
    const { origin, destination, deals: legs, activeSort: sort } = this.state;

    if (!origin || !destination) {
      this.setState({ showResults: false, showNote: true });
      return;
    }

    const trips = searchRoutes({ origin, destination, legs, sort });
    this.setState({
      trips,
      showResults: true,
      showNote: false,
      noResults: !trips.length
    });
  };

  render() {
    const { state } = this;

    return (
      <Wrapper className="App">
        <Title>Trip Sorter</Title>

        <SearchForm
          activeSort={state.activeSort}
          origin={state.origin}
          destination={state.destination}
          onSearch={this.handleSearch}
          onSort={this.handleSort}
          onLocationChange={this.handleLocationChange}
          departures={state.departures}
          arrivals={state.arrivals}
        />

        {state.showResults &&
          state.trips.length &&
          state.trips.map((trip, index) => (
            <TripCard key={index} trip={trip} currency={state.currency} />
          ))}

        {state.noResults && <Notification>No results found</Notification>}

        {state.showNote && (
          <Notification>
            Please select origin and destination then search
          </Notification>
        )}

        {state.showResults && !state.noResults && (
          <ResetButton onClick={this.reset}>
            <ResetIcon size={15} /> Reset
          </ResetButton>
        )}
      </Wrapper>
    );
  }
}

export default App;
