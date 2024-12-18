import { Context } from "utils/context/staticContext"
import { SimulationAttributes } from "utils/interfaces/simulation"
import { patchTwinService } from "../crud/patchTwinService"

export const createOrUpdateSimulationService = (context: Context, twinId: string, simulation: SimulationAttributes ) => {
    return patchTwinService(context, twinId, {
        attributes: {
            _simulations: {
                [simulation.id] : simulation
            }
        }
    })
}
