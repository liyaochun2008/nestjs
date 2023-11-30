interface lock{
    username:string
    times:number
    freezeTime:number
}

let lockCount : lock[] = []
let tokenPool : string[] = []

export {lockCount,tokenPool}
