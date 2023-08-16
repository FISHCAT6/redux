//10.优化代码，实现selector
import {connect} from "./redux";

const userSelector = state =>{
    return {user:state.user}
}

//9+10.优化代码，实现mapDispatchToProps
const userDispatcher = (dispatch) => {
    return {
        updateUser:(attrs) => {
            dispatch({type:'updateUser',payload:attrs})
        }
    }
}

//10.优化代码，提取固定connect
export  const connectToUser  = connect(userSelector,userDispatcher)