import { ApolloProvider } from "@apollo/client";
import { ChakraProvider, CSSReset } from "@chakra-ui/react";
import { BrowserRouter as Router } from "react-router-dom";

import { Layout } from "./components/Layout";
import { WalletProvider } from "./context/WalletProvider";
import { WithdrawProvider } from "./context/WithdrawProvider";
import { client } from "./lib/apollo";
import { Pages } from "./pages";
import { theme } from "./theme";

export function App() {
    return (
        <ChakraProvider theme={theme}>
            <ApolloProvider client={client}>
                <Router>
                    <WalletProvider>
                        <WithdrawProvider>
                            <CSSReset />
                            <Layout>
                                <Pages />
                            </Layout>
                        </WithdrawProvider>
                    </WalletProvider>
                </Router>
            </ApolloProvider>
        </ChakraProvider>
    );
}
