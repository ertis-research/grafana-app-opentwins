import { IStaticContext } from "utils/context/staticContext"
import { ISimulationAttributes } from "utils/interfaces/simulation"
import { patchTwinService } from "../crud/patchTwinService"

export const createOrUpdateSimulationService = (context:IStaticContext, twinId:string, simulation:ISimulationAttributes ) => {
    return patchTwinService(context, twinId, {
        attributes: {
            _simulations: {
                [simulation.id] : simulation
            }
        }
    })
}