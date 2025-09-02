import { Parallax } from "../components/Parallax"

export default function Index (){

    return (<Parallax background={<div><p>test2</p></div>} backgroundMultiplier={20} foreGroundMultiplier={140}>
        <div style={{margin:"120px"}}><p>test</p></div>
        
         </Parallax>)
}