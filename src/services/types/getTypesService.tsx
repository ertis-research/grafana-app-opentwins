import { getTwinsService } from "services/twins/getTwinsService"

export const getTypesService = () => {
    return getTwinsService("types")
}