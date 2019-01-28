import response from "../db/response";
import LegModel from "./leg.model";

describe("LegModel", () => {
  describe("model parsing test", () => {
    const leg = new LegModel(response.deals[0]);
    it("should test the `reference` key to be parsed right from the response", function() {
      expect(leg.reference).toBe(response.deals[0].reference);
    });
    it("should test the `transport` key to be parsed right from the response", function() {
      expect(leg.transport).toBe(response.deals[0].transport);
    });
    it("should test the `departure` key to be parsed right from the response", function() {
      expect(leg.departure).toBe(response.deals[0].departure);
    });
    it("should test the `arrival` key to be parsed right from the response", function() {
      expect(leg.arrival).toBe(response.deals[0].arrival);
    });
    it("should test the `duration` key to be parsed right from the response", function() {
      expect(leg.duration).toEqual(response.deals[0].duration);
    });
    it("should test the `basePrice` key to be parsed right from the response", function() {
      expect(leg.basePrice).toBe(response.deals[0].cost);
    });
    it("should test the `discount` key to be parsed right from the response", function() {
      expect(leg.discount).toBe(response.deals[0].discount);
    });
  });
});
