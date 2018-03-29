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

import { Web3Service } from '../utils/Web3Service'
import { ProducingAsset, Certificate, Demand, User, EventHandlerManager, ContractEventHandler, ConsumingAsset } from 'ewf-coo'
import { ProducingAssetTable } from './ProducingAssetTable'
import { ConsumingAssetTable } from './ConsumingAssetTable'
import { Certificates } from './Certificates'
import { ProductionDetail } from './ProductionDetail'
import { DemandCreation } from './DemandCreation'
import { BrowserRouter, Route, Link } from 'react-router-dom'

import { Demands } from './Demands'
import { StoreState, Actions } from '../types'
import { Switch } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { Legal } from './Legal'
import { About } from './About'
import { Asset } from './Asset'
import { Admin } from './Admin'
import './AppContainer.scss'

interface AppContainerProps extends StoreState {
    actions: Actions
}

export class AppContainer extends React.Component<AppContainerProps, {}> {

    constructor(props) {
        super(props)


        this.CertificateTable = this.CertificateTable.bind(this)
        this.DemandTable = this.DemandTable.bind(this)
        this.ProductionDetail = this.ProductionDetail.bind(this)
        this.DemandCreation = this.DemandCreation.bind(this)
        this.Admin = this.Admin.bind(this)
        this.Asset = this.Asset.bind(this)
    }

