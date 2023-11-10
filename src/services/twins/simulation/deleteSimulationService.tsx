import { Context } from "utils/context/staticContext"
import { patchTwinService } from "../crud/patchTwinService"

export const deleteSimulationService = (context: Context, twinId: string, id: string ) => {
    return patchTwinService(context, twinId, {
        attributes: {
            _simulations: {
                [id] : null
            }
        }
    })
}
