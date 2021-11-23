export const APP_TITLE = 'Digital Twins';
export const APP_SUBTITLE = 'App plugin to manage digital twins';

export const KUBERNETES_NAMESPACE = 'cloud2edge'
export const DITTO_ENDPOINT = 'http://research.adabyron.uma.es:8054/api/2'
export const HONO_ENDPOINT = 'http://research.adabyron.uma.es:8046/v1'
export const DITTO_EXTENDED_API_ENDPOINT = "http://192.168.44.10:30526/api"
//export const DITTO_EXTENDED_API_ENDPOINT = "http://localhost:8888/api"
export const NAMESPACE_HONO = "raspberry"

export const DEFAULT_IMAGE_TWIN = 'https://cdn.pixabay.com/photo/2020/10/31/19/25/robot-5702074_960_720.png'

export const initResources = [
    {name: "policy:/", read: undefined, write: undefined, erasable: false, description: "Will be applied to the policy itself"},
    {name: "thing:/", read: undefined, write: undefined, erasable: false, description: "Will be applied to all Things referencing this Policy"},
    {name: "message:/", read: undefined, write: undefined, erasable: false, description: "Will be applied to all Messages sent to or from Things referencing this Policy"}
]

export const initSubjects = [{subjectIssuer: "{{ request", subject: "subjectId }}", type:"The creator"}]
