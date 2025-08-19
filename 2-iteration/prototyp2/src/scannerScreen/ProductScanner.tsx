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
import {Allergen} from "@/common/Allergens.ts";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel.tsx";

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
    <div className="imageContainer">
      <img src={product.display_image} alt={"Image of " + product.name}/>
    </div>
    <div className="content">
      <h1 className="title">{product.name}</h1>
    </div>
  </div>;
}


function PersonResult({warning}: { warning: FoodWarningReturn }) {
  const causeHint = warning
    .matching_allergens
    .map((v) => Allergen[v]);
  causeHint.push(...warning.matching_ingredients);

  return <div className="person">
    <div className={warning.has_warning ? "circleIcon isWarning" : "circleIcon"}>
      {warning.has_warning ? <AlertIconBare/> :
        <Check/>}
    </div>
    <div className="name">{warning.person_name}</div>
    <div className="warningCauseList">
      {causeHint.length > 3 && causeHint.slice(0, 2).map(value => <div key={value} className="warning">{value}</div>)}
      {causeHint.length > 3 && <div className="warning">...</div>}
      {causeHint.length <= 3 && causeHint.map(value => <div key={value} className="warning">{value}</div>)}
    </div>
  </div>;
}

function WarningResults({warnings}: { warnings: FoodWarningReturn[] }) {
  /*TODO this has to be clickable into a popout view because the cause lists could be pretty long*/
  const hasAWarning = warnings.map(value => value.has_warning).reduce((a, b) => a || b);
  return <Sheet>
    <SheetTrigger>
      <div className="result productScannerCard">
        <div className="headline">
          {hasAWarning ? <DiamondAlertIcon className="warningIcon"/> :
            <DiamondCheckIcon className="okIcon"/>}
          <p>Warning</p>
        </div>
        <div className="personList">
          {warnings.map((value, i) => <>
            <PersonResult key={i} warning={value}/>
            <div className="verticalSeparator"/>
          </>)}
        </div>
      </div>
    </SheetTrigger>
    <SheetContent side="bottom" style={{height: "100%", backgroundColor: "white"}}>
      <SheetHeader>
        <SheetTitle className="sheetTitle">
          Warning results
        </SheetTitle>
      </SheetHeader>
      <Carousel orientation="horizontal" opts={{loop: true}}>
        <CarouselContent>
          {warnings.map((value) =>
            <CarouselItem className="carouselPerson">
              <h2>{value.person_name}</h2>
              <div className="resultConent">
                <h3>Allergens:</h3>
                <div>
                  {value.matching_allergens.map(v => <div>{Allergen[v]}</div>)}
                </div>
                <h3>Incompatible ingredients:</h3>
                <div>
                  {value.matching_ingredients.map(v => <div>{v}</div>)}
                </div>
              </div>
            </CarouselItem>
          )}
        </CarouselContent>
      </Carousel>
    </SheetContent>
  </Sheet>
}
