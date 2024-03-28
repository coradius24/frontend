import { AppContext } from "@/contexts/AppContext"
import { useContext } from "react"

const useApp = () => useContext(AppContext)

export default useApp