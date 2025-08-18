import type {SVGAttributes} from "react";

export default function AlertIconBare(props: SVGAttributes<any>) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
       className="lucide lucide-triangle-alert-icon lucide-triangle-alert"
    {...props}
  >
    <path d="M12 2v9"/>
    <path d="M12 20 v1"/>
  </svg>;
}
