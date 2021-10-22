import { ChangeEvent, useContext, useState } from "react"

import { useQuery, useMutation, useQueryClient } from "react-query"
import { getPlayers, searchPlayerName } from "../../service/app.service"

import { PlayerType } from "models/player.models"

/**
 * Config
 */
import {playerColumns} from "./config"
/**
 * Context
 */
import {AppContext} from "../../App"


interface FilterButtonProps {
  status: string
}

const PostTable = (): JSX.Element => {
    const queryClient = useQueryClient()

  const [tableStatus, setTableStatus] = useState("all")
  const [queryInput, setQueryInput] = useState<string>("")
  const [queryName, setQueryName] = useState<string>("")

  const {setCreate, setFormValue, addPlayerId, playerIdsForDelete, deletePlayers} = useContext(AppContext)
  const hasIdsForDelete = playerIdsForDelete.length !== 0

  const {data: players} = useQuery(['players', tableStatus, queryName], () => getPlayers(tableStatus, queryName), {
    refetchOnWindowFocus: false
  })

  const selectPlayer = (player: PlayerType) => {
    setCreate(false)
    setFormValue(player)
  }

  const FilterButton = ({status}: FilterButtonProps): JSX.Element => {
    return (
      <button
        onClick={() => setTableStatus(status)}
        style={{ height: "40px" }}
        className={`p-0 pl-2 pr-2 mr-2 mb-2 bg-transparent border border-blue-500 text-md rounded-lg hover:bg-blue-500 hover:text-gray-100 focus:border-2 focus:border-blue-300 ${tableStatus === status ? 'bg-blue-500 text-white' : 'text-blue-500'}`}>
          {String(status).toUpperCase()}
      </button>
    )
  }

  return (
    <section className="py-1 bg-white">
      <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4 mx-auto mt-24">
        {hasIdsForDelete
          ?
          <button onClick={() => deletePlayers()} className="p-0 pl-2 pr-2 mr-2 mb-2 bg-transparent border border-red-500 text-red-500 text-md rounded-lg hover:bg-red-500 hover:text-gray-100 focus:border-2 focus:border-red-300">Delete</button>
          :
          null
        }

        <div className="flex items-end justify-between">
          <div className="flex items-end ">
            <div className="flex flex-col mb-4 mr-4">
              <label className="mb-2 font-bold text-sm text-gray-900" htmlFor="playerJersey">Search Player</label>
              <input onChange={(evt: ChangeEvent<HTMLInputElement>) => setQueryInput(evt?.target?.value)} className="border py-2 px-3 text-grey-800" type="text" name="playerJersey" id="playerJersey" />
            </div>
            <button onClick={() => setQueryName(queryInput)}  style={{ height: "40px" }} className="p-0 pl-2 pr-2 mr-2 mb-4 bg-transparent border border-blue-500 text-blue-500 text-md rounded-lg hover:bg-blue-500 hover:text-gray-100 focus:border-2 focus:border-blue-300">Search</button>
          </div>
          <div className="flex">
            <div className="flex mb-2 mr-4">

              <FilterButton status={"all"} />
              <FilterButton status={"active"} />
              <FilterButton status={"inactive"} />

            </div>
          </div>
        </div>

        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded ">
          <div className="block w-full overflow-x-auto">
            <table className="items-center bg-white w-full border-collapse">
              <thead>
                <tr>
                  <th className="px-6 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-t-0 border-l-0 border-r-0 whitespace-nowrap font-semibold text-left" />
                  {playerColumns.map(pColumns => (
                    <th key={pColumns} className="px-6 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-t-0 border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      {pColumns}
                    </th>
                  ))}
                  <th className="px-6 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-t-0 border-l-0 border-r-0 whitespace-nowrap font-semibold text-left" />
                </tr>
              </thead>

              <tbody>
                {players?.map((player: PlayerType) => (
                  <tr key={`${player.name}-${player.id}`}>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700 ">
                      <label className="flex items-center">
                        <input type="checkbox" className="form-checkbox" onChange={() => addPlayerId(player.id)} />
                      </label>
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700 ">
                      {player.jersey}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700 ">
                      {player.name}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700 ">
                      {player.team}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700 ">
                      {player.position}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700 ">
                      {player.analysis}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700 ">
                      {player.active === "true" ? "Active" : "Inactive"}
                    </td>
                    <td className="border-t-0 px-6 align-middle text-right border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700 ">
                      <button onClick={() => selectPlayer(player)} className="p-0 pl-2 pr-2 mr-2 bg-transparent border border-blue-500 text-blue-500 text-sm rounded-lg hover:bg-blue-500 hover:text-gray-100 focus:border-2 focus:border-blue-300">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PostTable