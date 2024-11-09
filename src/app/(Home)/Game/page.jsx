'use client'

import ChooseGame from "./ChooseGame"
import withAuth from "../../HOC.tsx";

const Game = () => {
  return (
    <ChooseGame/>
  )
}

const ProtectedGame = withAuth(Game)
export default ProtectedGame
