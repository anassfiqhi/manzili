import { getCollectionsWithProducts } from "@lib/data/collections"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const countryCode = searchParams.get("countryCode")

    if (!countryCode) {
      return NextResponse.json(
        { error: "Country code is required" },
        { status: 400 }
      )
    }

    const collections = await getCollectionsWithProducts(countryCode)

    return NextResponse.json({ collections })
  } catch (error) {
    console.error("Error fetching collections:", error)
    return NextResponse.json(
      { error: "Failed to fetch collections" },
      { status: 500 }
    )
  }
}