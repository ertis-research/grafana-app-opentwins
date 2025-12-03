import React from 'react'
import { ThingsList } from 'components/Things/List/ThingsList'
import { deleteTwinService, getTwinsPaginatedService } from 'services/TwinsService'
import { deleteTwinWithChildrenService } from 'services/TwinsCompositionService'

export function TwinsList() {

    return <ThingsList 
            isType={false} 
            funcThings={getTwinsPaginatedService} 
            funcDelete={deleteTwinService}
            funcDeleteChildren={deleteTwinWithChildrenService}
        />

}
