import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'antd/dist/antd.css';
import { Provider } from 'react-redux';//react에 redux바인딩
import { applyMiddleware, createStore } from 'redux';
import promiseMiddleware from 'redux-promise';
import ReduxThunk from 'redux-thunk';
import Reducer from './_reducers';
/*
store는 원래 객체형식밖에 받을 수 없지만 redux-promise, redux-thunk 미들웨어를 이용해서
promise형식과 function형식도 받을 수 있게 도와준다. 그렇기 때문에 우리가 정의한
createStoreWithMiddleware라는 변수에 applyMiddleware라는 함수를 redux라이브러리에서 가져오고
redux-promise와 redux-thunk와 redux라이브러리에서 store를 생성할때 사용하는 createStore를 가져와서
createStore로 store를 생성했을 때, promise형식과 function형식을 받을 수 있도록 미들웨어를 거쳐서 만들어준다.
*/
const createStoreWithMiddleware = applyMiddleware(promiseMiddleware,ReduxThunk)(createStore)

ReactDOM.render(
  /*
  위에서 만든 store를 Provider store에다가 넣어준다.
  store는 최초의 reducer를 호출하게 되므로 reducer를 인자로 넣어줘야된다.
  */
  <Provider
      store={createStoreWithMiddleware(Reducer,
        window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__()
      )}
  >
    <App />
  </Provider>
  ,document.getElementById('root')//id가 root인 곳에다가 <App />을 보여준다.
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
