import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Homescreen from './homescreen/Homescreen.tsx'
import {createBrowserRouter, createRoutesFromChildren, Route, RouterProvider} from "react-router-dom";
import AllergenSelector from "@/settingsEditor/allergenSelector/AllegenSelector.tsx";
import {Allergen} from "@/Allergens.ts";

const router = createBrowserRouter(
    createRoutesFromChildren(
        <>
            <Route path="*" element={<Homescreen/>}/>
            {/*Temp for testing \/*/}
            <Route path="/allergenSelector" element={<AllergenSelector options={Object.keys(Allergen).filter(value => isNaN(Number(value)))}/>}/>
        </>
    )
)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <RouterProvider router={router}/>
  </StrictMode>,
)
