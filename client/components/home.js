import React, { useEffect } from 'react'
import { Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Header from './header'
import Catalog from './catalog'
import { catalog, setRate } from '../redux/reducers/data'
import Basket from './basket'
import Logs from './logs'

const Home = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(catalog())
    dispatch(setRate())
  }, [])
  return (
    <div>
      <Header />
      <div className="container mx-auto py-6">
        <Route exact path="/" component={() => <Catalog />} />
        <Route exact path="/basket" component={() => <Basket />} />
        <Route exact path="/logs" component={() => <Logs />} />
      </div>
    </div>
  )
}

Home.propTypes = {}

export default Home
