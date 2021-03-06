import { Image } from "@chakra-ui/react";
import logo from "src/assets/sablier-logo.svg";

export function SablierLogo() {
    return <Image display="inline-block" alt="Sablier logo" src={logo} w={24} />;
}
