describe("Test Setup", () => {
  it("should run basic test", () => {
    expect(true).toBe(true)
  })

  it("should have TextEncoder available", () => {
    expect(TextEncoder).toBeDefined()
    expect(TextDecoder).toBeDefined()
  })

  it("should have Response available", () => {
    expect(global.Response).toBeDefined()
    expect(global.Response.json).toBeDefined()
  })
})
