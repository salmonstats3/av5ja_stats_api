import { ResultsMiddleware } from "@/results/results.middleware"

describe("ResultsMiddleware", () => {
  it("should be defined", () => {
    expect(new ResultsMiddleware()).toBeDefined()
  })
})
