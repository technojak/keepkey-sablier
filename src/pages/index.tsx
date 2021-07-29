import { Route, Switch } from "react-router-dom";

import { HomePage } from "./Home/Home";
import { StreamPage } from "./Stream/Stream";

export function Pages() {
    return (
        <Switch>
            <Route path="/stream/:id">
                <StreamPage />
            </Route>
            <Route exact path="/">
                <HomePage />
            </Route>
        </Switch>
    );
}
