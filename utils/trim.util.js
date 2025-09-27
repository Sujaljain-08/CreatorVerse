export const trimValues = function(obj){
    const keys = Object.keys(obj)
    
    for(const key of keys){
        if(typeof obj[key] === "string"){
            obj[key] = obj[key].trim();
        }
    }
}