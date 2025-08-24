import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import HomeScreen from "@/screens/homescreen/HomeScreen.tsx";
import ProductDemo from "./components/ProductDemo";
import {
  createBrowserRouter,
  createRoutesFromChildren,
  Route,
  RouterProvider,
} from "react-router-dom";
import AllergenSelectorTest from "@/screens/settingsEditor/allergenSelector/AllergenSelectorTest.tsx";
import ProductScanner from "@/screens/scannerScreen/ProductScanner.tsx";
import PersonMenu from "@/screens/settingsEditor/personEditor/PersonMenu.tsx";

const router = createBrowserRouter(
  createRoutesFromChildren(
    <>
      <Route path="*" element={<HomeScreen/>}/>
      <Route path="/productScanner" element={<ProductScanner/>}/>
      {/*Temp for testing \/*/}
      <Route path="/allergenSelectorTest" element={<AllergenSelectorTest/>}/>
      <Route path="/person" element={<PersonMenu/>}/>
      <Route path="/product_demo" element={<ProductDemo/>}/>
    </>
  )
);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
);
