import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Main } from './Main.jsx';
import { LSystemContainer } from './lsystem/LSystemContainer.jsx';
import { MandelbrotJuliasetContainer } from './mandelbrot/MandelbrotJuliasetContainer.jsx';

export default function App() {
    return (
        <main>
            <Switch>
                <Route exact path="/" component={Main} />
                <Route path="/lsystem" component={LSystemContainer} />
                <Route path="/mandelbrot" component={MandelbrotJuliasetContainer} />
            </Switch>
        </main>
    );
}
