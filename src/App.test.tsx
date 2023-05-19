import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import {BrowserRouter} from "react-router-dom"
 
// when url will be '/' or '/note-list' then TodoList component should render but in testing we don't need to render other component on the same page
// because that page having different login and text
// here we just need to make sure that one url the right component is render our not
// for that we can use the jest.mock to render fake component
// the first argument will be for component link our anything path our api url , which you want to make use it working
// and you jest need to render fake data to test it
jest.mock("./components/todoList",()=>{
  return ()=>{
    return <div data-testid="note-list-render-here">Hello World</div>
  }
})

// same for here I am checking here on "/note-detail/:noteid" url TodoDetail component should render so I have use it path here and render simple div with testid 
jest.mock("./components/TodoDetail",()=>{
  return ()=>{
    return <div data-testid="note-detail-render-here">Hello World from detail</div>
  }
})

// testing '/ route there
test("WHEN your on '/' route THEN render todolist component", () => {
  // window data will be constant here spo we have to check url 
  // for that I am using pushState here
  window.history.pushState({},"","/")

  // we are using react-router-dom for creating routing of app
  // so for testing we also have to use routing in testing for that I am wrapping App into BrowserRouter

  render(<BrowserRouter>
    <App />
  </BrowserRouter>);


// here we are checking that component is rendering our not
  expect(screen.getByTestId("note-list-render-here")).toBeInTheDocument()
});



// checking routing for "/note-list"
it("When user on '/note-list' THEN render todolist component",()=>{
  // by default url will be '/' so we need to chnage it to 'note-list' to check the routing i am runing the below line
  window.history.pushState({},"","/note-list")

  render(<BrowserRouter>
    <App />
  </BrowserRouter>);

  expect(screen.getByTestId("note-list-render-here")).toBeInTheDocument()
})


// checking routing for "/note-detail/:noteid"
it("When user on '/note-detail/:noteid' THEN render todo detail component",()=>{
    window.history.pushState({},"","/note-detail/1")
  
    render(<BrowserRouter>
      <App />
    </BrowserRouter>);
  
    expect(screen.getByTestId("note-detail-render-here")).toBeInTheDocument()
})
