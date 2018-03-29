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
import { ProducingAsset, Certificate, User, AssetType, Compliance, TimeFrame, Currency, Demand } from 'ewf-coo'
import { Web3Service } from '../utils/Web3Service'
import { OrganizationFilter } from './OrganizationFilter'
import { FullDemandProperties } from 'ewf-coo/build/ts/blockchain-facade/Demand'
import { Table } from '../elements/Table/Table'
import TableUtils from '../elements/utils/TableUtils'
import FadeIn from 'react-fade-in'
import { Nav, NavItem } from 'react-bootstrap'
import { BrowserRouter, Route, Link, NavLink, Redirect } from 'react-router-dom'
import { PageContent } from '../elements/PageContent/PageContent'
import { CertificateTable, SelectedState } from './CertificateTable'

export interface CertificatesProps {
    web3Service: Web3Service,
    certificates: Certificate[],
    producingAssets: ProducingAsset[],
    currentUser: User,
    baseUrl: string

}

export interface CertificatesState {

    switchedToOrganization: boolean

}


export class Certificates extends React.Component<CertificatesProps, CertificatesState> {



    constructor(props) {
        super(props)

        this.state = {

            switchedToOrganization: false
        }


        this.switchToOrganization = this.switchToOrganization.bind(this)
        this.onFilterOrganization = this.onFilterOrganization.bind(this)

    }

    switchToOrganization(switchedToOrganization: boolean) {
        this.setState({
            switchedToOrganization: switchedToOrganization
        })
    }







    CertificateTable(key) {
        return <CertificateTable
            web3Service={this.props.web3Service}
            certificates={this.props.certificates}
            producingAssets={this.props.producingAssets}
            currentUser={this.props.currentUser}
            baseUrl={this.props.baseUrl}
            selectedState={key}
            switchedToOrganization={this.state.switchedToOrganization}
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

        const CertificatesMenu = [
            {
                key: 'claims_report',
                label: 'Claims Report',
                component: () => this.CertificateTable(SelectedState.Claimed),
                buttons: [
                    {
                        type: 'dropdown',
                        label: 'All Organizations',
                        face: ['filter', 'icon'],
                        content: organizations
                    }
                ]
            }, {
                key: 'for_sale',
                label: 'For Sale',
                component: () => this.CertificateTable(SelectedState.ForSale),
                buttons: [
                    {
                        type: 'dropdown',
                        label: 'All Organizations',
                        face: ['filter', 'icon'],
                        content: organizations
                    }
                ]
            }, {
                key: 'bought_sold',
                label: 'Bought / Sold',
                component: () => this.CertificateTable(SelectedState.Sold),
                buttons: [
                    {
                        type: 'dropdown',
                        label: 'All Organizations',
                        face: ['filter', 'icon'],
                        content: organizations
                    }
                ]
            }
        ]

        return <div className='PageWrapper'>
            <div className='PageNav'>
                <Nav className='NavMenu'>
                    {
                        CertificatesMenu.map((menu, index) => {
                            return (<li key={index}><NavLink exact to={`/${this.props.baseUrl}/certificates/${menu.key}`} activeClassName='active'>{menu.label}</NavLink></li>)
                        })

                    }
                </Nav>
            </div>



            <Route path={'/' + this.props.baseUrl + '/certificates/:key'} render={props => {
                const key = props.match.params.key
                const matches = CertificatesMenu.filter(item => {
                    return item.key === key
                })
                return (<PageContent onFilterOrganization={this.onFilterOrganization} menu={matches.length > 0 ? matches[0] : null} redirectPath={'/' + this.props.baseUrl + '/certificates'} />)
            }} />
            <Route exact path={'/' + this.props.baseUrl + '/certificates'} render={props => (<Redirect to={{ pathname: `/${this.props.baseUrl}/certificates/${CertificatesMenu[0].key}` }} />)} />
            <Route exact path={'/' + this.props.baseUrl + '/'} render={props => (<Redirect to={{ pathname: `/${this.props.baseUrl}/certificates/${CertificatesMenu[0].key}` }} />)} />


        </div>

    }

}