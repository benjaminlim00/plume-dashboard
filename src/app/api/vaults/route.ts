export async function GET() {
  try {
    const response = await fetch("https://app.nest.credit/api/vaults")

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return Response.json(data)
  } catch (error) {
    console.error("Error fetching vault data:", error)
    return Response.json(
      { error: "Failed to fetch vault data" },
      { status: 500 }
    )
  }
}
