export const APP_TITLE = 'Digital Twins';
export const APP_SUBTITLE = 'App plugin to manage digital twins';
export const KUBERNETES_NAMESPACE = 'cloud2edge'
export const DITTO_ENDPOINT = 'http://research.adabyron.uma.es:8054/api/2'
export const HONO_ENDPOINT = 'http://research.adabyron.uma.es:8046/v1'
export const TYPES_NAMESPACE_IN_DITTO = 'types'
export const MAINOBJECTS_THING_IN_DITTO = 'namespaces:namespaces'

export const DEFAULT_IMAGE_MAINOBJECT = 'https://cdn.pixabay.com/photo/2020/10/31/19/25/robot-5702074_960_720.png'

export const initResources = [
    {name: "policy", read: undefined, write: undefined, erasable: false, description: "Will be applied to the policy itself"},
    {name: "thing", read: undefined, write: undefined, erasable:false, description: "Will be applied to all Things referencing this Policy"},
    {name: "message", read: undefined, write: undefined, erasable:false, description: "Will be applied to all Messages sent to or from Things referencing this Policy"}
]
