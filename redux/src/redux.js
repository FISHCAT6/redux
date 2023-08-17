import {createContext, useContext, useEffect, useState} from "react";

//创建上下文进行包裹
const appContext = createContext(null);

//4.实现精准render
//11.实现creatStore，创建非完全体store
let state = undefined;
const store = {
    getState(){
        return state
    },
    reducer:undefined,
    setState(newState) {
        //改变数据
        state = newState
        //遍历listeners数组中压入的update函数，触发更新
        store.listeners.map(fn => fn())
    },
    listeners: [],
    subscribe(fn) {
        //压入update函数
        store.listeners.push(fn);
        //取消订阅
        return () => {
            const index = store.listeners.indexOf(fn);
            store.listeners.splice(index, 1);
        }
    }
}

//8.实现精准渲染，通过遍历新旧数据进行比对，确认过
const changed = (oldState, newState) => {
    let changed = false;
    for (let key in oldState) {
        if (oldState[key] !== newState[key]) {
            changed = true;
        }
    }
    return changed;
}

//11.实现creatStore,创建createStore
export const createStore = (reducer,initState)=>{
    state = initState
    store.reducer = reducer
    return store
}


//3.connect函数
export const connect = (selector, mapDispatchToProps) => (Component) => {
    //这里因为下方定义的UserModifier被当作了组件标签使用，因此在向组件UserModifier传值的时候相当于传入到了下方的props中
    return (props) => {
        //定义dispatch
        const dispatch = (action) => {
            setState(store.reducer(state, action))
        }
        //9.实现mapDispatchToProps,实现对dispatch的加工：dispatcher
        const dispatcher = mapDispatchToProps ? mapDispatchToProps(dispatch) : {dispatch}
        //从store中解构赋值出来state和setState
        const { setState} = useContext(appContext)
        //5.实现精准render,创建一个初始对象
        const [, update] = useState({})
        //7.让connect支持selector
        const data = selector ? selector(state) : {state}
        useEffect(() => {
            //8.实现精准渲染,初始组件挂载的时候执行store.subscribe，当selector发生更改或者组件卸载时，store.subscribe返回的函数就会执行
            return store.subscribe(() => {
                //8.实现精准渲染,获取store中的全新state对象，作为与旧对象比较的点
                const newDate = selector ? selector(state) : {state: state};
                //创建一个新对象，新对象和旧对象的内存地址不同引发重新渲染
                if (changed(data, newDate)) {
                    //5.实现精准render,创建一个新对象，由于新旧对象地址不同，引发更新渲染
                    update({})
                }
            })
        }, [selector])
        //下方的{...props}目的是为了将包裹组件中的传值也代入进去
        return <Component {...props} {...data} {...dispatcher}></Component>
    }
}

//12.实现Provider
export const Provider = ({store,children}) => {
    return (
        <appContext.Provider value={store}>
            {children}
        </appContext.Provider>
    )
}

