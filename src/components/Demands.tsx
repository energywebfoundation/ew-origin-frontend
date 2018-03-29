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
import { ProducingAsset, Certificate, ConsumingAsset, User, AssetType, Compliance, TimeFrame, Currency, Demand } from 'ewf-coo'
import { Web3Service } from '../utils/Web3Service'
import { OrganizationFilter } from './OrganizationFilter'
import { FullDemandProperties } from 'ewf-coo/build/ts/blockchain-facade/Demand'
import { Table } from '../elements/Table/Table'
import TableUtils from '../elements/utils/TableUtils'
import FadeIn from 'react-fade-in'
import { Nav, NavItem } from 'react-bootstrap'
import { BrowserRouter, Route, Link, NavLink, Redirect } from 'react-router-dom'
import { PageContent } from '../elements/PageContent/PageContent'
import { DemandTable } from './DemandTable'

import '../../assets/common.scss'


export interface DemandsProps {
  web3Service: Web3Service,
  demands: Demand[],
  producingAssets: ProducingAsset[],
  consumingAssets: ConsumingAsset[],
  currentUser: User,
  baseUrl: string

}

export interface DemandState {

  switchedToOrganization: boolean

}


export class Demands extends React.Component<DemandsProps, DemandState> {

  constructor(props) {
    super(props)

    this.state = {

      switchedToOrganization: false
    }

    this.onFilterOrganization = this.onFilterOrganization.bind(this)

  }

  onFilterOrganization(index: number) {
    this.setState({
      switchedToOrganization: index !== 0
    })
  }


  DemandTable(key) {
    return <DemandTable
      web3Service={this.props.web3Service}
      producingAssets={this.props.producingAssets}
      currentUser={this.props.currentUser}
      selected={key}
      demands={this.props.demands}
      consumingAssets={this.props.consumingAssets}
      switchedToOrganization={this.state.switchedToOrganization}
    />
  }


  render() {

    const organizations = this.props.currentUser ?
      ['All Organizations', this.props.currentUser.organization] :
      ['All Organizations']

    const DemandsMenu = [
      {
        key: 'buy',
        label: 'Buy',
        component: () => this.DemandTable('buy'),
        buttons: [
          {
            type: 'date-range',
          },
          {
            type: 'dropdown',
            label: 'All Organizations',
            face: ['filter', 'icon'],
            content: organizations
          },
          {
            type: 'dropdown',
            label: 'All Status',
            face: [],
            content: [
              'Open',
              'Fullfilled',
              'All',
            ]
          },
        ]
      }, {
        key: 'sell',
        label: 'Sell',
        component: () => this.DemandTable('sell'),
        buttons: [
          {
            type: 'date-range',
          },
          {
            type: 'dropdown',
            label: 'All Organizations',
            face: ['filter', 'icon'],
            content: organizations
          },
          {
            type: 'dropdown',
            label: 'All Status',
            face: [],
            content: [
              'Open',
              'Fullfilled',
              'All',
            ]
          },
        ]
      }
    ]

    return <div className='PageWrapper'>
      <div className='PageNav'>
        <Nav className='NavMenu'>
          {
            DemandsMenu.map((menu, index) => {
              return (<li key={menu.key} ><NavLink exact to={`/${this.props.baseUrl}/demands/${menu.key}`} activeClassName='active'>{menu.label}</NavLink></li>)
            })

          }
        </Nav>
      </div>





      <Route path={'/' + this.props.baseUrl + '/demands/:key'} render={props => {
        const key = props.match.params.key
        const matches = DemandsMenu.filter(item => {
          return item.key === key
        })
        return (<PageContent onFilterOrganization={this.onFilterOrganization} menu={matches.length > 0 ? matches[0] : null} redirectPath={'/' + this.props.baseUrl + '/demands'} />)
      }} />
      <Route exact path={'/' + this.props.baseUrl + '/demands'} render={props => (<Redirect to={{ pathname: `/${this.props.baseUrl}/demands/${DemandsMenu[0].key}` }} />)} />
      <Route exact path={'/' + this.props.baseUrl + '/'} render={props => (<Redirect to={{ pathname: `/${this.props.baseUrl}/demands/${DemandsMenu[0].key}` }} />)} />

    </div>

  }

}