import { gql, useQuery } from "@apollo/client";

import { Stream } from "../types";

type StreamQuery = {
    stream: Stream;
};

const STREAM = gql`
    query stream($id: String!) {
        stream(id: $id) {
            id
            ratePerSecond
            recipient
            sender
            startTime
            stopTime
            timestamp
            deposit
            token {
                symbol
                decimals
                name
            }
            cancellation {
                recipientBalance
                senderBalance
                timestamp
                txhash
            }
            withdrawals {
                amount
                txhash
            }
        }
    }
`;

export function useStream({ id }) {
    const { data, error, loading } = useQuery<StreamQuery>(STREAM, {
        variables: { id: id },
        skip: !id,
    });
    return { data, error, loading }
}
