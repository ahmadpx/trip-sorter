import TripModel from "../models/trip.model";
import { CHEAPEST } from "../constants";

/**
 * @description get total trip duration
 * @param {Array<Object>} legs
 * @return {{hours: number, minutes: number}} total trip duration
 */
export function getTripDuration(legs) {
  return legs.reduce(
    ({ hours, minutes }, { duration }) => {
      const totalMinutes = minutes + Number(duration.m);
      return {
        hours: hours + Number(duration.h) + Math.floor(totalMinutes / 60),
        minutes: totalMinutes % 60
      };
    },
    { hours: 0, minutes: 0 }
  );
}

/**
 * @description get total trip price
 * @param {Array<Object>} legs
 * @return {{base: Number, final: Number}} total price
 */
export function getTripPrice(legs) {
  return legs.reduce(
    (totalPrice, { basePrice, finalPrice }) => {
      return {
        base: totalPrice.base + basePrice,
        final: totalPrice.final + finalPrice
      };
    },
    { base: 0, final: 0 }
  );
}

/**
 * @description calculate final price
 * @param {number} base
 * @param {number} discount
 * @return {number} final price
 */
export function calculateFinalPrice(base, discount) {
  if (!discount) return base;
  return base - (base * discount) / 100;
}

/**
 * get unique departures and arrivals
 * @param {Array<object>} legs
 * @return {{departures: array, arrivals: array}}
 */
export function getCities(legs) {
  const { departures, arrivals } = legs.reduce(
    ({ departures, arrivals }, leg) => {
      !departures.includes(leg.departure) && departures.push(leg.departure);
      !arrivals.includes(leg.arrival) && arrivals.push(leg.arrival);

      return { departures, arrivals };
    },
    { departures: [], arrivals: [] }
  );

  return { departures, arrivals };
}

/**
 * construct trips graph
 * @param {Array<object>} legs
 * @return {Object}
 */
export function constructTripsGraph(legs) {
  return legs.reduce((tripsGraph, leg) => {
    tripsGraph[leg.departure] = legs
      .filter(({ departure }) => departure === leg.departure)
      .map(({ arrival, transport }) => `${transport}.${arrival}`);

    return tripsGraph;
  }, {});
}

/**
 * construct route array from string
 * @param {string} routeString
 * @param {object} tripsHashMap
 * @return {Array}
 */
export function constructRoute(routeString, tripsHashMap) {
  const stack = routeString.split("=>").reverse();
  const route = [];

  while (stack.length) {
    const last = stack.pop();
    if (stack.length) {
      const key = `${last.split(".").pop()}-${stack[stack.length - 1]
        .split(".")
        .reverse()
        .join(".")}`;

      route.push(tripsHashMap[key]);
    }
  }

  return route;
}

/**
 * construct trips hashMap
 * @param {Array<object>} legs
 * @return {Object}
 */
export function constructTripsHashMap(legs) {
  return legs.reduce((hashMap, leg) => {
    hashMap[`${leg.departure}-${leg.arrival}.${leg.transport}`] = leg;
    return hashMap;
  }, {});
}

/**
 * get trip routes
 * @param {string} origin
 * @param {string} destination
 * @param {Array<object>} legs
 * @param {string} sort
 * @return {Array<Object>} routes
 */
export function getTripRoutes({ origin, destination, legs, sort }) {
  const tripsGraph = constructTripsGraph(legs);
  const tripsHashMap = constructTripsHashMap(legs);
  const routesQueue = [origin];
  const routes = [];
  let cheapest = Infinity;
  let fastest = Infinity;

  while (routesQueue.length) {
    const route = routesQueue.shift();
    const currentCity = route
      .split("=>")
      .pop()
      .split(".")
      .pop();

    if (currentCity === destination) {
      const routeArr = constructRoute(route, tripsHashMap);
      const { final } = getTripPrice(routeArr);
      const { hours, minutes } = getTripDuration(routeArr);

      if (!routes.length) {
        routes.push(routeArr);
      } else {
        if (sort === CHEAPEST) {
          if (final < cheapest) {
            routes.pop();
            routes.push(routeArr);
            cheapest = final;
          }
        } else {
          if (hours * 60 + minutes < fastest) {
            routes.pop();
            routes.push(routeArr);
            fastest = hours * 60 + minutes;
          }
        }
      }
    }

    tripsGraph[currentCity].forEach(city => {
      if (!route.includes(city.split(".").pop())) {
        const possibleRouteStr = `${route}=>${city}`;
        const possibleRouteArr = constructRoute(possibleRouteStr, tripsHashMap);
        const { final } = getTripPrice(possibleRouteArr);
        const { hours, minutes } = getTripDuration(possibleRouteArr);

        if (sort === CHEAPEST) {
          if (final < cheapest) {
            routesQueue.push(possibleRouteStr);
          }
        } else {
          if (hours * 60 + minutes < fastest) {
            routesQueue.push(possibleRouteStr);
          }
        }
      }
    });
  }

  return routes;
}

/**
 * model trips
 * @param {Array<object>} routes
 * @return {Array<TripModel>} modeled trips
 */
export function modelTrips(routes) {
  return routes.map(legs => new TripModel(legs));
}

/**
 * search routes
 * @param {string} origin
 * @param {string} destination
 * @param {Array<object>} legs
 * @param {string} sort
 * @return {Array<TripModel>}
 */
export function searchRoutes({ origin, destination, legs, sort }) {
  return modelTrips(
    getTripRoutes({
      origin,
      destination,
      legs,
      sort
    })
  );
}
