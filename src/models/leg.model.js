import _get from "lodash/get";
import { calculateFinalPrice } from "../utils/trip.utils";
import PropTypes from "prop-types";

export default class LegModel {
  constructor(leg) {
    this.reference = _get(leg, "reference", "");
    this.transport = _get(leg, "transport", "");
    this.departure = _get(leg, "departure", "");
    this.arrival = _get(leg, "arrival", "");
    this.duration = _get(leg, "duration", { h: 0, m: 0 });
    this.basePrice = _get(leg, "cost", 0);
    this.discount = _get(leg, "discount", 0);
    this.finalPrice = calculateFinalPrice(this.basePrice, this.discount);
  }
}

export const legType = PropTypes.shape({
  reference: PropTypes.string.isRequired,
  transport: PropTypes.string.isRequired,
  departure: PropTypes.string.isRequired,
  arrival: PropTypes.string.isRequired,
  duration: PropTypes.shape({
    h: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    m: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
  }).isRequired,
  basePrice: PropTypes.number.isRequired,
  discount: PropTypes.number.isRequired,
  finalPrice: PropTypes.number.isRequired
});
