import axios from 'axios'

const initialState = {
  logs: []
}
const GET_LOGS = '@@GET_LOGS'

export default function (state = initialState, action) {
  if (action.type.indexOf('@@') !== 0) {
    axios({
      method: 'POST',
      url: '/api/v1/logs',
      data: action
    })
  }
  switch (action.type) {
    case GET_LOGS:
      return { ...state, logs: action.logs }
    default:
      return state
  }
}

export function getLogs() {
  return (dispatch) => {
    axios('/api/v1/logs').then(({ data }) => dispatch({ type: GET_LOGS, logs: data }))
  }
}
