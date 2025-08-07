import { SetStateAction, useState } from "react"


export default function useOnChange(initialValue:string){

    const [value,setValue] = useState(initialValue)

    const onChange = (event: { target: { value: SetStateAction<string> } })=>{
        setValue(event.target.value)
    }

    return {value,onChange}
}