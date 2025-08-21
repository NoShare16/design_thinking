import ImageContainer from "@/components/imageContainer/ImageContainer.tsx";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/shadcn/components/ui/resizable.tsx";

export interface ImageBlutTestProps {

}

export default function ImageBlutTest(props: ImageBlutTestProps) {
  return <ResizablePanelGroup direction="vertical" style={{width:"100%", height:"90vh", flex: 1}} >
    <ResizablePanel defaultSize={50}>
    <ImageContainer>
      <img src="../../assets/20250815_212311.jpg" alt=""/>
    </ImageContainer>
  </ResizablePanel>
    <ResizableHandle/>
    <ResizablePanel/>
  </ResizablePanelGroup>
}
