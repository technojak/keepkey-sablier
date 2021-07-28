import { Route, Switch } from "react-router-dom";

import { Home } from "./Home/Home";
import { StreamClaim } from "./StreamClaim/StreamClaim";

export function Pages() {
    return (
        <Switch>
            <Route path="/stream/:id">
                <StreamClaim />
            </Route>
            <Route exact path="/">
                <Home />
            </Route>
        </Switch>
    );
}
