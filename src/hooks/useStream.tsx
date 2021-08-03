import { gql, useQuery } from "@apollo/client";

import { Stream } from "../types";

type StreamQuery = {
    stream: Stream;
};

type UseStreamProps = {
    id: string|null;
}

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

export function useStream({ id }: UseStreamProps) {
    const { data, error, loading } = useQuery<StreamQuery>(STREAM, {
        variables: { id: id },
        skip: !id,
    });
    return { data, error, loading }
}
