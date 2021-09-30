import { deleteThingService } from "services/things/deleteThingService"

export const deleteTypeService = ( thingId : string ) => {
    return deleteThingService(thingId)
}