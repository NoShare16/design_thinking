import "./ProductScanner.css"
import {ArrowLeft, Check} from "lucide-react";
import useBarCodeScanner from "@/common/barcodeScanner/UseBarCodeScanner.ts";
import {type HTMLAttributes, type ReactNode, useEffect, useState} from "react";
import {type FoodWarningReturn} from "@/common/warningGenerator/useFoodWarningMock.ts";
import useProfiles from "@/common/useProfiles.ts";
import DiamondAlertIcon from "@/assets/diamond_alert.tsx";
import DiamondCheckIcon from "@/assets/diamond_check.tsx";
import AlertIconBare from "@/assets/explamation_mark.tsx";
import {Allergen} from "@/common/Allergens.ts";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/shadcn/components/ui/sheet.tsx";
import {Carousel, CarouselContent, CarouselItem} from "@/shadcn/components/ui/carousel.tsx";
import {DetailedProductInfos} from "@/components/DetailedProductInfos.tsx";
import {type ProductInfo, QueryError, queryProductByEAN} from "@/common/productQuery.ts";
import type {EANNumber} from "@/common/EANNumber.ts";
import {matchProduct} from "@/common/matching.ts";

function useEANQuery(ean: EANNumber) {
  const [product, setProduct] = useState<ProductInfo|undefined>(undefined)
  const [error, setError] = useState<string|undefined>("")
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    setLoading(true);
    setError(undefined);

    (async () => {
      try {
        const data = await queryProductByEAN(ean.toString());
        setProduct(data);
      } catch (e: unknown) {
        if (e instanceof Error && e.message === QueryError.NOT_FOUND) {
          setError("Produkt nicht gefunden.");
        } else if (e instanceof Error) {
          setError("Fehler: " + e.message);
        } else {
          setError("Unbekannter Fehler");
        }
      } finally {
        setLoading(false);
      }
    })()
  },[ean])
  return {product, error, loading};
}

function useWarning(product: ProductInfo | undefined) {
  const {profiles} = useProfiles();
  const [warnings, setWarnings] = useState<FoodWarningReturn[]>([])

  useEffect(() => {
    if (!product) {
      setWarnings([])
    } else {
      const map = profiles.map((p) => {
        const d = matchProduct(p, product);
        return {
          person_name: p.name,
          matching_allergens: d.matchedAllergens,
          matching_ingredients: d.matchedIngredients,
          has_warning: d.matchedIngredients.length + d.matchedIngredients.length > 0
        }
      });
      setWarnings(map);
    }
  }, [product, profiles]);
  return warnings;
}

export default function ProductScanner() {
  const {lastEAN, videoRef, currentResult} = useBarCodeScanner();
  const {product, error, loading} = useEANQuery(lastEAN);
  const warning = useWarning(product)

  return <div className="productScannerScreen">
    <header>
      <ArrowLeft/>
      <h1>ProductScanner</h1>
    </header>
    <div className="contentBody">
      <video className="viewFinder productScannerCard" ref={videoRef} autoPlay muted playsInline/>
      {!error && !loading && warning.length > 0 && <ResultCard product={product!} warnings={warning}/>}
      {error && currentResult.toString()}
      {error && error}
    </div>
  </div>
}

function ResultCard({product, warnings}: { product: ProductInfo, warnings: FoodWarningReturn[] }) {
  const hasAWarning = warnings.map(value => value.has_warning).reduce((a, b) => a || b);
  return <DetailPopup warnings={warnings} product={product}>
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
      </div>
    </div>
  </DetailPopup>;
}

function PersonResult({warning}: { warning: FoodWarningReturn }) {
  const causeHint = warning
    .matching_allergens
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
  product: ProductInfo;
};

function DetailPopup({warnings, children, product}: DetailPopupProps) {
  return <Sheet>
    <SheetTrigger className="sheetTrigger">
      {children}
    </SheetTrigger>
    <SheetContent side="bottom" style={{backgroundColor: "white", height: "100%"}}>
      <SheetHeader>
        <SheetTitle className="sheetTitle">Details</SheetTitle>
      </SheetHeader>
      <div className="sheetContent">
        <DetailedProductInfos product={product} className="detailSection"/>
        <div className="detailSection">
          <h3 className="pd-subtitle">Personen:</h3>
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
                      {value.matching_ingredients.map(v => <div>{v}</div>)}
                      {value.matching_ingredients.map(v => <div>{v}</div>)}
                      {value.matching_ingredients.map(v => <div>{v}</div>)}
                      {value.matching_ingredients.map(v => <div>{v}</div>)}
                      <div>ENDE</div>
                    </div>
                  </div>
                </CarouselItem>
              )}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
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
