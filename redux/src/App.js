import {useContext} from "react";
import "./index.css"
import {appContext,Provider, connect, createStore} from "./redux";
import {connectToUser} from "./connectors";

//2.创建dispatch,规范setState流程
// const Wrapper = () => {
//     const {appState, setAppState} = useContext(appContext)
//     const dispatch = (action) => {
//         setAppState(reducer(appState, action))
//     }
//     return <UserModifier dispatch={dispatch} state={appState}></UserModifier>
// }

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

//11.实现creatStore，创建initState
const initState = {
    user:{name:'frank',age:18},
    group:{name:"前端组"}
}

//11.实现creatStore，创建完全体store
const store = createStore(reducer,initState)

//7.让connect后第一个括号中的实现的是selector功能，功能一：快速获取state中的值，比如user为{state.xxx.yyy.zzz.user.name}
const User = connectToUser(({user, dispatch}) => {
    //useContext接收一个context对象，返回上下文对象的value
    return <div>User: {user.name}</div>
})

const _USerModifier = ({updateUser, user, children}) => {
    const onChange = (e) => {
        // dispatch({type:'updateUser',payload:{name:e.target.value}})
        updateUser( {name: e.target.value})//9.实现mapDispatchToProps,将高频使用的type类型及数据对应的payload进行封装，节省开发成本
    }
    return <div>
        {children}
        <input className="input" value={user.name} onChange={onChange}/>
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
        //12.实现Provider
        <Provider store={store}>
            <One></One>
            <Two></Two>
            <Three></Three>
        </Provider>
    )
}

export default App;



