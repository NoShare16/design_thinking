import type {SVGAttributes} from "react";

export default function DiamondAlertIcon(props: SVGAttributes<SVGElement>) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              className="lucide lucide-triangle-alert-icon lucide-triangle-alert"
    {...props}
  >
    <path
      d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41L13.7 2.71a2.41 2.41 0 0 0-3.41 0z"/>
    <path d="M12 7v5" />
    <path d="M12 17h.01"/>
  </svg>;
}
