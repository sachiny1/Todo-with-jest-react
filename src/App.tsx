
import './App.css';
import TodoList from "./components/todoList"
import TodoDetail from "./components/TodoDetail"
import {Routes,Route} from "react-router-dom"

function App() {
  return (
    <div className="App">
      {/* routing */}
      <Routes>
        <Route path='/' element={<TodoList/>} />
        <Route path='/note-list' element={<TodoList/>} />
        <Route path='/note-detail/:noteid' element={<TodoDetail/>} />
      </Routes>
     {/* <TodoList/> */}
    </div>
  );
}

export default App;
