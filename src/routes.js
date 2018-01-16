import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './app';
import Home from './pages/home';
import Singlejob from './pages/job';
import Login from './pages/login';
import NotFound from './pages/404';
import About from './pages/About';
import ManageJobPage from './pages/manageJobPage';
import { loadUser } from './shared/http';
import { createError } from './actions/error';
import { loginSuccess } from './actions/auth';
import { getFirebaseUser, getFirebaseToken } from './backend/auth';
import configureStore from './store/configureStore';
import { isServer } from './utils/environment';

const store = configureStore();
/**
 * This React Router onenter hook helps determine if there's a currently-authenticated user or not
 * @method requireUser
 * @module letters/components
 * @param  {object}    nextState next react router Location descriptor
 * @param  {Function}  replace   replace function
 * @param  {Function}  callback  callback to invoke when ready to transition
 * @return {void}
 */
// We're using the new async/await syntax here:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
async function requireUser(nextState, replace, callback) {
    try {
        // Check to see if there's a currently-authenticated user
        const { user: { authenticated } } = store.getState();
        const isOnLoginPage = nextState.location.pathname === '/login';
        // If there is, we can allow the migration
        if (authenticated) {
            return callback();
        }
        // Otherwise, check firebase to see if there's a user logged in
        const firebaseUser = await getFirebaseUser();
        const fireBaseToken = await getFirebaseToken();
        const noUser = !firebaseUser || !fireBaseToken;
        if (noUser && !isOnLoginPage && !isServer()) {
            replace({
                pathname: '/login'
            });
            return callback();
        }
        // If there's no user BUT we're on the login page, proceed
        if (noUser && isOnLoginPage) {
            return callback();
        }
        // We need to load the actual user, so do so here
        const user = await loadUser(firebaseUser.uid).then(res => res.json());
        store.dispatch(loginSuccess(user, fireBaseToken));
        return callback();
    } catch (err) {
        store.dispatch(createError(err));
        return callback(err);
    }
}

/**
 * Routes configuration
 * @module letters/components
 */
export const routes = (
    <Route path="/" component={App}>
        <IndexRoute component={Home} onEnter={requireUser} />
        <Route path="/jobs/:jobId" component={Singlejob} onEnter={requireUser} />
        <Route path="/job"  component={ManageJobPage} onEnter={requireUser} />
        <Route path="/login" component={Login} />
        <Route path="/about"  component={About} />
        <Route path="*" component={NotFound} />
    </Route>
);
