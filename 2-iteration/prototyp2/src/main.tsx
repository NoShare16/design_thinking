import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import HomeScreen from "@/homescreen/HomeScreen.tsx"
import {createBrowserRouter, createRoutesFromChildren, Route, RouterProvider} from "react-router-dom";
import AllergenSelectorTest from "@/settingsEditor/allergenSelector/AllergenSelectorTest.tsx";
import ProfileManager from "@/settingsEditor/profile_manager/ProfileManager.jsx";
import ProductScanner from "@/scannerScreen/ProductScanner.tsx";
import ImageBlutTest from "@/imageContainer/ImageBlutTest.tsx";

const router = createBrowserRouter(
    createRoutesFromChildren(
        <>
            <Route path="*" element={<HomeScreen/>}/>
            <Route path="/productScanner" element={<ProductScanner/>}/>
            {/*Temp for testing \/*/}
            <Route path="/allergenSelectorTest" element={<AllergenSelectorTest/>}/>
            <Route path="/imageBlurTest" element={<ImageBlutTest/>}/>
            <Route path="/profile_manager" element={<ProfileManager/>}/>
        </>
    )
)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <RouterProvider router={router}/>
  </StrictMode>,
)
