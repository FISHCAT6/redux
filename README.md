# 手写redux+react-redux库

项目描述：依托react框架，根据个人理解实现redux+react-redux库功能以及示例展示。 

依托项：`React18.0`+`useContext`+`createContext` 

运行方式：`npm start`

## 0.整体架构图

![未命名文件(14)](https://github.com/FISHCAT6/redux/assets/89964854/aaad54df-9230-4d66-94ca-8914cb581006)



## 1.手写reducer

实现初衷：解决`state`更改时对原`state`状态的破坏。

实现方法：`reducer`函数中形参`state`为需要更改的初始state值，`type`为需要更改的类型，`payload`为更改的值。 `reducer`内部通过对原`state`和更改值进行展开运算，进而合并需要更改的数据；最终返回一个新的对象，避免的了对组件初始`state`值的更改。

## 2.手写dispatch

实现初衷：解决频繁修改`state`时，多次调用重复调用`reducer`及其他函数的问题。通过`dispatch`函数封装`setXXX`函数以及`reducer`函数。单独定义`dispatch`无法读取`useState`定义的状态值和更改函数（`hooks`只能在组件中读取使用）

实现方法：将`dispatch`封装在一个新的组件（例如：`Wrapper`）中，该组件包括`hooks`对应的值以及函数（通过上下文获得）、`dispatch`函数以及需要状态管理的组件。

```jsx
dispatch实现前：
setAppstate(reducer(appstate,{type:'updateUser',payload:{name:e.target.value}}));
setAppState(reducer(appstate,{type:'updateUser',payload:{age:e.target.value}}));
setAppState(reducer(appState,{type:'updateGroup',payload:{age:e.target.value}}));

dispatch实现后：
const Wrapper = () => {
    const {appState, setAppState} = useContext(appContext)
    //此处定义dispatch
    const dispatch = (action) => {
        setAppState(reducer(appState, action))
    }
    return <UserModifier dispatch={dispatch} state={appState}></UserModifier>
}
//将上方使用到UserModifier的地方也改为Wrapper
```

## 3.手写connect

实现初衷：在没有创建`connect`函数之前，因为单独使用`dispatch`需要在外层包裹组件，不同组件多次使用`dispatch`就需要多次创建新的组件。 

实现方法:`connect`函数的作用是定义一个函数对需要管理的组件进行包裹，返回一个新的组件，该组件包含`dispatch`函数以及需要管理的组件。`connect`函数的参数为需要管理的组件，返回值为传入的组件、`dispatch`函数以及传入组件附带的props。

```jsx
connect实现前：
const Wrapper1 = () => {
    const {appState, setAppState} = useContext(appContext)
    //此处定义dispatch
    const dispatch = (action) => {
        setAppState(reducer(appState, action))
    }
    return <UserModifier dispatch={dispatch} state={appState}></UserModifier>
}
const Wrapper2 = ......
const Wrapper3 = ......

connect实现后：
const connect = (Component) => {
//这里因为下方定义的UserModifier被当作了组件标签使用，因此在向组件UserModifier传值的时候相当于传入到了下方的props中
    return (props) => {
        const {state, setState} = useContext(appContext)
        const dispatch = (action) => {
            setState(reducer(state, action))
        }
        let b = {...props}
        console.log("a", b)
        //下方的{...props}目的是为了将包裹组件中的传值也代入进去
        return <Component {...props} dispatch={dispatch} state={state}></Component>
    }
}
const UserModifier = connect(_USerModifier)
```

## 4.实现精准render

实现初衷：`render`实现之前，只要一个组件依赖的state发生改变，其余组件也要跟着一起渲染，会造成性能问题。

实现方法：改造`connect`和`store`：初始运行的情况下，会将用到`redux`功能的组件进行`connect`包裹，给对应组件上添加升级后的`dispatch`功能，同时将该组件的`update`功能压入`store`中的`listeners`

## 5.实现connect支持selector

实现初衷:`selector`实现之前，如果遇到组件需要多次使用`store`中深层级的数据，需要在`JSX`中多次重复定义，增加了开发成本。

实现方法：改造`connect`，将`connect`改造为`()=>()=>{}`,第一个括号中放的是`selector`形参，后续加入`data`作为传值。

## 6.实现数据精准渲染

实现初衷:只有当组件中用的数据发生变更时，才会进行重新渲染。

实现方法：在`useEffect`中进行订阅，增加`newState`作为从`store`中拿到的最新数据，同时增加`changed`方法作为新旧数据的比对。

## 7.现connect支持mapDispatchToProps

实现初衷：`mapDispatchToProps`实现之前，如果有诸如`{type:AA,payload:{BB}}`的场景，若AA需要多次派发，则每次都需要写`{type:AA,payload:{BB}}`，增加了开发成本。

实现方法：抽离出`mapDispatchToProps`,封装为一个新的对象。新的对象返回一个键作为组件调用的窗口，对应的值为一个函数，函数形参接受需要更改的数据，返回值为固定的`dispatch`

## 8.封装Provider和createStore

实现初衷：`createStore`可以方便自定义`sotore`，向`store`中传入自定义的`reducer`和`state`.`Provider`实现简化的操作

实现方法：

```jsx
export const createStore = (reducer,initState)=>{
    state = initState
    store.reducer = reducer
    return store
}
export const Provider = ({store,children}) => {
    return (
        <appContext.Provider value={store}>
            {children}
        </appContext.Provider>
    )
}
```

## 9.支持异步action



