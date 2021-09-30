import { getThingsByTwinService } from "services/things/getThingsByTwinService"

export const getTypesService = () => {
    return getThingsByTwinService("types")
}