import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {addToSelection, removeFromSelection} from '../redux/reducers/data'

const Basket = () => {
  const dispatch = useDispatch()
  const selection = useSelector((s) => s.shop.selection)
  const products = useSelector((s) => s.shop.catalog)
  const cart = products.filter((el) => Object.keys(selection).includes(el.id))
  const rates = useSelector((s) => s.shop.rates)
  const base = useSelector((s) => s.shop.base)
  const totalSum = Object.keys(selection)
    .reduce((acc, rec) => {
      return acc + products.find((el) => el.id === rec).price * selection[rec] * (rates[base] || 1)
    }, 0)
    .toFixed(2)
  const currency = {
    EUR: '€',
    USD: '$',
    CAD: 'C$'
  }
  return (
    <div>
      {cart.map((el) => (
        <div key={el.id} className="flex mb-3 w-full">
          <div className="w-1/2 m-auto">{el.title}</div>
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
      ))}
      <div className="text-right">
        {totalSum > 0 ? (
          <span>
            Total: {totalSum} {currency[base]}
          </span>
        ) : (
          <div>
            <span>Ваша корзина пуста</span>
            <img
              className="w-64 absolute right-0 bottom-0"
              src="https://i.ibb.co/rtjxG3M/pngegg.png"
              alt=""
            />
          </div>
        )}
      </div>
    </div>
  )
}
export default Basket
