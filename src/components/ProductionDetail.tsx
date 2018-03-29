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
import { ProducingAsset, User, Demand } from 'ewf-coo'
import { Web3Service } from '../utils/Web3Service'
import { MapContainer } from './MapContainer'
export interface DetailTableProps {
    web3Service: Web3Service,
    producingAssets: ProducingAsset,
    currentUser: User
}

export interface EnrichedAssetData {
    producingAsset: ProducingAsset,
    owner: User
}

export interface ProductionDetailState {
    enrichedAssetData: EnrichedAssetData
}

enum AssetType {
    Wind,
    Solar,
    RunRiverHydro,
    BiomassGas
}

enum Compliance {
    none,
    IREC,
    EEC,
    TIGR
}

export class ProductionDetail extends React.Component<DetailTableProps, {}> {

    state: ProductionDetailState

    constructor(props) {
        super(props)
        this.state = {
            enrichedAssetData: null
        }

    }

    async componentDidMount() {
        await this.enrichData(this.props)
    }

    async componentWillReceiveProps(newProps: DetailTableProps) {
        await this.enrichData(newProps)
    }

    async enrichData(props: DetailTableProps) {

        if (!this.state.enrichedAssetData || this.state.enrichedAssetData.producingAsset.id !== props.producingAssets.id) {
            this.setState({
                enrichedAssetData: {
                    producingAsset: props.producingAssets,
                    owner: await (new User(props.producingAssets.owner, props.web3Service.blockchainProperties)).syncWithBlockchain()
                }
            })
        }
    }

    render() {

        if (!this.state.enrichedAssetData) {
            return null
        }
        const asset: ProducingAsset = this.props.producingAssets

        console.log(asset)
        return <div className='container'>
            <h4>General</h4>
            <div className='row'>
                <div className='col-3'>
                    AssetType
                </div>
                <div className='col-9'>
                    {AssetType[asset.assetType]}
                </div>
            </div>
            <div className='row'>
                <div className='col-3'>
                    Owner
                </div>
                <div className='col-9'>
                    {this.state.enrichedAssetData.owner.organization}
                </div>
            </div>
            <div className='row'>
                <div className='col-3'>
                    Start date of commissioning of asset:
                </div>
                <div className='col-9'>
                    {(new Date(asset.operationalSince * 1000)).toDateString()}
                </div>
            </div>
            <div className='row'>
                <div className='col-3'>
                    Max Capacity in MW:                </div>
                <div className='col-9'>
                    {(asset.capacityWh / 1000000).toFixed(3)}
                </div>
            </div>

            <h4> Location </h4>
            <div className='row'>
                <div className='col-3'>
                    Geo-Coordinates:           </div>
                <div className='col-9'>
                    {asset.gpsLatitude},{asset.gpsLongitude}
                </div>
            </div>
            <div className='row'>
                <div className='col-3'>
                    Town:         </div>
                <div className='col-9'>
                    {asset.city}
                </div>
            </div>
            <div className='row'>
                <div className='col-3'>
                    Country:         </div>
                <div className='col-9'>
                    {asset.country}
                </div>
            </div>
            <h4> Compliance </h4>
            <div className='row'>
                <div className='col-3'>
                    Certified by Registry:        </div>
                <div className='col-9'>
                    {Compliance[asset.complianceRegistry]}
                </div>
            </div>
            <div className='row'>
                <div className='col-3'>
                    Other Green Attributes:        </div>
                <div className='col-9'>
                    {asset.otherGreenAttributes}
                </div>
            </div>
            <div className='row'>
                <div className='col-3'>
                    Type of Public Support        </div>
                <div className='col-9'>
                    {asset.typeOfPublicSupport}                </div>
            </div>

            <h4> Tags </h4>
            <div className='row'>
                <div className='col-3'>
                    Sold Tags in KWh:        </div>
                <div className='col-9'>
                    {(asset.certificatesCreatedForWh / 1000).toFixed(3)}              </div>
            </div>
            <div className='row'>
                <div className='col-3'>
                    Tags for Sale in kWh:       </div>
                <div className='col-9'>
                    {((asset.lastSmartMeterReadWh - asset.certificatesCreatedForWh) / 1000).toFixed(3)}             </div>
            </div>
            <div className='row'>
                <div className='col-3'>
                    CO2 Avoided in KG/MWh      </div>
                <div className='col-9'>
                    {asset.cO2UsedForCertificate}           </div>
            </div>
            <MapContainer producingAssets={asset} />
        </div>

    }

}
