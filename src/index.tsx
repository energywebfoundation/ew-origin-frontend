/**
 * this file is part of bundesblock-voting
 *
 * it is subject to the terms and conditions defined in
 * the 'LICENSE' file, which is part of the repository.
 *
 * @author Heiko Burkhardt
 * @copyright 2018 by Slock.it GmbH
 */

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom'
import { AppContainer } from './components/AppContainer'
import { Onboarding } from './components/Onboarding'
import { Provider } from 'react-redux'
import { createStore, Reducer } from 'redux'
import { StoreState } from './types'
import reducer from './reducers'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {certificateCreatedOrUpdated, currentUserUpdated, consumingAssetCreatedOrUpdated, demandCreatedOrUpdated, producingAssetCreatedOrUpdated, web3ServiceUpdated} from './actions'
import './index.scss'



const store = createStore<any,any,any,any>(reducer);

const mapDispatchToProps = (dispatch) => ({
        actions: bindActionCreators({ certificateCreatedOrUpdated, currentUserUpdated, consumingAssetCreatedOrUpdated, demandCreatedOrUpdated, producingAssetCreatedOrUpdated, web3ServiceUpdated}, dispatch)
})
  
const mapStateToProps = (state) => {
    return state
}

// const {whyDidYouUpdate} = require('why-did-you-update')
// whyDidYouUpdate(React)
  

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <Switch>
                <Route exact path='/' component={connect(mapStateToProps, mapDispatchToProps)(Onboarding)} />
                <Route path='/:contractAddress/' component={connect(mapStateToProps, mapDispatchToProps)(AppContainer)} />
            </Switch>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
)