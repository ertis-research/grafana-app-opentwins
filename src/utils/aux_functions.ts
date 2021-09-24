export function getNameFromDittoThing(name:string){
    const i = name.indexOf(":")
    if(i+1<name.length){
        return name.substring(i+1)
    } else {
        return "unnamed"
    }
}