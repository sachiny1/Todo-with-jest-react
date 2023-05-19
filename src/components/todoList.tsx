import React,{useState,useEffect} from 'react'
import AddModal from "./AddModal"
import { Link } from 'react-router-dom'

interface note {
    id:number,
    title:string,
    desc:string

}

const TodoList = () => {
    const [todo,setTodo] = useState<note[] | null>(null)
    const [error,setError] = useState(false)
    const [showModel,setShowModel] = useState(false)
    const [newNote,setNewNote] = useState({title:"",desc:""})

    const callTodoListData = async () => {
      
            const res = await fetch("http://localhost:9000/nodes")
            const data = await res.json()
            if(Array.isArray(data)){
                setTodo(data)
            }else{
                setError(true)
            }
    }

    const handleInputs = (e:any) => {
        const {name,value} = e.target;
        setNewNote({...newNote,[name]:value})
    }

    const saveNote = async (e:any) => {
        e.preventDefault()
        if(!newNote.title || !newNote.desc){
           return window.alert("Please fill all the field of the form")
        }
        await fetch("http://localhost:9000/nodes",{method:"POST",body:JSON.stringify(newNote),headers:{"Content-Type":"application/json"}})
        // const data = await res.json()
        setShowModel(false)
        callTodoListData()

    }

    const closeModel = () => {
        setShowModel(false)
        setNewNote({title:"",desc:""})
    }

    useEffect(()=>{
        callTodoListData()
    },[])


    if(error){
        return <h1>Something went wrong</h1>
    }


    if(todo === null){
        return <h1>Loading page...</h1>
    }


  return <><div data-testid="notes-ul">{todo.length > 0 ? todo.map((to)=> <Link  key={to.id} to={`/note-detail/${to.id}`}><h3 data-testid="note-item-list" >{to.title}</h3></Link>) : <div>No Note available</div>}</div>
  <div>
    <button data-testid="add-note" onClick={()=>setShowModel(true)}>Add Note</button>
  </div>

  <div>
    {showModel && <AddModal data={{setShowModel,handleInputs,newNote,saveNote,closeModel}} />}
  </div>
  </>
}

export default TodoList
