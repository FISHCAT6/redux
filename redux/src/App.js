import {createContext, useContext, useState} from "react";
//创建上下文进行包裹
const appContext = createContext(null);
const User = () => {
    //useContext接收一个context对象，返回上下文对象的value
    const contextValue = useContext(appContext)
    return <div>User: {contextValue.appState.user.name}</div>
}

//1.创建reducer函数，目的为了规范state值，避免对原state值进行直接修改
const reducer = (state, {type, payload}) => {
    if (type == "updateUser") {
        return {
            ...state,
            user: {
                ...state.user,
                ...payload
            }
        }
    } else {
        return state
    }
}
//2.创建dispatch,规范setState流程
const Wrapper = () => {
    const {appState, setAppState} = useContext(appContext)
    const dispatch = (action) => {
        setAppState(reducer(appState, action))
    }
    return <UserModifier dispatch={dispatch} state={appState}></UserModifier>
}
const UserModifier = ({dispatch, state}) => {
    const onChange = (e) => {
        dispatch({type: "updateUser", payload: {name: e.target.value}})
    }
    return <div>
        <input value={state.user.name} onChange={onChange}/>
    </div>
}
const One = () => <div
    style={{width: "800px", height: "100px", margin: "20px auto", backgroundColor: "lightblue", borderRadius: "20px"}}>
    <section style={{textAlign: "center", fontSize: "30px"}}>一级展示<User/></section>
</div>

const Two = () => <div
    style={{width: "800px", height: "100px", margin: "20px auto", backgroundColor: "lightblue", borderRadius: "20px"}}>
    <section style={{textAlign: "center", fontSize: "30px"}}>二级展示<Wrapper/></section>
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
