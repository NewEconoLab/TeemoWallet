
import * as React from 'react';
import { Switch, HashRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
// import Layout from './containers/layout/index';
import routes from './routers';

export default () => {
    return (
        <HashRouter>
            {/* <Layout> */}
                <Switch>
                    {renderRoutes(routes) }
                </Switch>
            {/* </Layout> */}
        </HashRouter>
    );
};
