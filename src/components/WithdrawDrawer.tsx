import {
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    FormControl,
    FormHelperText,
    FormLabel,
    Input,
} from "@chakra-ui/react";
import BigNumber from "bignumber.js";
import { useState } from "react";
import { useRouteMatch } from "react-router-dom";

import { useWithdraw } from "../context/WithdrawProvider";

export function WithdrawDrawer() {
    const [amount, setAmount] = useState<string>('')
    const [transaction, setTransaction] = useState<any>(null)
    const [withdrawalTx, setWithdrawalTx] = useState<any>(null)
    const { isOpen, onClose, buildtx, withdrawal } = useWithdraw();
    const match = useRouteMatch<{id: string}>('/stream/:id')

    const handleBuildTx = async () => {
        if (amount && match) {
            const tx = await buildtx({ amount, id: match.params.id })
            setTransaction(tx)
        }
    }

    const handleWithdrawal = async () => {
        if (amount && match) {
            const tx = await withdrawal({ amount, id: match.params.id })
            setWithdrawalTx(tx)
        }
    }

    return (
        <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Create your account</DrawerHeader>
                <DrawerBody>
                    <FormControl id="id" mb={4}>
                        <FormLabel>Stream ID</FormLabel>
                        <Input disabled value={match?.params.id} />
                    </FormControl>
                    <FormControl id="amount" mb={4}>
                        <FormLabel>Withdrawal Amount</FormLabel>
                        <Input onChange={(e) => setAmount(e.target.value)} value={amount} />
                        <FormHelperText>Number of tokens you want to withdrawal</FormHelperText>
                    </FormControl>
                    {transaction && (
                        <FormControl id="estimatedGas" mb={4}>
                            <FormLabel>Estimated Gas (ETH)</FormLabel>
                            <Input disabled value={new BigNumber(transaction.estimatedFee).div('1e+18').toString()} />
                        </FormControl>
                    )}
                    {withdrawalTx && (
                        <Box>{withdrawalTx.hash}</Box>
                    )}
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
                    {transaction 
                        ? <Button onClick={handleWithdrawal}>Withdrawal</Button>
                        : <Button onClick={handleBuildTx}>Build Transaction</Button>}
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
