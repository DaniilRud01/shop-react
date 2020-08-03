import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getLogs } from '../redux/reducers/logs'

const Logs = () => {
  const dispatch = useDispatch()
  const logs = useSelector((s) => s.logs.logs)
  useEffect(() => {
    dispatch(getLogs())
  }, [dispatch])
  return (
    <div>
      {logs.map((el) => (
        <div key={el.time} className="flex">
          <div className="w-2/5">{el.time}</div>
          <div className="w-3/5">{el.event}</div>
        </div>
      ))}
    </div>
  )
}
export default Logs
