export const APP_TITLE = 'Digital Twins';
export const APP_SUBTITLE = 'App plugin to manage digital twins';

export const KUBERNETES_NAMESPACE = 'cloud2edge'

export const DEFAULT_IMAGE_TWIN = 'https://cdn.pixabay.com/photo/2020/10/31/19/25/robot-5702074_960_720.png'

export const initResources = [
    {name: "policy:/", read: undefined, write: undefined, erasable: false, description: "Will be applied to the policy itself"},
    {name: "thing:/", read: undefined, write: undefined, erasable: false, description: "Will be applied to all Things referencing this Policy"},
    {name: "message:/", read: undefined, write: undefined, erasable: false, description: "Will be applied to all Messages sent to or from Things referencing this Policy"}
]

export const initSubjects = [{subjectIssuer: "{{ request", subject: "subjectId }}", type:"The creator"}]

export const enumOptions = {
    FROM_TYPE: 0,
    FROM_ZERO: 1
}

export const options = [
    {label: 'From existing type', value: enumOptions.FROM_TYPE},
    {label: 'From scratch', value: enumOptions.FROM_ZERO}
]