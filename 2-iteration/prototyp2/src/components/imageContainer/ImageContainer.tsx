import "./ImageContainer.css"

export interface ImageContainerProps {
  children: HTMLImageElement | any
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
