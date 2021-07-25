/**
 * Generic type for ERC-20 tokens.
 */
export type Token = {
    // The contract address
    id: string;
    // The ERC-20 decimals
    decimals: number;
    // The ERC-20 name
    name: string;
    // The ERC-20 symbol
    symbol: string;
}

/**
 * Generic type for Sablier cancellations.
 */
export type Cancellation = {
    // The same as the stream id
    id: string;
    // Amount of tokens the recipient was distributed
    recipientBalance: string;
    // Amount of tokens the sender was distributed
    senderBalance: string;
    // The time when the cancellation was made
    timestamp: string;
    // The token used for payment
    token: Token
    // Transaction hash
    txhash: string;
}

/**
 * Needed for retroactively indexing cancellations and withdrawals for v1.0.0 streams.
 */
export type StreamToSalary = {
    // The stream id
    id: string;
    // The salary id
    salaryId: number;
}

export type StreamTransaction = {
    // Transaction hash concatenated with log index
    id: string;
    // Block number
    block: number;
    // The name of the event emitted
    event: string;
    // The caller, or msg.sender
    from: string;
    // The stream entity associated with this transaction
    stream: Stream;
    // Block timestamp
    timestamp: string;
    // The contract address
    to: string;
    // Transaction hash
    txhash: string;
}

/**
 * Generic type for Sablier withdrawals.
 */
export type Withdrawal = {
    // Transaction hash concatenated with log index
    id: string;
    // How many tokens were withdrawn
    amount: string;
    // The stream entity associated with this withdrawal
    stream: Stream;
    // The time when the cancellation was made
    timestamp: string;
    // The token used for payment
    token: Token
    // Transaction hash
    txhash: string;
}

/**
 * Generic type for Sablier streams.
 */
export type Stream = {
    // Details about cancellation time and the distributed amounts
    cancellation: Cancellation
    deposit: string;
    // The salary id in v1.0.0 and the actual stream id in v1.1.0
    id: number;
    // How much is being streamed every second
    ratePerSecond: string;
    // The address of the recipient account
    recipient: string;
    // The address of the sender account, who created the streamed
    sender: string;
    // The time when the stream commences
    startTime: string;
    // The time when the stream stops
    stopTime: string;
    // The time when the stream was created
    timestamp: string;
    // The token used for payment
    token: Token
    // Exhaustive list of all transactions that interacted with the stream
    txs: StreamTransaction[]
    // Exhaustive list of all withdrawals made from the stream
    withdrawals: Withdrawal[]
}
