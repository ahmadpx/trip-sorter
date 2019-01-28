import { getTripDuration, getTripPrice } from "../utils/trip.utils";
import _get from "lodash/get";
import _uniqBy from "lodash/uniqBy";
import PropTypes from "prop-types";
import { legType } from "./leg.model";

export default class TripModel {
  constructor(legs = []) {
    this.totalDuration = getTripDuration(legs);
    this.totalPrice = getTripPrice(legs);
    this.origin = _get(legs, "0.departure", "");
    this.destination = _get(legs, `${legs.length - 1}.arrival`, "");
    this.legs = legs;
  }
}

export const tripType = PropTypes.shape({
  totalDuration: PropTypes.shape({
    hours: PropTypes.number.isRequired,
    minutes: PropTypes.number.isRequired
  }).isRequired,
  totalPrice: PropTypes.shape({
    base: PropTypes.number.isRequired,
    final: PropTypes.number.isRequired
  }).isRequired,
  origin: PropTypes.string.isRequired,
  destination: PropTypes.string.isRequired,
  legs: PropTypes.arrayOf(legType).isRequired
});
