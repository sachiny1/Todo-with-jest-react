import React from 'react'

const AddModal = ({data:{setShowModel,handleInputs,newNote,saveNote,closeModel}}:any) => {
    // console.log(data)
  return (
    <>
    <div data-testid="note-model">
  <div className="modal-dialog" role="document">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">Modal title</h5>
        <button onClick={closeModel} type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
      <input type="text" name="title" data-testid="title" value={newNote.title} onChange={handleInputs} className="form-control my-4" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1"/>
      <textarea className="form-control" name="desc" data-testid="desc" value={newNote.desc} onChange={handleInputs} id="exampleFormControlTextarea1" rows={3}></textarea>
      </div>
      <div className="modal-footer">
        <button type="button" data-testid="save-note" onClick={saveNote} className="btn btn-primary">Save</button>
        <button type="button" onClick={closeModel} className="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
    </>
  )
}

export default AddModal
