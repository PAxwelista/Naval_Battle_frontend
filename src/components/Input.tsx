import style from  "@/styles/Input.module.css"
import { InputHTMLAttributes } from "react"

export const Input = (input:InputHTMLAttributes<HTMLInputElement>) =>{
    return <input
    className={style.main}
    {...input}
/>
}