import { Web3Service } from '../utils/Web3Service'
import { ProducingAsset, Certificate, Demand, User, EventHandlerManager, ContractEventHandler, ConsumingAsset } from 'ewf-coo'


export interface StoreState {
    web3Service: Web3Service,
    producingAssets: ProducingAsset[],
    consumingAssets: ConsumingAsset[],
    certificates: Certificate[],
    demands: Demand[],
    currentUser: User
}

export interface Actions {
    certificateCreatedOrUpdated: Function,
    currentUserUpdated: Function,
    consumingAssetCreatedOrUpdated: Function,
    demandCreatedOrUpdated: Function,
    producingAssetCreatedOrUpdated: Function,
    web3ServiceUpdated: Function
}
