// Copyright 2018 Energy Web Foundation
//
// This file is part of the Origin Application brought to you by the Energy Web Foundation,
// a global non-profit organization focused on accelerating blockchain technology across the energy sector, 
// incorporated in Zug, Switzerland.
//
// The Origin Application is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// This is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY and without an implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details, at <http://www.gnu.org/licenses/>.
//
// @authors: slock.it GmbH, Heiko Burkhardt, heiko.burkhardt@slock.it

import * as React from 'react'

import { ProducingAsset, ConsumingAsset, Demand, User, AssetType, Certificate } from 'ewf-coo'
import { Web3Service } from '../utils/Web3Service'
import { OrganizationFilter } from './OrganizationFilter'
import { BrowserRouter, Route, Link, NavLink, Redirect } from 'react-router-dom'
import { Nav, NavItem } from 'react-bootstrap'
import FadeIn from 'react-fade-in'
import { ProducingAssetTable } from './ProducingAssetTable'
import { ConsumingAssetTable } from './ConsumingAssetTable'
import { PageContent } from '../elements/PageContent/PageContent'
import { ProducingAssetDetailView } from './ProducingAssetDetailView'
import { ConsumingAssetDetailView } from './ConsumingAssetDetailView'


export interface AssetProps {
    web3Service: Web3Service,
    certificates: Certificate[],
    producingAssets: ProducingAsset[],
    consumingAssets: ConsumingAsset[],
    currentUser: User,
    baseUrl: string,
    demands: Demand[]
}

export interface AssetState {

    switchedToOrganization: boolean

}


export class Asset extends React.Component<AssetProps, AssetState> {



    constructor(props) {
        super(props)

        this.state = {

            switchedToOrganization: false
        }

        this.switchToOrganization = this.switchToOrganization.bind(this)
        this.ConsumingAssetTable = this.ConsumingAssetTable.bind(this)
        this.ProducingAssetTable = this.ProducingAssetTable.bind(this)
        this.onFilterOrganization = this.onFilterOrganization.bind(this)

    }

    switchToOrganization(switchedToOrganization: boolean) {
        this.setState({
            switchedToOrganization: switchedToOrganization
        })
    }



    ProducingAssetTable() {
        return <ProducingAssetTable
            certificates={this.props.certificates}
            producingAssets={this.props.producingAssets}
            web3Service={this.props.web3Service}
            currentUser={this.props.currentUser}
            baseUrl={this.props.baseUrl}
            switchedToOrganization={this.state.switchedToOrganization}
        />
    }

    ConsumingAssetTable() {
        return <ConsumingAssetTable
            certificates={this.props.certificates}
            demands={this.props.demands}
            consumingAssets={this.props.consumingAssets}
            web3Service={this.props.web3Service}
            currentUser={this.props.currentUser}
            baseUrl={this.props.baseUrl}
            switchedToOrganization={this.state.switchedToOrganization}
        />
    }

    ProductionDetailView(id: number) {
        return <ProducingAssetDetailView
            id={id} baseUrl={this.props.baseUrl}
            producingAssets={this.props.producingAssets}
            web3Service={this.props.web3Service}
            certificates={this.props.certificates}
            addSearchField={true}
        />
    }

    ConsumingDetailView(id: number) {
        return <ConsumingAssetDetailView
            id={id} baseUrl={this.props.baseUrl}
            consumingAssets={this.props.consumingAssets}
            web3Service={this.props.web3Service}
            certificates={this.props.certificates}
        />
    }

    onFilterOrganization(index: number) {
        this.setState({
            switchedToOrganization: index !== 0
        })
    }

    render() {

        const organizations = this.props.currentUser ?
            ['All Organizations', this.props.currentUser.organization] :
            ['All Organizations']



        const AssetsMenu = [
            {
                key: 'production',
                label: 'Production List',
                component: this.ProducingAssetTable,
                buttons: [
                    {
                        type: 'dropdown',
                        label: 'All Organizations',
                        face: ['filter', 'icon'],
                        content: organizations
                    }
                ]
            }, {
                key: 'consumption',
                label: 'Consumption List',
                component: this.ConsumingAssetTable,
                buttons: [
                    {
                        type: 'dropdown',
                        label: 'All Organizations',
                        face: ['filter', 'icon'],
                        content: organizations
                    }
                ]
            }, {
                key: 'producing_detail_view',
                label: 'Production Detail',
                component: null
            }, {
                key: 'consuming_detail_view',
                label: 'Consumption Detail',
                component: null
            }
        ]



        return <div className='PageWrapper'>
            <div className='PageNav'>
                <Nav className='NavMenu'>
                    {

                        AssetsMenu.map((menu) => {
                            return (<li key={menu.key}><NavLink  to={`/${this.props.baseUrl}/assets/${menu.key}`} activeClassName='active'>{menu.label}</NavLink></li>)
                        })

                    }
                </Nav>
            </div>


            <Route path={'/' + this.props.baseUrl + '/assets/:key/:id?'} render={props => {
                const key = props.match.params.key
                const id = props.match.params.id
                const matches = AssetsMenu.filter(item => {
                    return item.key === key
                })
                if (matches.length > 0 && key === 'producing_detail_view') {
                    matches[0].component = () => this.ProductionDetailView(id ? parseInt(id, 10) : id)
                } else if (matches.length > 0 && key === 'consuming_detail_view') {
                    matches[0].component = () => this.ConsumingDetailView(id ? parseInt(id, 10) : id)
                }
                return (<PageContent onFilterOrganization={this.onFilterOrganization} menu={matches.length > 0 ? matches[0] : null} redirectPath={'/' + this.props.baseUrl + '/assets'} />)
            }} />
            <Route exact path={'/' + this.props.baseUrl + '/assets'} render={props => (<Redirect to={{ pathname: `/${this.props.baseUrl}/assets/${AssetsMenu[0].key}` }} />)} />
            <Route exact path={'/' + this.props.baseUrl + '/'} render={props => (<Redirect to={{ pathname: `/${this.props.baseUrl}/assets/${AssetsMenu[0].key}` }} />)} />

        </div>

    }

}