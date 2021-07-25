import { Image } from "@chakra-ui/react";

import logo from "../assets/sablier-logo.svg";

export function SablierLogo() {
    return (
        <Image alt="Sablier logo" src={logo} w={24} />
    );
}
