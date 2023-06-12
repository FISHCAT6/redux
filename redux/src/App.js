import {createContext, useContext, useState} from "react";
//创建上下文进行包裹
const appContext = createContext(null);
const User = () => {
    //useContext接收一个context对象，返回上下文对象的value
    const contextValue = useContext(appContext)
    return <div>User: {contextValue.appState.user.name}</div>
}
const UserModifier = () => {
    const {appState,setAppState} = useContext(appContext)
    const onChange = (e) => {
        appState.user.name = e.target.value;
        setAppState({...contextValue.appState})
    }
    return <div>
        <input value={contextValue.appState.user.name} onChange={onChange}/>
    </div>
}
const One = () => <div
    style={{width: "800px", height: "100px", margin: "20px auto", backgroundColor: "lightblue", borderRadius: "20px"}}>
    <section style={{textAlign: "center", fontSize: "30px"}}>一级展示<User/></section>
</div>

const Two = () => <div
    style={{width: "800px", height: "100px", margin: "20px auto", backgroundColor: "lightblue", borderRadius: "20px"}}>
    <section style={{textAlign: "center", fontSize: "30px"}}>二级展示<UserModifier/></section>
</div>

const Three = () => <div
    style={{width: "800px", height: "100px", margin: "20px auto", backgroundColor: "lightblue", borderRadius: "20px"}}>
    <section style={{textAlign: "center", fontSize: "30px"}}>三级展示</section>
</div>

function App() {
    const [appState, setAppState] = useState({
        user: {name: 'frank', age: 18}
    })
    const contextValue = {appState, setAppState}
    return (
        <appContext.Provider value={contextValue}>
            <One></One>
            <Two></Two>
            <Three></Three>
        </appContext.Provider>
    )
}

export default App;
