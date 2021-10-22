
import { PlayerType } from "models/player.models"

export const getPlayers = async (type = "all", query?: string): Promise<PlayerType[]>  => {
  let url: string = ""

  if (query !== "") {
    if (type === "active") {
      url = `http://localhost:8000/players?name_like=${query}&active=true`
    }

    if (type === "inactive") {
      url = `http://localhost:8000/players?name_like=${query}&active=false`
    }

    if (type === "all") {
      url = `http://localhost:8000/players?name_like=${query}`
    }
  } else {
    if (type === "active") {
      url = `http://localhost:8000/players?active=true`
    }
    if (type === "inactive") {
      url = `http://localhost:8000/players?active=false`
    } 
    
    if (type === "all") {
      url = `http://localhost:8000/players`
    }
  }

  const res = await fetch(url)
  const resJson = await res.json()
  return resJson
}

export const searchPlayerName = async (query: string): Promise<PlayerType[]>  => {
  const res = await fetch(`http://localhost:8000/players?name_like=${query}`)
  const resJson = await res.json()
  return resJson
}

export const createPlayer = async (data: any): Promise<PlayerType[]>  => {
  const res = await fetch(`http://localhost:8000/players`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const resJson = await res.json()
  return resJson
}

export const updatePlayer = async (data: PlayerType): Promise<PlayerType>  => {
  const res = await fetch(`http://localhost:8000/players/${data.id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const resJson = await res.json()
  return resJson
}

export const deletePlayersProfile = (playerIds: number[]): any => {
  let callbacks: any = []

  playerIds.map(playerId => {
    callbacks.push(deletePlayer(playerId))
  })

  return Promise.all(callbacks)
    .then(responses => {
      return Promise.all(
        responses.map((response: any) => {
          return response
        })
      );
    })
    .then(data => data);
}

export const deletePlayer = async (playerId: number): Promise<PlayerType>  => {
  const res = await fetch(`http://localhost:8000/players/${playerId}`, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const resJson = await res.json()
  return resJson
}

export const getTeams = async (): Promise<string[]>  => {
  const res = await fetch(`http://localhost:8000/teams`)
  const resJson = await res.json()
  return resJson
}