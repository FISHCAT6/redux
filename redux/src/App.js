import {useContext} from "react";
import "./index.css"
import {appContext, store, connect} from "./redux";
import {connectToUser} from "./connectors";

//2.创建dispatch,规范setState流程
// const Wrapper = () => {
//     const {appState, setAppState} = useContext(appContext)
//     const dispatch = (action) => {
//         setAppState(reducer(appState, action))
//     }
//     return <UserModifier dispatch={dispatch} state={appState}></UserModifier>
// }


//7.让connect后第一个括号中的实现的是selector功能，功能一：快速获取state中的值，比如user为{state.xxx.yyy.zzz.user.name}
const User = connectToUser(({user, dispatch}) => {
    //useContext接收一个context对象，返回上下文对象的value
    return <div>User: {user.name}</div>
})

const _USerModifier = ({updateUser, state, children}) => {
    const onChange = (e) => {
        updateUser( {name: e.target.value})//9.实现mapDispatchToProps
    }
    return <div>
        {children}
        <input className="input" value={state.user.name} onChange={onChange}/>
    </div>
}

//7.让connect后第一个括号中的实现的是selector功能，功能一：快速获取state中的值，比如user为{state.xxx.yyy.zzz.user.name}
const UserModifier = connectToUser(_USerModifier)
const One = () => <div className="One"
>
    <section className="bar">一级展示<User/></section>
</div>

const Two = () => <div
    className="Two">
    <section className="bar">二级展示<UserModifier>内容</UserModifier></section>
</div>

const Three = connect(state => {
    return {group: state.group}
})(({group}) => {
    return (
        <div className="Three">
            <section className="bar">三级展示
                <div>Group:{group.name}</div>
            </section>
        </div>
    )
})

//总的父组件
function App() {
    return (
        <appContext.Provider value={store}>
            <One></One>
            <Two></Two>
            <Three></Three>
        </appContext.Provider>
    )
}

export default App;



