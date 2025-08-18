import "./ProductScanner.css"
import {ArrowLeft} from "lucide-react";
import useVideoDevices from "@/barcodeScanner/UseVideoDevices.tsx";
import useBarCodeScanner from "@/barcodeScanner/UseBarCodeScanner.tsx";
import {useEffect, useState} from "react";
import useEANQueryMock from "@/eanQuery/useEANQueryMock.ts";
import {type ProductInfo, QueryError} from "@/eanQuery/useEANQuery.ts";
import {Allergen} from "@/common/Allergens.ts";

export default function ProductScanner() {
  const videoDevices = useVideoDevices();
  const [selectedDeviceId, setSelectedDeviceId] = useState(videoDevices[0]?.deviceId);
  const {lastEAN, videoRef, currentResult} = useBarCodeScanner(selectedDeviceId);
  const queryResult = useEANQueryMock(lastEAN)
  const isQueryErr = typeof queryResult === "string";

  useEffect(() => {
    setSelectedDeviceId(videoDevices[0]?.deviceId);
  }, [videoDevices, selectedDeviceId]);

  return <div className="productScannerScreen">
    <div className="header">
      <ArrowLeft/>
      <h1>ProductScanner</h1>
    </div>
    <div className="contentBody">
      <video className="viewFinder" ref={videoRef} autoPlay muted playsInline/>
      {!isQueryErr && <ProductInfoBox product={queryResult}/>}
      {<WarningResults/>}
    </div>
  </div>
}

function WarningResults() {
  /*TODO this has to be clickable into a popout view because the cause lists could be pretty long*/
  return <div className="result">
    <div className="headline"></div>
    <div className="personList">
      <div className="person">
        <div className="iconContainer"></div>
        <div className="name"></div>
        <div className="warningCauseList">
          <div className="warning"></div>
        </div>
      </div>
    </div>
  </div>
}


function ProductInfoBox({product}: { product: ProductInfo }) {
  return <div className="productInfo">
    <div className="body">
      <div className="title">{product.name}</div>
      <div className="contents">
        <div className="allergens">
          {product.allergens.map((value, i) => <div className="allergenEntry" key={i}>{Allergen[value]}</div>)}
        </div>
        <div className="ingredients">
          {product.ingredients.map((value, i) => <div className="ingredientEntry" key={i}>{value.display_name}</div>)}
        </div>
      </div>
    </div>
    {/*TODO figure out what to do with weird aspect ratios (Idea 1: Image Blur effect in background)*/}
    <div className="imageContainer">
      <img src={product.display_image} alt={"Image of " + product.name}/>
    </div>
  </div>;
}
