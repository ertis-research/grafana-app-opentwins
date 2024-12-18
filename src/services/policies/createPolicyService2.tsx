//OPCION CON EL SDK, CAMBIARLO EN UN FUTURO
/*
//import { POLICIES_THING_IN_DITTO } from "utils/consts"
import { IPolicy } from "utils/interfaces/dittoPolicy"
import { DittoNodeClient, NodeHttpBasicAuth } from '@eclipse-ditto/ditto-javascript-client-node'

export const createPolicyService = (data:IPolicy) => {
    const domain = 'http://research.adabyron.uma.es:8054'
    const username = 'ditto'
    const password = 'ditto'
    
    const client = DittoNodeClient.newHttpClient()
    .withoutTls()
    .withDomain(domain)
    .withAuthProvider(NodeHttpBasicAuth.newInstance(username, password))
    .build();

    //const policiesHandle = client.getPoliciesHandle()
}*/
