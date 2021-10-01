import { getThingsByTwinService } from "services/things/getThingsByTwinService"

export const getAllTypesService = () => {
    return getThingsByTwinService("types")
}