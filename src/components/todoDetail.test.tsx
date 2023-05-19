import {rest} from "msw"
import {setupServer} from "msw/node"
import TodoDetail from "./TodoDetail"
import React from "react"
import { render as renderRCA,screen, waitForElementToBeRemoved} from "@testing-library/react"
import { BrowserRouter ,Routes,Route} from "react-router-dom"

// create server to test
// for more detail read the comment on TodoList.test.tsx page
const server = setupServer()

const customSetupServer = () => {
    // creating default api with rendering default data
    return server.use(rest.get("http://localhost:9000/nodes/1",(req,res,ctx)=>{
        return res(ctx.json({
            "id": 1,
            "title": "Sachin",
            "desc": "MERN developer"
            }))
    }))
}

// here we are wrapping component in BrowserRouter and passing dynamic it to all api for multiple use
const render = (ui:React.ReactNode,id:number) => {
    // by default url will be "/" so we need to change it with /note-detail/${id}
    window.history.pushState({},"",`/note-detail/${id}`)
    return renderRCA(
    <BrowserRouter>
    <Routes>
        and the rendering component
        <Route path="/note-detail/:noteid" element={ui} />
    </Routes>
    </BrowserRouter>)
}


describe("To test todo detail page",()=>{

    beforeAll(()=>{server.listen()})
    afterEach(()=>{server.resetHandlers()})
    afterAll(()=>{server.close()})

    // checking page is render properly our not
    test("when use enter then component should be render", async ()=>{
        //calling fake data
        customSetupServer()

        // calling component with passing component and data it
        render(<TodoDetail/>,1)
        // waiting to remove Loader
        await waitForElementToBeRemoved(()=>screen.queryByText("Loading..."))
        // checking condition here
        expect(screen.getByText("Sachin")).toBeInTheDocument()
        expect(screen.getByText("MERN developer")).toBeInTheDocument()
    })

    // checking id is exit our not
    test("When user enter not exists id than throw error", async ()=>{
        // calling fake api to return error
        server.use(rest.get("http://localhost:9000/nodes/5",(req,res,ctx)=>{
            return res(ctx.status(500),ctx.json("something went wrong"))
        }))
        // the render component with id which not exist
        render(<TodoDetail/>,5)
 // waiting to remove Loader
        await waitForElementToBeRemoved(()=>screen.queryByText("Loading..."))
 // checking condition here
        expect(screen.getByText("Something went wrong")).toBeInTheDocument()
    })

})