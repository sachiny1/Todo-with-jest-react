import React from "react"
import {
  render as renderRCA,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import TodoList from "./todoList";
import userEvent from "@testing-library/user-event"
import {BrowserRouter,Routes,Route} from "react-router-dom"

import { rest } from "msw";
import { setupServer } from "msw/node";

// for testing component witch depend on api call or backend data for that we have to call api but in testing we can not call api directly
// so we need to create fake api to return fake data for our testing purpose
// for that I am using msw(mock server worker) package to create server and create fake api with return fake data
// here i am creating server
const server = setupServer();

// we can't directly render component because we are using routing for that we have to wrapp our component inBrowserRouter and then render component
const render = (ui:React.ReactNode) =>{
  return renderRCA(<BrowserRouter>
  {ui}
  </BrowserRouter>)
}

describe("testing todo list page", () => {

  // before all test case run we have to run sever
  beforeAll(() => server.listen());

  // after each test case we need to reset server
  afterEach(() => server.resetHandlers());
  // after all testcase run we need to stop server
  afterAll(() => server.close());

  // one api I am using for the on place for that I have create one custome function which accept data as argument and call api and return ourtput
  // notes as argument have default data and it accept coming data too
  const customSetupServer = ({notes=[
    {
      id: 1,
      title: "Sachin",
      desc: "MERN developer",
    },
    {
      id: 2,
      title: "Sagar",
      desc: "UI/UX developer",
    },
  ]}={}) => {
    return  server.use(
        rest.get("http://localhost:9000/nodes", (req, res, ctx) => {
          return res(
            ctx.json(notes)
          );
        })
      );
  }


  // runing 1st test case 
  test("checking is todo render our not", async () => {
    // use are using useEffect with call api when site load for that I am calling customSetupServer here
   customSetupServer()
  //  after that we have to render component
    render(<TodoList />);
    //I am using Loader in api take time that it will render "Loading page..." it. After api give data we will removing it for that I am waiting to remove it from screen
    await waitForElementToBeRemoved(() =>
      screen.queryByText("Loading page...")
    );
    // here takeing all render note list
    const notesList = screen.getAllByTestId("note-item-list");
    // get as a array
    const notesText = notesList.map((note) => note.textContent);
    expect(notesText).toEqual(["Sachin", "Sagar"]);
  });

  test("when todo is empty that show warning massage", async () => {

    // calling api to return empty array
    server.use(
      rest.get("http://localhost:9000/nodes", (req, res, ctx) => {
        return res(ctx.json([]));
      })
    );
    // redering component here
    render(<TodoList />);
    // waiting for remove the Loader div
    await waitForElementToBeRemoved(() =>
      screen.queryByText("Loading page...")
    );

    const warningMsg = screen.queryByText("No Note available");
    // check is test coking our not
    expect(warningMsg).toBeInTheDocument();
  });

  test("when todo api fail then throw error on page", async () => {
    // calling api to return error so we can check error validation 
    server.use(
      rest.get("http://localhost:9000/nodes", (req, res, ctx) => {
        return res(ctx.status(500), ctx.json("something went wrong"));
      })
    );
    render(<TodoList />);

    await waitForElementToBeRemoved(() =>
      screen.queryByText("Loading page...")
    );
    const errorMsg = screen.queryByText("Something went wrong");
    expect(errorMsg).toBeInTheDocument();
  });

  test(`Scenario:Adding new note prosess
    WHEN click on add button THEN open model
    WHen save the note Then model will be closed`, 
    async () => { 
// we need to update api data for that I am creating default data as note and that calling post api to add new data in notes and return nat notes
        const notes=[
            {
              id: 1,
              title: "Sachin",
              desc: "MERN developer",
            },
            {
              id: 2,
              title: "Sagar",
              desc: "UI/UX developer",
            },
          ]
          // calling api to return data
          customSetupServer({notes:notes})
          
          // calling post data to update notes
          server.use(rest.post("http://localhost:9000/nodes",(req,res,ctx)=>{
            // pushing new data in notes
              notes.push({id:3,title:"Ankit",desc:"he is a software Engineer"})
              return res(ctx.status(200))
            }))
// rendering component here
    render(<TodoList />);
// waiting to remove Loader
    await waitForElementToBeRemoved(() =>
      screen.queryByText("Loading page...")
    );

    // taking reference of add button
    const addButtonRef = screen.getByText("Add Note")

    // click on it
    userEvent.click(addButtonRef)

    // checking it model showing our not
    expect(screen.getByTestId("note-model")).toBeInTheDocument();
    
   // typing in model field
    userEvent.type(screen.getByTestId("title"),"Ankit")
    userEvent.type(screen.getByTestId("desc"),"he is a software Engineer")
    //click on save data to store it
    userEvent.click(screen.getByTestId("save-note"))

    // waiting to remove modal
    await waitForElementToBeRemoved(()=>screen.queryByTestId("note-model"));
  
    expect(screen.queryByTestId("note-model")).not.toBeInTheDocument()
    
    });


    it("Scenario:When clike on the title then it will be redirect to detail page", 
    async ()=>{

      customSetupServer()

      // default setting url here
      window.history.pushState({},"","/")

      // creating routing here because on clicking button we want to change routing from "/" to "/note-detail/:noteid"
      render(<Routes>
        <Route path="/" element={<TodoList/>}/>
        {/* as i mention in app.test.tsx we can't directly render other component, because it having different data for that I am rendring one div witch have some text */}
        {/* because we just need to check is routing is working propery our not */}
        <Route path="/note-detail/:noteid" element={<div>Note detail component</div>}/>
      </Routes>)

// waiting to remove Loader
await waitForElementToBeRemoved(()=>screen.queryByText("Loading page..."))

// getting all note reference
const noteLists = screen.getAllByTestId("note-item-list")

// clicking on the first element of note
userEvent.click(noteLists[0])
// checking is component render our not
screen.getByText("Note detail component")

    })


});
