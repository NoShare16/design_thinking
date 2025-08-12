import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Homescreen from './homescreen/Homescreen.tsx'
import {createBrowserRouter, createRoutesFromChildren, Route, RouterProvider} from "react-router-dom";

const router = createBrowserRouter(
    createRoutesFromChildren(
        <>
            <Route path="*" element={<Homescreen/>}/>

        </>
    )
)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <RouterProvider router={router}/>
  </StrictMode>,
)
