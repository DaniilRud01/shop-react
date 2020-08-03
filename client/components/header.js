import React from 'react'
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
// eslint-disable-next-line import/named
import { setBase } from '../redux/reducers/data'

const Header = () => {
  const selection = useSelector((s) => s.shop.selection)
  const quantity = Object.keys(selection).reduce((acc, rec) => acc + selection[rec], 0)
  const dispatch = useDispatch()
  return (
    <nav className="flex items-center justify-between flex-wrap bg-green-600 p-6">
      <div className="flex items-center justify-between flex-shrink-0 text-white mr-6">
        {['USD', 'EUR', 'CAD'].map((el) => (
          <button
            className="mr-3 bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded"
            key={el}
            type="button"
            onClick={() => dispatch(setBase(el))}
          >
            {el}
          </button>
        ))}
      </div>
      <div>
        <NavLink className="mr-2 text-white" to="/">
          Main
        </NavLink>
        <NavLink className="mr-2 text-white" to="/basket">
          Basket ({quantity})
        </NavLink>
        <NavLink className="text-white" to="/logs">
          Logs
        </NavLink>
      </div>
    </nav>
  )
}
export default Header
