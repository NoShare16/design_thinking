import "./ProductScanner.css"
import {ArrowLeft} from "lucide-react";

export interface ProductScannerProps {

}

export default function ProductScanner(props: ProductScannerProps) {
  return <div className="productScannerScreen">
    <div className="header">
      <ArrowLeft/>
      <h1>ProductScanner</h1>
    </div>
    <div className="contentBody">

      <div className="cameraCenter">
        <video>

        </video>
      </div>

      <div className="productInfo">
        <div className="body">
          <div className="title"></div>
          <div className="contents">
            <div className="allergens"></div>
            <div className="ingredients"></div>
          </div>
        </div>
        {/*TODO figure out what to do with weird aspect ratios (Idea 1: Image Blur effect in background)*/}
        <div className="imageContainer"></div>
      </div>

      {/*TODO this has to be clickable into a popout view because the cause lists could be pretty long*/}
      <div className="result">
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
    </div>
  </div>
}