    static SLEEP(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    async initEventHandler(web3Service: Web3Service) {
        const currentBlockNumber = await web3Service.blockchainProperties.web3.eth.getBlockNumber()


        const certificateContractEventHandler = new ContractEventHandler(web3Service.blockchainProperties.certificateLogicInstance, currentBlockNumber)
        certificateContractEventHandler.onEvent('LogRetireRequest', async (event) =>
            this.props.actions.certificateCreatedOrUpdated(
                await (new Certificate(parseInt(event.returnValues._certificateId, 10),
                                       this.props.web3Service.blockchainProperties).syncWithBlockchain()))
        )

        certificateContractEventHandler.onEvent('LogCreatedCertificate', async (event) =>
            this.props.actions.certificateCreatedOrUpdated(
                await (new Certificate(parseInt(event.returnValues._certificateId, 10),
                    this.props.web3Service.blockchainProperties).syncWithBlockchain()))
        )

        certificateContractEventHandler.onEvent('LogCertificateOwnerChanged', async (event) =>
            this.props.actions.certificateCreatedOrUpdated(
                await (new Certificate(parseInt(event.returnValues._certificateId, 10),
                                       this.props.web3Service.blockchainProperties).syncWithBlockchain()))
        )

        const demandContractEventHandler = new ContractEventHandler(web3Service.blockchainProperties.demandLogicInstance, currentBlockNumber)

        // demandContractEventHandler.onEvent('LogMatcherPropertiesUpdate', async (event) => {
        //     createOrUpdateDemand(event.returnValues._id)
        // })

        demandContractEventHandler.onEvent('LogDemandFullyCreated', async (event) =>
            this.props.actions.demandCreatedOrUpdated(
                await (new Demand(parseInt(event.returnValues._demandId, 10),
                                  this.props.web3Service.blockchainProperties).syncWithBlockchain())
            )
        )

        // demandContractEventHandler.onEvent('LogDemandExpired', async (event) => {
        //     createOrUpdateDemand(event.returnValues._index)
        // })

        const assetContractEventHandler = new ContractEventHandler(web3Service.blockchainProperties.producingAssetLogicInstance, currentBlockNumber)

        assetContractEventHandler.onEvent('LogNewMeterRead', async (event) =>
            this.props.actions.producingAssetCreatedOrUpdated(
                await (new ProducingAsset(parseInt(event.returnValues._assetId, 10),
                                          this.props.web3Service.blockchainProperties).syncWithBlockchain())
            )

        )

        assetContractEventHandler.onEvent('LogAssetFullyInitialized', async (event) =>
            this.props.actions.producingAssetCreatedOrUpdated(
                await (new ProducingAsset(parseInt(event.returnValues._assetId, 10),
                                          this.props.web3Service.blockchainProperties).syncWithBlockchain())
            )
        )

        assetContractEventHandler.onEvent('LogAssetSetActive', async (event) =>
            this.props.actions.producingAssetCreatedOrUpdated(
                await (new ProducingAsset(parseInt(event.returnValues._assetId, 10),
                                          this.props.web3Service.blockchainProperties).syncWithBlockchain())
            )
        )

        assetContractEventHandler.onEvent('LogAssetSetInactive', async (event) =>
            this.props.actions.producingAssetCreatedOrUpdated(
                await (new ProducingAsset(parseInt(event.returnValues._assetId, 10),
                                          this.props.web3Service.blockchainProperties).syncWithBlockchain())
            )
        )

        const eventHandlerManager = new EventHandlerManager(4000, web3Service.blockchainProperties)
        eventHandlerManager.registerEventHandler(certificateContractEventHandler)
        eventHandlerManager.registerEventHandler(demandContractEventHandler)
        eventHandlerManager.registerEventHandler(assetContractEventHandler)
        eventHandlerManager.start()
    }

    async componentDidMount() {

        const web3Service = new Web3Service((this.props as any).match.params.contractAddress)
        const accounts = await web3Service.web3.eth.getAccounts()

        await web3Service.initContract()
        this.props.actions.web3ServiceUpdated(web3Service)

        const currentUser = accounts.length > 0 ? await (new User(accounts[0], web3Service.blockchainProperties)).syncWithBlockchain() : null;

        (await ProducingAsset.GET_ALL_ASSETS(web3Service.blockchainProperties)).forEach((p: ProducingAsset) =>
            this.props.actions.producingAssetCreatedOrUpdated(p)
        );

        (await ConsumingAsset.GET_ALL_ASSETS(web3Service.blockchainProperties)).forEach((c: ConsumingAsset) =>
            this.props.actions.consumingAssetCreatedOrUpdated(c)
        );

        (await Demand.GET_ALL_ACTIVE_DEMANDS(web3Service.blockchainProperties)).forEach((d: Demand) =>
            this.props.actions.demandCreatedOrUpdated(d)
        );

        (await Certificate.GET_ALL_CERTIFICATES(web3Service.blockchainProperties)).forEach((c: Certificate) =>
            this.props.actions.certificateCreatedOrUpdated(c)
        )

        this.props.actions.currentUserUpdated(currentUser !== null && currentUser.active ? currentUser : null)

        this.initEventHandler(web3Service)

    }

    Asset() {
        return <Asset
            certificates={this.props.certificates}
            producingAssets={this.props.producingAssets}
            demands={this.props.demands}
            consumingAssets={this.props.consumingAssets}
            web3Service={this.props.web3Service}
            currentUser={this.props.currentUser}
            baseUrl={(this.props as any).match.params.contractAddress}
        />
    }

    CertificateTable() {
        return <Certificates
            baseUrl={(this.props as any).match.params.contractAddress}
            producingAssets={this.props.producingAssets}
            certificates={this.props.certificates}
            web3Service={this.props.web3Service}
            currentUser={this.props.currentUser}
        />
    }

    DemandTable() {
        return <Demands
            web3Service={this.props.web3Service}
            demands={this.props.demands}
            consumingAssets={this.props.consumingAssets}
            producingAssets={this.props.producingAssets}
            currentUser={this.props.currentUser}
            baseUrl={(this.props as any).match.params.contractAddress}
        />
    }

    Admin() {
        return <Admin
            web3Service={this.props.web3Service}
            currentUser={this.props.currentUser}
            baseUrl={(this.props as any).match.params.contractAddress}
        />
    }

    ProductionDetail(id: string) {
        const asset = this.props.producingAssets.find((a: ProducingAsset) => a.id === parseInt(id, 10))

        if (!asset) return null
        return <ProductionDetail web3Service={this.props.web3Service} producingAssets={asset} currentUser={this.props.currentUser} />
    }

    DemandCreation() {
        return <DemandCreation web3Service={this.props.web3Service} currentUser={this.props.currentUser} />
    }

    render() {
        if (this.props.web3Service == null) {
            return <div><p>loading...</p></div>
        }

        return <div className={`AppWrapper ${false ? 'Profile--open' : ''}`}>
            <Header currentUser={this.props.currentUser} baseUrl={(this.props as any).match.params.contractAddress} />
            <Switch>

                <Route path={'/' + (this.props as any).match.params.contractAddress + '/assets/'} component={this.Asset} />
                <Route path={'/' + (this.props as any).match.params.contractAddress + '/admin/'} component={this.Admin} />
                <Route path={'/' + (this.props as any).match.params.contractAddress + '/certificates'} component={this.CertificateTable} />
                <Route path={'/' + (this.props as any).match.params.contractAddress + '/demands'} component={this.DemandTable} />
                {(this.props as any).match.params.id !== 'all' ?
                    <Route path={'/' + (this.props as any).match.params.contractAddress + '/assets/*'} component={() => this.ProductionDetail((this.props as any).match.params.id)} /> : null
                }
                <Route path={'/' + (this.props as any).match.params.contractAddress + '/demandCreation'} component={this.DemandCreation} />
                <Route path={'/' + (this.props as any).match.params.contractAddress + '/legal'} component={Legal} />
                <Route path={'/' + (this.props as any).match.params.contractAddress + '/about'} component={About} />
                <Route path={'/' + (this.props as any).match.params.contractAddress} component={this.Asset} />

            </Switch>
            <Footer cooContractAddress={(this.props as any).match.params.contractAddress} />
        </div>

    }

}