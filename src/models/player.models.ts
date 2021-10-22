export type PlayerType = {
  id: number,
  name: string
  team: string
  jersey: number
  position: string
  analysis: string
  active: string
}

export type PlayerTypeForm = Omit<PlayerType, "id">;