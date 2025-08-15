import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Homescreen from './homescreen/Homescreen.tsx'
import {createBrowserRouter, createRoutesFromChildren, Route, RouterProvider} from "react-router-dom";
import AllergenSelectorTest from "@/settingsEditor/allergenSelector/AllergenSelectorTest.tsx";
import BarcodeScannerTest from "@/barcodeScanner/BarcodeScannerTest.tsx";

const router = createBrowserRouter(
    createRoutesFromChildren(
        <>
            <Route path="*" element={<Homescreen/>}/>
            {/*Temp for testing \/*/}
            <Route path="/allergenSelectorTest" element={<AllergenSelectorTest/>}/>
            <Route path="/barCodeScannerTest" element={<BarcodeScannerTest/>}/>
        </>
    )
)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <RouterProvider router={router}/>
  </StrictMode>,
)
