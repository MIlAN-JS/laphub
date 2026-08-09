import api from "../../app/app.api.js"

const searchProducts = async (query, signal) => {
  const response = await api.get("/laptop/search", {
    params: { q: query, limit: 6 },
    signal,
  })

  return response.data.data.laptops.map((laptop) => ({
    id: laptop._id,
    title: laptop.title,
    thumbnail: laptop.thumbnail,
  }))
}

export { searchProducts }
