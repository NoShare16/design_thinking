import "./ImageContainer.css"
import type {ReactNode} from "react";

export interface ImageContainerProps {
  children: ReactNode
}

export default function ImageContainer({children}: ImageContainerProps) {
  return <div className="imageContainer">
    <div className="backdrop">
      {children}
    </div>
    <div className="content">
      {children}
    </div>
  </div>
}
