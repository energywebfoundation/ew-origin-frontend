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

import { Certificate, Demand, ProducingAsset, ConsumingAsset, User } from 'ewf-coo'
import { Web3Service } from '../utils/Web3Service'

export enum Actions {
    certificateCreatedOrUpdated = 'CERTIFICATE_CREATED_OR_UPDATED',
    demandCreatedOrUpdated = 'DEMAND_CREATED_OR_UPDATED',
    producingAssetCreatedOrUpdated = 'PRODUCING_ASSET_CREATED_OR_UPDATED',
    consumingAssetCreatedOrUpdated = 'CONSUMING_ASSET_CREATED_OR_UPDATED',
    currentUserUpdated = 'CURRENT_USER_UPDATED',
    web3ServiceUpdated = 'WEB3_SERVICE_UPDATED'

}


export const certificateCreatedOrUpdated = (certificate: Certificate) => ({
    type: Actions.certificateCreatedOrUpdated,
    certificate
})

export const demandCreatedOrUpdated = (demand: Demand) => ({
    type: Actions.demandCreatedOrUpdated,
    demand
})

export const producingAssetCreatedOrUpdated = (producingAsset: ProducingAsset) => ({
    type: Actions.producingAssetCreatedOrUpdated,
    producingAsset
})

export const consumingAssetCreatedOrUpdated = (consumingAsset: ConsumingAsset) => ({
    type: Actions.consumingAssetCreatedOrUpdated,
    consumingAsset
})

export const currentUserUpdated = (user: User) => ({
    type: Actions.currentUserUpdated,
    user
})

export const web3ServiceUpdated = (web3Service: Web3Service) => ({
    type: Actions.web3ServiceUpdated,
    web3Service
})

