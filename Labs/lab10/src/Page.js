import React from 'react'
import Pokemon from './Pokemon'

function page({ currentPokemons }) {
  return (
    <div>
      <div className="pokemon-list">
        {
          currentPokemons.map(item => {
            return <Pokemon pokemon={item} />
          })
        }
      </div>
    </div>
  )
}

export default page