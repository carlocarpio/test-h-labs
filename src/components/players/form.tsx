import { useContext, useEffect, useState, ChangeEvent} from "react"
import { useMutation, useQueryClient } from "react-query"
/**
 * Service
 */
import {getTeams, createPlayer, updatePlayer} from "../../service/app.service"
/**
 * Context
 */
import {AppContext} from "../../App"

const PlayerForm = (): JSX.Element => {
  const {isCreate, formValue, setCreate, setFormValue, resetForm, notifyToast} = useContext(AppContext)
  const [test, setTest] = useState("")

  const queryClient = useQueryClient()

  const {mutate: fetchTeams, data: teams} = useMutation(() => getTeams())

  const {mutate: createPlayerProfile} = useMutation(() => createPlayer(formValue), {
    onSuccess:() => {
      queryClient.invalidateQueries('players')
      resetForm()
      notifyToast("success", "Successfully created a player.")
    }
  })

  const {mutate: updatePlayerProfile} = useMutation(() => updatePlayer(formValue), {
    onSuccess:() => {
      queryClient.invalidateQueries('players')
      notifyToast("success", "Successfully updated a player.")
      resetForm()
    }
  })

  const setValue = (key: string, value: string) => {
    console.log(1234)

    setFormValue({
      ...formValue,
      [key]: value
    })
  }

  const handleSubmit = (evt: any, data: any) => {
    evt?.preventDefault()
    isCreate ? void createPlayerProfile(data) : void updatePlayerProfile(data)
  }

  useEffect(() => {
    void fetchTeams()
  }, [])

  return (
    <div className="flex justify-center items-center w-full">
      <div className="w-full xl:w-1/2 bg-white rounded shadow-2xl p-8 m-4">
        {!isCreate
          ?
          <div className="flex justify-end mb-4">
            <button onClick={() => setCreate(true)} className="p-2 mr-2 w-1/4 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-500 hover:text-gray-100 focus:border-2 focus:border-blue-300">Create New Player</button>
          </div>
          :
          null
        }
        <form onSubmit={(e) => handleSubmit(e, formValue)}>
          <div className="flex">
            <div className="flex flex-col mb-4 mr-4">
              <label className="mb-2 font-bold text-sm text-gray-900" htmlFor="playerJersey">Jersey</label>
              <input value={formValue.jersey} className="border py-2 px-3 text-grey-800" type="number" name="playerJersey" id="playerJersey" onChange={(evt: ChangeEvent<HTMLInputElement>) => setValue("jersey", evt?.target.value)} />
          </div>
          <div className="flex flex-1 flex-col mb-4">
              <label className="mb-2 font-bold text-sm text-gray-900" htmlFor="playerName">Name</label>
              <input aria-label="playerName" value={formValue.name} className="border py-2 px-3 text-grey-800" type="text" name="playerName" id="playerName" onChange={(evt: ChangeEvent<HTMLInputElement>) => setFormValue({...formValue, "name": evt?.target.value})} />
          </div>
          </div>
          <div className="flex flex-1 flex-col mb-4">
            <label className="mb-2 font-bold text-sm text-gray-900" htmlFor="playerPosition">Position</label>
            <select value={formValue.position} className="border py-2 px-3 text-grey-800" onChange={(evt: ChangeEvent<HTMLSelectElement>) => setValue("position", evt?.target.value)}>
              <option />
              <option>Guard</option>
              <option>Forward</option>
              <option>Center</option>
              </select>
          </div>
          <div className="flex flex-col mb-4">
            <label className="mb-2 font-bold text-sm text-gray-900" htmlFor="playerTeam">Team</label>
            <select value={formValue.team} className="border py-2 px-3 text-grey-800" onChange={(evt: ChangeEvent<HTMLSelectElement>) => setValue("team", evt?.target.value)}>
              <option />
              {teams?.map(team => (
                <option key={team}>{team}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col mb-4">
            <label className="mb-2 font-bold text-sm text-gray-900" htmlFor="playerAnalysis">Analysis</label>
            <textarea value={formValue.analysis} className="border py-2 px-3 text-grey-800" name="textarea" id="playerAnalysis" onChange={(evt: ChangeEvent<HTMLTextAreaElement>) => setValue("analysis", evt?.target.value)} />
          </div>
          <div className="flex mb-4">
            <label htmlFor="activePlayer" className="mb-2 mr-2 font-bold text-sm text-gray-900">Active Player</label>
            <input checked={formValue.active === "true"} id="activePlayer" type="checkbox" className="form-checkbox mt-1" onChange={() => setValue("active", formValue.active === "true" ? "false" : "true")} />
          </div>

          <div className="flex justify-end mb-4">
            <button className="p-2  mr-2 w-1/4 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-500 hover:text-gray-100 focus:border-2 focus:border-blue-300">{isCreate ? `Submit` : `Update`}</button>
          </div>
        </form>
      </div>
  </div>
  )
}

export default PlayerForm