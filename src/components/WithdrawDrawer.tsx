import {
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Input,
} from "@chakra-ui/react";
import { useState } from "react";

import { useWithdraw } from "../context/WithdrawProvider";

export function WithdrawDrawer({ id }: any) {
    const [claimAmount, setClaimAmount] = useState('0')
    const { isOpen, onClose, handleWithdrawal } = useWithdraw();

    return (
        <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Create your account</DrawerHeader>

                <DrawerBody>
                    <Input placeholder="Type here..." onChange={(e) => setClaimAmount(e.target.value)} value={claimAmount} />
                </DrawerBody>

                <DrawerFooter>
                    <Button
                        colorScheme="secondary"
                        variant="outline"
                        mr={3}
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button onClick={() => handleWithdrawal({ claimAmount, id })}>Withdraw</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
