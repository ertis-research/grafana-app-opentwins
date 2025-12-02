import React from 'react'
import { ThingsList } from 'components/Things/List/ThingsList'
import { deleteTwinService, getAllRootTwinsService } from 'services/TwinsService'
import { deleteTwinWithChildrenService } from 'services/TwinsCompositionService'

export function TwinsList() {

    return <ThingsList 
            isType={false} 
            funcThings={() => getAllRootTwinsService()} 
            funcDelete={deleteTwinService}
            funcDeleteChildren={deleteTwinWithChildrenService}
        />

}
