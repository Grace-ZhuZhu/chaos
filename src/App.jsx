import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Main } from './Main.jsx';
import { LSystem } from './lsystem/LSystem.jsx';

export default function App() {
    return (
        <main>
            <Switch>
                <Route exact path="/" component={Main} />
                <Route path="/lsystem" component={LSystem} />
            </Switch>
        </main>
    );
}
