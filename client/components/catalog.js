import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addToSelection, getSort, removeFromSelection } from '../redux/reducers/data'

const Catalog = () => {
  const catalog = useSelector((s) => s.shop.catalog)
  const rates = useSelector((s) => s.shop.rates)
  const selection = useSelector((s) => s.shop.selection)
  const base = useSelector((s) => s.shop.base)
  const dispatch = useDispatch()
  const currency = {
    EUR: '€',
    USD: '$',
    CAD: 'C$'
  }
  return (
    <div>
      <select onChange={(e) => dispatch(getSort(e.target.value))} id="sort" className="mb-3">
        <option value="">Type Sort</option>
        <option value="lowest">Lowest price</option>
        <option value="highest">Highest price</option>
      </select>
      <div className="flex flex-wrap -mx-3">
        {catalog.map((el) => (
          <div key={el.id} className="w-1/4 px-3 mb-3 text-center">
            <div className="border-2 border-gray-200">
              <img src={el.image} alt="" className="pt-3 inline-block" />
              <h2>{el.title}</h2>
              <p>
                {(el.price * (rates[base] || 1)).toFixed(2)} {currency[base]}
              </p>
              <div className="select-btn flex justify-center my-3">
                <button
                  type="button"
                  className="px-3 border-2 border-gray-300"
                  onClick={() => dispatch(removeFromSelection(el.id))}
                >
                  -
                </button>
                <span className="mx-4">{selection[el.id] || 0}</span>
                <button
                  type="button"
                  className="px-3 border-2 border-gray-300"
                  onClick={() => dispatch(addToSelection(el.id))}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default Catalog
