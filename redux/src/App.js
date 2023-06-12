import {createContext, useContext, useState} from "react";

const appContext = createContext(null);
const User = () => {
    const contextValue = useContext(appContext)
    return <div>User: {contextValue.appState.user.name}</div>
}

const UserModifier = () => {
    const contextValue = useContext(appContext)
    const onChange = (e) => {
        contextValue.appState.user.name = e.target.value;
        contextValue.setAppState({...contextValue.appState})
    }
    return <div>
        <input value={contextValue.appState.user.name} onChange={onChange}/>
    </div>
}
const One = () => <div
    style={{width: "800px", height: "100px", margin: "20px auto", backgroundColor: "lightblue", borderRadius: "20px"}}>
    <section style={{textAlign: "center", fontSize: "30px"}}>One<User/></section>
</div>

const Two = () => <div
    style={{width: "800px", height: "100px", margin: "20px auto", backgroundColor: "lightblue", borderRadius: "20px"}}>
    <section style={{textAlign: "center", fontSize: "30px"}}>Two<UserModifier/></section>
</div>

const Three = () => <div
    style={{width: "800px", height: "100px", margin: "20px auto", backgroundColor: "lightblue", borderRadius: "20px"}}>
    <section style={{textAlign: "center", fontSize: "30px"}}>Three</section>
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
