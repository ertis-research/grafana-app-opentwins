import { FilterPill, useTheme2 } from '@grafana/ui'
import React, { Fragment } from 'react'
import { capitalize, defaultIfNoExist } from 'utils/auxFunctions/general'
import { IDittoThing } from 'utils/interfaces/dittoThing'
import { ButtonsInfo } from '../dittoThing/form/subcomponents/buttonsInfo'

interface Parameters {
    path: string
    thing: IDittoThing
    isType: boolean
    sections: string[]
    selected: string
    setSelected: React.Dispatch<React.SetStateAction<string>>
    funcDelete: any
    funcDeleteChildren?: any
}

export const InfoHeader = ({ path, thing, isType, sections, selected, setSelected, funcDelete, funcDeleteChildren }: Parameters) => {

    const IfImage = (thing.attributes !== undefined && thing.attributes.hasOwnProperty("image") && thing.attributes.image) ?
        <img src={defaultIfNoExist(thing.attributes, "image", '')} width='100px' height='100px' style={{ objectFit: 'cover' }} />
        : <div></div>

    return (
        <Fragment>
            <div className='headerInfo'>
                <div className='div1'>
                    <div className='responsiveImage'>
                        {IfImage}
                        <div className='responsiveTextHeader'>
                            <h3 style={{ marginBottom: '0px' }}>{defaultIfNoExist(thing.attributes, "name", thing.thingId)}</h3>
                            <h5 style={{ marginBottom: '0px', color: useTheme2().colors.text.secondary }}>{thing.thingId}</h5>
                        </div>
                    </div>
                </div>
                <div className='div2'>
                    <div style={{ display: 'block' }}>
                        <div style={{ display: 'flex' }}>
                            {sections.map((item) => (
                                <div style={{ marginLeft: '2px', marginRight: '2px' }}>
                                    <FilterPill key={item} label={capitalize(item)} selected={item === selected} onClick={() => {
                                        history.pushState(null, "", path + "&mode=check&id=" + thing.thingId + "&section=" + item)
                                        setSelected(item)
                                    }} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='div3'>
                    <ButtonsInfo path={path} thingId={thing.thingId} isType={isType} funcDelete={funcDelete} funcDeleteChildren={funcDeleteChildren} />
                </div>
            </div>
        </Fragment>
    )
}
