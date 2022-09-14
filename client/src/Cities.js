import React, { useEffect, useState } from 'react'
import City from './City'
function Cities() {

  const [cities, setCities] = useState([])
  const url = "http://localhost:5000/cities_from_json_file"
  useEffect(() => {
    fetch(url)
      .then((resp) => { console.log(resp); return resp.json() })
      .then((jsonedResp) => { setCities(jsonedResp)})
  }, [])

  return (
    <>
      Cities Component
      <hr />
      {
        cities.map((aCity) => {
            console.log(cities);
            return <City aCity={aCity} />
        })
      }
    </>
  )
}

export default Cities