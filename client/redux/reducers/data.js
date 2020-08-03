import axios from 'axios'

const initialState = {
  catalog: [],
  selection: {},
  rates: {},
  base: 'EUR'
}

const CATALOG = '@@CATALOG'
const ADD_SELECTION = 'ADD_SELECTION'
const REMOVE_SELECTION = 'REMOVE_SELECTION'
const SET_RATES = '@@SET_RATES'
const SET_BASE = '@@SET_BASE'
const SET_SORT = '@@SET_SORT'

export default function (state = initialState, action) {
  sessionStorage.setItem('basket', JSON.stringify(action))
  switch (action.type) {
    case CATALOG:
      return { ...state, catalog: action.catalog }
    case ADD_SELECTION:
      return {
        ...state,
        selection: { ...state.selection, [action.id]: (state.selection[action.id] || 0) + 1 }
      }
    case REMOVE_SELECTION: {
      const newSelection = {
        ...state.selection,
        [action.id]: (state.selection[action.id] || 0) - 1
      }
      if (newSelection[action.id] <= 0) {
        delete newSelection[action.id]
      }
      return { ...state, selection: newSelection }
    }
    case SET_RATES:
      return { ...state, rates: action.rates }
    case SET_BASE:
      return { ...state, base: action.el }
    case SET_SORT:
      return { ...state, catalog: action.catalog }
    default:
      return state
  }
}

export function catalog() {
  return (dispatch) => {
    axios('/api/v1/shop').then(({ data }) => dispatch({ type: CATALOG, catalog: data }))
  }
}

export function addToSelection(id) {
  return { type: ADD_SELECTION, id }
}

export function removeFromSelection(id) {
  return { type: REMOVE_SELECTION, id }
}

export function setBase(el) {
  return (dispatch) => {
    axios({
      method: 'POST',
      url: '/api/v1/logs',
      data: { type: el }
    })
    dispatch({ type: SET_BASE, el })
  }
}

export function setRate() {
  return (dispatch) => {
    axios('/api/v1/rates').then(({ data: { rates } }) => dispatch({ type: SET_RATES, rates }))
  }
}

export function getSort(typeSort) {
  return (dispatch, getState) => {
    const products = [...getState().shop.catalog]
    if (typeSort === 'lowest') {
      products.sort((a, b) => a.price - b.price)
      axios({
        method: 'POST',
        url: '/api/v1/logs',
        data: { type: typeSort }
      })
    }
    if (typeSort === 'highest') {
      products.sort((a, b) => b.price - a.price)
      axios({
        method: 'POST',
        url: '/api/v1/logs',
        data: { type: typeSort }
      })
    }
    return dispatch({ type: SET_SORT, catalog: products })
  }
}
