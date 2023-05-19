import React, { useEffect, useState } from 'react'
import {useParams} from "react-router-dom"

interface noteDet{
    id:number,
    title:string,
    desc:string
}

const TodoDetail = () => {
    const [note,setNote] = useState<null | noteDet>(null)
    const [noteError,setNoteError] = useState(false)
    const {noteid} = useParams<"noteid">()
    // const params = useParams<"noteid">()

    const getSingleNote = async () => {
        const res = await fetch(`http://localhost:9000/nodes/${noteid}`)
        const data = await res.json()
        if(data.id){
            setNote(data)
        }else{
            setNoteError(true)
        }
    }

    useEffect(()=>{
        // if(params){
            getSingleNote()
        // }
        }
        ,[])

    if(noteError){
        return <h2>Something went wrong</h2>
    }

    if(!note){
        return <h3>Loading...</h3>
    }
  return (
    <div>
        <h1>Note Detail page</h1>
    <div>
      {note.id ? 
      <>
      <h2>{note.title}</h2>
      <h3>{note.desc}</h3>
      </> 
      : ""}
    </div>
    </div>
  )
}

export default TodoDetail
