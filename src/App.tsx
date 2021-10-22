import 'react-toastify/dist/ReactToastify.css'

import { createContext, SetStateAction, useState, useEffect } from "react"
import { useMutation, useQueryClient } from "react-query"
import { toast, ToastContainer } from 'react-toastify'
/**
 * Layout
 */
import Header from "./layout/header"
/**
 * Components
 */
import PlayersTable from "./components/players/table"
import PlayerForm from "./components/players/form"
/**
 * Model
 */
import { PlayerType } from "models/player.models"
/**
 * Service
 */
import { deletePlayersProfile } from "./service/app.service"

type AppContextType = {
  isCreate: boolean
  formValue: PlayerType
  playerIdsForDelete: number[]
  setFormValue: React.Dispatch<SetStateAction<PlayerType>>
  setCreate: React.Dispatch<SetStateAction<boolean>>
  resetForm: () => void
  addPlayerId: (newValue: number) => void
  deletePlayers: () => void
  notifyToast: (type: "success" | "error" | "info", message: string) => void
}

export const AppContext = createContext<AppContextType>({
  isCreate: true,
  formValue: {
    id: 0,
    name: "",
    team: "",
    jersey: 0,
    position: "",
    analysis: "",
    active: "false"
  },
  playerIdsForDelete: [],
  setFormValue: () => {},
  setCreate: () => {},
  resetForm: () => {},
  addPlayerId: () => [],
  deletePlayers: () => [],
  notifyToast: () => {}
});

const App = () => {
  const queryClient = useQueryClient()
  const [formValue, setFormValue] = useState<PlayerType>({
    id: 0,
    name: "",
    team: "",
    jersey: 0,
    position: "",
    analysis: "",
    active: "false"
  })
  const [isCreate, setCreate] = useState<boolean>(true)
  const [playerIdsForDelete, setPlayerDelete] = useState<number[]>([])

  const notifyToast = (type: "success" | "error" | "info", message: string) => {
    return toast[type](message)
  }

  const {mutate: removePlayerProfiles} = useMutation(() => deletePlayersProfile(playerIdsForDelete), {
    onSettled: () => {
      queryClient.invalidateQueries('players')
      resetForm()
      setCreate(true)
      setPlayerDelete([])
      notifyToast("success", "Successfully remove players.")
    }
  })

  const addPlayerId = (newValue: number) => {
    if (playerIdsForDelete.includes(newValue)) {
      const filteredIds = playerIdsForDelete.filter((item) => item !== newValue)
      return setPlayerDelete(filteredIds)
    } else {
      return setPlayerDelete(prevArray => [...prevArray, newValue])
    }
  }

  const resetForm = () => {
    setFormValue({
      id: 0,
      name: "",
      team: "",
      jersey: 0,
      position: "",
      analysis: "",
      active: "false"
    })
  }

  useEffect(() => {
    if (isCreate) {
      resetForm()
    }
  }, [isCreate])

  return (
    <>
      <Header />
      <AppContext.Provider
        value={{
          isCreate,
          formValue,
          setFormValue,
          setCreate,
          resetForm,
          addPlayerId,
          playerIdsForDelete,
          deletePlayers: removePlayerProfiles,
          notifyToast,
        }}>
        <PlayerForm />
        <PlayersTable />
      </AppContext.Provider>
      <ToastContainer/>
    </>
  )
}

export default App