import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Homescreen from './homescreen/Homescreen.tsx'
import {createBrowserRouter, createRoutesFromChildren, Route, RouterProvider} from "react-router-dom";
import AllergenSelectorTest from "@/settingsEditor/allergenSelector/AllergenSelectorTest.tsx";

const router = createBrowserRouter(
    createRoutesFromChildren(
        <>
            <Route path="*" element={<Homescreen/>}/>
            {/*Temp for testing \/*/}
            <Route path="/allergenSelectorTest" element={<AllergenSelectorTest/>}/>
        </>
    )
)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <RouterProvider router={router}/>
  </StrictMode>,
)
