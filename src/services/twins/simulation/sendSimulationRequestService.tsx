import { applyTypesOfFields } from "utils/auxFunctions/simulation";
import { ContentType } from "utils/data/consts";
import { ISimulationAttributes } from "utils/interfaces/simulation";
import { fetchService } from "../../general/fetchService";


export const sendSimulationRequest = async (attributes:ISimulationAttributes, data:{[key:string] : any}) => {
    console.log(data)
    var body:any = undefined

    if(attributes.contentType && attributes.content){
        switch (attributes.contentType) {
            case ContentType.JSON:
                data = applyTypesOfFields(data, attributes.content)
                body = JSON.stringify(data)
                break;
        
            case ContentType.FORM:
                body = new FormData();
    
                (Object.entries(data)).map(([key, value]) => 
                    body.append(key, data[key])
                )
    
                break;
        }
    }

    return fetchService(attributes.url, {
        method: attributes.method,
        body: body,
        mode: 'cors'
    })
}