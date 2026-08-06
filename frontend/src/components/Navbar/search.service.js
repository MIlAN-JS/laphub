import axios from "axios"

// Temporary placeholder API until the real search endpoint exists.
const DUMMY_SEARCH_URL = "https://dummyjson.com/products/search"

const searchProducts = async (query, signal) => {
  const response = await axios.get(DUMMY_SEARCH_URL, {
    params: { q: query, limit: 6 },
    signal,
  })

  return response.data.products
}

export { searchProducts }
