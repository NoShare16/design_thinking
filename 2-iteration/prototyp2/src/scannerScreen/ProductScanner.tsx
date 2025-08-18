import "./ProductScanner.css"
import {ArrowLeft, Check} from "lucide-react";
import useVideoDevices from "@/barcodeScanner/UseVideoDevices.tsx";
import useBarCodeScanner from "@/barcodeScanner/UseBarCodeScanner.tsx";
import {useEffect, useState} from "react";
import useEANQueryMock from "@/eanQuery/useEANQueryMock.ts";
import {type ProductInfo} from "@/eanQuery/useEANQuery.ts";
import useFoodWarningMock, {type FoodWarningReturn} from "@/warningGenerator/useFoodWarningMock.ts";
import useProfiles from "@/settingsEditor/profile_manager/useProfiles.ts";
import DiamondAlertIcon from "@/assets/diamond_alert.tsx";
import DiamondCheckIcon from "@/assets/diamond_check.tsx";
import AlertIconBare from "@/assets/explamation_mark.tsx";

export default function ProductScanner() {
  const videoDevices = useVideoDevices();
  const [selectedDeviceId, setSelectedDeviceId] = useState(videoDevices[0]?.deviceId);
  const {lastEAN, videoRef, currentResult} = useBarCodeScanner(selectedDeviceId);
  const queryResult = useEANQueryMock(lastEAN)
  const isQueryErr = typeof queryResult === "string";
  const {profiles} = useProfiles();
  const warning = useFoodWarningMock(profiles, !isQueryErr ? queryResult : undefined)

  useEffect(() => {
    setSelectedDeviceId(videoDevices[0]?.deviceId);
  }, [videoDevices, selectedDeviceId]);

  return <div className="productScannerScreen">
    <header>
      <ArrowLeft/>
      <h1>ProductScanner</h1>
    </header>
    <div className="contentBody">
      <video className="viewFinder productScannerCard" ref={videoRef} autoPlay muted playsInline/>
      {!isQueryErr && <ProductInfoBox product={queryResult}/>}
      {<WarningResults warnings={warning}/>}
    </div>
  </div>
}

function ProductInfoBox({product}: { product: ProductInfo }) {
  return <div className="productInfo productScannerCard">
    <div className="headline">
      <h1 className="title">{product.name}</h1>
      <div className="imageContainer">
        <img src={product.display_image} alt={"Image of " + product.name}/>
      </div>
    </div>
    <hr/>
    <div className="body">
      <div className="allergens">
        {/*{product.allergens.map((value, i) => <div className="allergenEntry" key={i}>{Allergen[value]}</div>)}*/}
      </div>
      <div className="ingredients">
        {/*{product.ingredients.map((value, i) => <div className="ingredientEntry" key={i}>{value.display_name}</div>)}*/}
      </div>
    </div>
    {/*TODO figure out what to do with weird aspect ratios (Idea 1: Image Blur effect in background)*/}
  </div>;
}


function WarningResults({warnings}: { warnings: FoodWarningReturn[] }) {
  /*TODO this has to be clickable into a popout view because the cause lists could be pretty long*/
  const hasAWarning = warnings.map(value => value.has_warning).reduce((a, b) => a || b);
  return <div className="result productScannerCard">
    <div className="headline">
      {/*<div className={hasAWarning ? "diamondIcon isWarning" : "diamondIcon"}>*/}
        {/*{hasAWarning ? <img src="src/assets/explamation_mark.tsx" className="icon"/> :*/}
        {/*  <Check className="icon"/>}*/}
        {/*{!hasAWarning ? <img src="../assets/diamond_alert.tsx" className="icon"/> :*/}
        {/*  <img src="../assets/diamond_check.tsx" className="icon"/>}*/}
        {hasAWarning ? <DiamondAlertIcon className="warningIcon"/> :
          <DiamondCheckIcon className="okIcon"/>}
      {/*</div>*/}
      <p>Warning</p>
    </div>
    <div className="personList">
      {warnings.map((value, i) => <>
        <div className="person" key={i}>
          <div className={value.has_warning ? "circleIcon isWarning" : "circleIcon"}>
            {value.has_warning ? <AlertIconBare/> :
              <Check/>}
          </div>
          <div className="name">{value.person_name}</div>
          <div className="warningCauseList">
            {value.matching_allergens.map((value, i) => <div key={i} className="warning">{value}</div>)}
            {value.matching_ingredients.map((value, i) => <div key={i} className="warning">{value}</div>)}
          </div>
        </div>
        <div className="verticalSeparator"/>
      </>)}
    </div>
  </div>
}
