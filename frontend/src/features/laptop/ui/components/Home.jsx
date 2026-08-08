import React from 'react'
import SelectByBrand from './SelectByBrand'
import SelectByCategory from './SelectByCategory'
import LaptopsOverview from './LaptopsOverview'

function Home() {
  return (
    <div>
      <SelectByBrand />
      <SelectByCategory />
      <LaptopsOverview />
    </div>
  )
}

export default Home
