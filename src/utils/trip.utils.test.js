import response from "../db/response";
import LegModel from "../models/leg.model";
import {
  calculateFinalPrice,
  getTripDuration,
  getTripPrice,
  getTripRoutes,
  getCities,
  constructTripsGraph,
  constructRoute,
  constructTripsHashMap,
  searchRoutes
} from "./trip.utils";
import { CHEAPEST, FASTEST } from "../constants";

describe("trip utils", () => {
  const legs = [
    {
      transport: "train",
      departure: "London",
      arrival: "Amsterdam",
      duration: { h: "05", m: "40" },
      cost: 160,
      discount: 0,
      reference: "TLA0500"
    },
    {
      transport: "train",
      departure: "Amsterdam",
      arrival: "Brussels",
      duration: { h: "05", m: "30" },
      cost: 160,
      discount: 0,
      reference: "TAB0530"
    }
  ].map(leg => new LegModel(leg));

  describe("getTripDuration", () => {
    it("should return total trip duration", function() {
      expect(getTripDuration(legs)).toEqual({ hours: 11, minutes: 10 });
    });
  });

  describe("getTripPrice", () => {
    it("should return total trip price", function() {
      expect(getTripPrice(legs)).toEqual({ base: 320, final: 320 });
    });
  });

  describe("calculateFinalPrice", () => {
    it("should return base price if discount is zero", function() {
      expect(calculateFinalPrice(100, 0)).toBe(100);
    });

    it("should return base price discounted if discount has value", function() {
      expect(calculateFinalPrice(100, 20)).toBe(80);
    });
  });

  describe("getCities", () => {
    it("should return unique departures and arrivals", function() {
      expect(getCities(response.deals.map(leg => new LegModel(leg)))).toEqual({
        arrivals: [
          "Amsterdam",
          "Paris",
          "Warsaw",
          "Brussels",
          "London",
          "Stockholm",
          "Prague",
          "Moscow",
          "Madrid",
          "Geneva",
          "Budapest",
          "Kiev",
          "Lisbon",
          "Rome",
          "Athens",
          "Istanbul"
        ],
        departures: [
          "London",
          "Amsterdam",
          "Warsaw",
          "Stockholm",
          "Paris",
          "Brussels",
          "Prague",
          "Moscow",
          "Madrid",
          "Geneva",
          "Budapest",
          "Kiev",
          "Lisbon",
          "Rome",
          "Athens",
          "Istanbul"
        ]
      });
    });
  });

  describe("constructTripsGraph", () => {
    it("should return trips graph", function() {
      expect(
        constructTripsGraph(response.deals.map(leg => new LegModel(leg)))
      ).toEqual({
        Amsterdam: [
          "train.Warsaw",
          "bus.Warsaw",
          "car.Warsaw",
          "train.Brussels",
          "bus.Brussels",
          "car.Brussels",
          "train.London",
          "bus.London",
          "car.London"
        ],
        Athens: [
          "train.Budapest",
          "bus.Budapest",
          "car.Budapest",
          "train.Istanbul",
          "bus.Istanbul",
          "car.Istanbul",
          "train.Rome",
          "bus.Rome",
          "car.Rome"
        ],
        Brussels: [
          "train.Amsterdam",
          "bus.Amsterdam",
          "car.Amsterdam",
          "train.Prague",
          "bus.Prague",
          "car.Prague",
          "train.Geneva",
          "bus.Geneva",
          "car.Geneva",
          "train.Paris",
          "bus.Paris",
          "car.Paris"
        ],
        Budapest: [
          "train.Prague",
          "bus.Prague",
          "car.Prague",
          "train.Kiev",
          "bus.Kiev",
          "car.Kiev",
          "train.Athens",
          "bus.Athens",
          "car.Athens",
          "train.Geneva",
          "bus.Geneva",
          "car.Geneva"
        ],
        Geneva: [
          "train.Brussels",
          "bus.Brussels",
          "car.Brussels",
          "train.Budapest",
          "bus.Budapest",
          "car.Budapest",
          "train.Rome",
          "bus.Rome",
          "car.Rome",
          "train.Madrid",
          "bus.Madrid",
          "car.Madrid"
        ],
        Istanbul: [
          "train.Kiev",
          "bus.Kiev",
          "car.Kiev",
          "train.Athens",
          "bus.Athens",
          "car.Athens"
        ],
        Kiev: [
          "train.Moscow",
          "bus.Moscow",
          "car.Moscow",
          "train.Istanbul",
          "bus.Istanbul",
          "car.Istanbul",
          "train.Budapest",
          "bus.Budapest",
          "car.Budapest"
        ],
        Lisbon: [
          "train.Madrid",
          "bus.Madrid",
          "car.Madrid",
          "train.Rome",
          "bus.Rome",
          "car.Rome"
        ],
        London: [
          "train.Amsterdam",
          "bus.Amsterdam",
          "car.Amsterdam",
          "train.Paris",
          "bus.Paris",
          "car.Paris"
        ],
        Madrid: [
          "train.Paris",
          "bus.Paris",
          "car.Paris",
          "train.Geneva",
          "bus.Geneva",
          "car.Geneva",
          "train.Lisbon",
          "bus.Lisbon",
          "car.Lisbon"
        ],
        Moscow: [
          "train.Stockholm",
          "bus.Stockholm",
          "car.Stockholm",
          "train.Kiev",
          "bus.Kiev",
          "car.Kiev",
          "train.Prague",
          "bus.Prague",
          "car.Prague"
        ],
        Paris: [
          "train.London",
          "bus.London",
          "car.London",
          "train.Brussels",
          "bus.Brussels",
          "car.Brussels",
          "train.Madrid",
          "bus.Madrid",
          "car.Madrid"
        ],
        Prague: [
          "train.Warsaw",
          "bus.Warsaw",
          "car.Warsaw",
          "train.Moscow",
          "bus.Moscow",
          "car.Moscow",
          "train.Budapest",
          "bus.Budapest",
          "car.Budapest",
          "train.Brussels",
          "bus.Brussels",
          "car.Brussels"
        ],
        Rome: [
          "train.Geneva",
          "bus.Geneva",
          "car.Geneva",
          "train.Athens",
          "bus.Athens",
          "car.Athens",
          "train.Lisbon",
          "bus.Lisbon",
          "car.Lisbon"
        ],
        Stockholm: [
          "train.Moscow",
          "bus.Moscow",
          "car.Moscow",
          "train.Warsaw",
          "bus.Warsaw",
          "car.Warsaw"
        ],
        Warsaw: [
          "train.Stockholm",
          "bus.Stockholm",
          "car.Stockholm",
          "train.Prague",
          "bus.Prague",
          "car.Prague",
          "train.Amsterdam",
          "bus.Amsterdam",
          "car.Amsterdam"
        ]
      });
    });
  });

  describe("constructRoute", () => {
    it("should construct route array from route string", function() {
      expect(
        constructRoute(
          "London=>bus.Paris=>bus.Brussels",
          constructTripsHashMap(response.deals.map(leg => new LegModel(leg)))
        )
      ).toEqual([
        {
          arrival: "Paris",
          basePrice: 40,
          departure: "London",
          discount: 50,
          duration: { h: "05", m: "30" },
          finalPrice: 20,
          reference: "BLP0530",
          transport: "bus"
        },
        {
          arrival: "Brussels",
          basePrice: 40,
          departure: "Paris",
          discount: 25,
          duration: { h: "06", m: "30" },
          finalPrice: 30,
          reference: "BPB0630",
          transport: "bus"
        }
      ]);
    });
  });

  describe("getTripRoutes", () => {
    describe("should return trip legs for a specific origin and destination", function() {
      const origin = "London";
      const destination = "Brussels";

      it("should sort by cheapest", function() {
        expect(
          getTripRoutes({
            origin,
            destination,
            legs: response.deals.map(leg => new LegModel(leg)),
            sort: CHEAPEST
          })
        ).toEqual([
          [
            {
              arrival: "Paris",
              basePrice: 40,
              departure: "London",
              discount: 50,
              duration: { h: "05", m: "30" },
              finalPrice: 20,
              reference: "BLP0530",
              transport: "bus"
            },
            {
              arrival: "Brussels",
              basePrice: 40,
              departure: "Paris",
              discount: 25,
              duration: { h: "06", m: "30" },
              finalPrice: 30,
              reference: "BPB0630",
              transport: "bus"
            }
          ]
        ]);
      });

      it("should sort by fastest", function() {
        expect(
          getTripRoutes({
            origin,
            destination,
            legs: response.deals.map(leg => new LegModel(leg)),
            sort: FASTEST
          })
        ).toEqual([
          [
            {
              arrival: "Amsterdam",
              basePrice: 120,
              departure: "London",
              discount: 0,
              duration: { h: "04", m: "45" },
              finalPrice: 120,
              reference: "CLA0445",
              transport: "car"
            },
            {
              arrival: "Brussels",
              basePrice: 120,
              departure: "Amsterdam",
              discount: 0,
              duration: { h: "04", m: "30" },
              finalPrice: 120,
              reference: "CAB0430",
              transport: "car"
            }
          ]
        ]);
      });
    });
  });

  describe("searchRoutes", () => {
    describe("should search for trip legs for a specific origin and destination", function() {
      const origin = "London";
      const destination = "Brussels";

      it("should sort by cheapest", function() {
        expect(
          searchRoutes({
            origin,
            destination,
            legs: response.deals.map(leg => new LegModel(leg)),
            sort: CHEAPEST
          })
        ).toEqual([
          {
            destination: "Brussels",
            legs: [
              {
                arrival: "Paris",
                basePrice: 40,
                departure: "London",
                discount: 50,
                duration: { h: "05", m: "30" },
                finalPrice: 20,
                reference: "BLP0530",
                transport: "bus"
              },
              {
                arrival: "Brussels",
                basePrice: 40,
                departure: "Paris",
                discount: 25,
                duration: { h: "06", m: "30" },
                finalPrice: 30,
                reference: "BPB0630",
                transport: "bus"
              }
            ],
            origin: "London",
            totalDuration: { hours: 12, minutes: 0 },
            totalPrice: { base: 80, final: 50 }
          }
        ]);
      });

      it("should sort by fastest", function() {
        expect(
          searchRoutes({
            origin,
            destination,
            legs: response.deals.map(leg => new LegModel(leg)),
            sort: FASTEST
          })
        ).toEqual([
          {
            destination: "Brussels",
            legs: [
              {
                arrival: "Amsterdam",
                basePrice: 120,
                departure: "London",
                discount: 0,
                duration: { h: "04", m: "45" },
                finalPrice: 120,
                reference: "CLA0445",
                transport: "car"
              },
              {
                arrival: "Brussels",
                basePrice: 120,
                departure: "Amsterdam",
                discount: 0,
                duration: { h: "04", m: "30" },
                finalPrice: 120,
                reference: "CAB0430",
                transport: "car"
              }
            ],
            origin: "London",
            totalDuration: { hours: 9, minutes: 15 },
            totalPrice: { base: 240, final: 240 }
          }
        ]);
      });
    });
  });
});
