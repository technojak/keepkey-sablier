import React, { useMemo, useReducer } from "react";

import { useInterval } from "../hooks/useInterval";
import { useStream } from "../hooks/useStream";
import { formatStream, FormattedStream } from "../lib/stream.utils";

type StreamState = {
    id: null | string;
};

type StreamActions = 
    | { type: "SET_STREAM_ID"; payload: string }
    | { type: "SET_STREAM"; payload: FormattedStream|null };

type StreamContextProps = StreamState & {
    setStreamId(id: string): void;
};

type StreamProviderProps = {
    children: React.ReactNode;
};

const reducer = (state: StreamState, action: StreamActions) => {
    switch (action.type) {
        case "SET_STREAM_ID":
            return { ...state, id: action.payload };
        case "SET_STREAM":
            return { ...state, stream: action.payload };
        default:
            return state;
    }
};

const noop = () => {};

export const StreamContext = React.createContext<StreamContextProps>({
    id: null,
    setStreamId: noop,
});

export function StreamProvider({ children }: StreamProviderProps) {
    const [state, dispatch] = useReducer(reducer, {
        id: null,
        stream: {} as FormattedStream
    });

    const { data, loading, error } = useStream({ id: state.id })

    useInterval(() => {
        dispatch({ type: "SET_STREAM", payload: formatStream(data?.stream) })
    }, 1000)

    const context = useMemo(() => ({
        ...state,
        loading,
        error,
        setStreamId: (id: string) => dispatch({ type: "SET_STREAM_ID", payload: id }),
    }), [
        state,
        loading,
        error,
    ]);

    return (
        <StreamContext.Provider value={context}>
            {children}
        </StreamContext.Provider>
    );
}
