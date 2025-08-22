import "./ProductScanner.css"
import {ArrowLeft, Check} from "lucide-react";
import useBarCodeScanner from "@/common/barcodeScanner/UseBarCodeScanner.ts";
import {type HTMLAttributes, type ReactNode} from "react";
import useEANQueryMock from "@/common/eanQuery/useEANQueryMock.ts";
import {type ProductInfo} from "@/common/eanQuery/useEANQuery.ts";
import useFoodWarningMock, {type FoodWarningReturn} from "@/common/warningGenerator/useFoodWarningMock.ts";
import useProfiles from "@/common/useProfiles.ts";
import DiamondAlertIcon from "@/assets/diamond_alert.tsx";
import DiamondCheckIcon from "@/assets/diamond_check.tsx";
import AlertIconBare from "@/assets/explamation_mark.tsx";
import {Allergen} from "@/common/Allergens.ts";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/shadcn/components/ui/sheet.tsx";
import {Carousel, CarouselContent, CarouselItem} from "@/shadcn/components/ui/carousel.tsx";

export default function ProductScanner() {
  const {lastEAN, videoRef, currentResult} = useBarCodeScanner();
  const queryResult = useEANQueryMock(lastEAN)
  const isQueryErr = typeof queryResult === "string";
  const {profiles} = useProfiles();
  const warning = useFoodWarningMock(profiles, !isQueryErr ? queryResult : undefined)

  return <div className="productScannerScreen">
    <header>
      <ArrowLeft/>
      <h1>ProductScanner</h1>
    </header>
    <div className="contentBody">
      <video className="viewFinder productScannerCard" ref={videoRef} autoPlay muted playsInline/>
      {!isQueryErr && <ResultCard product={queryResult} warnings={warning}/>}
      {isQueryErr && currentResult.toString()}
    </div>
  </div>
}

function ResultCard({product, warnings}: { product: ProductInfo, warnings: FoodWarningReturn[] }) {
  const hasAWarning = warnings.map(value => value.has_warning).reduce((a, b) => a || b);
  //TODO sheet with detailed product infos
  return <DetailPopup warnings={warnings}>
    <div className={hasAWarning ? "hasWarning productScannerCard" : "isOkay productScannerCard"}>
      <div className="productInfo">
        <div className="imageContainer">
          <img src={product.display_image} alt={"Image of " + product.name}/>
        </div>
        <div className="content">
          <h1>{product.name}</h1>
          <h3>EAN: #{product.ean}</h3>
          <h2>{product.brand}</h2>
        </div>
      </div>
      <hr/>
      <div className="warnings">
        <div className="headline">
          {hasAWarning ? <DiamondAlertIcon className="warningIcon"/> :
            <DiamondCheckIcon className="okIcon"/>}
          <p>{hasAWarning ? "Warning" : "Okay"}</p>
        </div>
        <div className="personList">
          {warnings.map((value, i) => <>
            <PersonResult key={i} warning={value}/>
            <div className="verticalSeparator"/>
          </>)}
        </div>
      </div>    </div>
  </DetailPopup>;
}

function PersonResult({warning}: { warning: FoodWarningReturn }) {
  const causeHint = warning
    .matching_allergens
    .map((v) => Allergen[v]);
  causeHint.push(...warning.matching_ingredients);

  return <div className="person">
    <CircularWarningIcon isWarning={warning.has_warning}/>
    <div className="name">{warning.person_name}</div>
    <div className="warningCauseList">
      {causeHint.length > 3 && causeHint.slice(0, 2).map(value => <div key={value} className="warning">{value}</div>)}
      {causeHint.length > 3 && <div className="warning">and {causeHint.length - 2} others...</div>}
      {causeHint.length <= 3 && causeHint.map(value => <div key={value} className="warning">{value}</div>)}
    </div>
  </div>;
}

type DetailPopupProps = {
  children: ReactNode;
  warnings: FoodWarningReturn[]
};

function DetailPopup({warnings, children}: DetailPopupProps) {
  return <Sheet>
    <SheetTrigger>
      {children}
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
              <CircularWarningIcon isWarning={value.has_warning} style={{width: "5rem"}}/>
              <h2>{value.person_name}</h2>
              <div className="resultContent">
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

interface CircularWarningIconProps extends HTMLAttributes<HTMLDivElement> {
  isWarning: boolean
}

function CircularWarningIcon(props: CircularWarningIconProps) {
  return <div className={props.isWarning ? "circleIcon isWarning" : "circleIcon"} {...props}>
    {props.isWarning ? <AlertIconBare/> :
      <Check/>}
  </div>;
}
