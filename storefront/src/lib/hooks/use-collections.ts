import { useQuery } from "@tanstack/react-query"
import { HttpTypes } from "@medusajs/types"

function fetchCollections(countryCode: string): Promise<HttpTypes.StoreCollection[] | null> {
  return fetch(`/api/collections?countryCode=${countryCode}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch collections")
      }
      return response.json()
    })
    .then(data => data.collections)
}

export function useCollections(countryCode: string) {
  return useQuery({
    queryKey: ["collections", countryCode],
    queryFn: () => fetchCollections(countryCode),
    enabled: !!countryCode,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}