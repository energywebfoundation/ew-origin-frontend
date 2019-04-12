import * as React from 'react'
import { SearchkitManager, SearchkitProvider, Layout, TopBar, SearchBox, LayoutBody, SideBar, HierarchicalMenuFilter, RefinementListFilter, LayoutResults, ActionBar, ActionBarRow, HitsStats, SelectedFilters, ResetFilters, Hits, NoHits } from 'searchkit'

import './AllAssetsView.scss'
import { throws } from 'assert';
import { Web3Service } from '../utils/Web3Service';

const Web3 = require('web3')
const espw = "read:" + process.env.REACT_APP_KONG_ES_PW
const searchkit = new SearchkitManager("http://es-kong/charging-stations", {
    basicAuth: espw
})
const HOST = 'ew-origin'
const PORT = 3003
const CONNECTOR_ID = 1

export interface ControlButtonProps {
    lastStatus: string
    serialNumber: string
    selectedAddress: string
}

class ControlButton extends React.Component<ControlButtonProps, {}> {

    constructor(props) {
        super(props)

        this.state = {
            working: false
        }
    
        this.toggleStation = this.toggleStation.bind(this)
    }

    toggleStation() {
        event.preventDefault()
        if (this.state['working'] || this.stationIsLocked()) {
            return
        }
        this.setState({
            working: true
        })
        const command = this.stationIsCharging() ? 'stop_transaction' : 'start_transaction'
        const post_data = {
            command: command,
            cs_id: this.props.serialNumber,
            tag_id: 1, //this.props.selectedAddress,
            received: false
        }
        const device_address = 'http://' + HOST + ':' + PORT + '/control'
        fetch(device_address, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(post_data)
        }).then(res => {
            res.json().then(data => {
                this.setState({
                    working: false
                })
                // refresh the es data
                //searchkit.reloadSearch()
                // refresh again in case the data was not updated in the previous response yet
                //setTimeout(() => searchkit.reloadSearch(), 1000)
            })
        })
    }

    stationIsLocked() {
        const lockedStatus = ['Starting', 'Available', 'Finishing']
        return lockedStatus.indexOf(this.props.lastStatus) > -1
    }

    stationIsCharging() {
        // todo: add real names for on status
        const onStatus = ['Preparing']
        // Starting, Available, Finishing turn off button
        return onStatus.indexOf(this.props.lastStatus) > -1
    }

    render() {
        var buttonText = "On"
        var buttonClass = "primary"
        if (this.stationIsCharging()) {
            buttonText = "Off"
        }
        if (this.state['working']) {
            buttonText = "Turning " + buttonText + "..."
            buttonClass = "disabled"
        } else {
            buttonText = "Turn " + buttonText
        }
        if (this.stationIsLocked()) {
            buttonText = "Locked"
            buttonClass = "disabled"
        }
        return (
            <div className="AllAssets">
                <form>
                    <button onClick={this.toggleStation} className={buttonClass}>{buttonText}</button>
                </form>
            </div>
        )
    }
}

class AssetHitsTable extends React.Component<any, {}> {
    constructor(props) {
        super(props)

        setInterval(() => searchkit.reloadSearch(), 1000)
    }

    render() {
        return (
            <div style={{width: '100%', boxSizing: 'border-box', padding: 8}}>
            <table className="sk-table sk-table-striped" style={{width: '100%', boxSizing: 'border-box'}}>
                <thead>
                <tr>
                    <th>Meter Serial Number</th>
                    <th>Status</th>
                    <th>Last Seen</th>
                    <th>Control</th>
                </tr>
                </thead>
                <tbody>
                {
                    this.props['hits'].map((hit) =>
                    <tr key={hit._id}>
                        <td>{hit._source.metadata.meterSerialNumber}</td>
                        <td>{hit._source.connectors[CONNECTOR_ID].last_status}</td>
                        <td>{hit._source.last_seen}</td>
                        <td>
                            <ControlButton
                                lastStatus={hit._source.connectors[CONNECTOR_ID].last_status}
                                serialNumber={hit._source.metadata.meterSerialNumber}
                                selectedAddress={this.props.selectedAddress} />
                            </td>
                    </tr>
                    )
                }
                </tbody>
            </table>
            </div>
        )
    }
}

export interface AllAssetsViewProps {
    baseUrl: string
    web3Service
}

export interface AllAssetsViewState {
    detailViewForAssetId: number

}

export class AllAssetsView extends React.Component<AllAssetsViewProps, {}> {

    state: AllAssetsViewState

    constructor(props) {
        super(props)

        this.state = {
            detailViewForAssetId: null
        }

    }

    async componentDidMount() {
        if (window['ethereum']) {
            const ethereum = window['ethereum']
            const web3 = new Web3(ethereum)
            try {
                // Request account access if needed
                await ethereum.enable();
                this.state['web3'] = web3
                this.setState(this.state)
                console.log(this.state)
                //web3.eth.sendTransaction({/* ... */});
            } catch (error) {
                console.log('User denied account access...')
            }
        }
        else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
        }
    }

    getSelectedAddress() {
        try {
            return this.state['web3'].eth.givenProvider.selectedAddress
        } catch (error) {
            return ''
        }
    }

    render() {
        var mysearchkit =
        <SearchkitProvider searchkit={searchkit}>
            <Layout>
            <TopBar>
                <SearchBox
                autofocus={true}
                searchOnChange={true}
                queryFields={['serial_number', 'last_seen']} />
            </TopBar>
            <LayoutBody>
                <LayoutResults>
                <Hits mod="sk-hits-list" hitsPerPage={50} listComponent={<AssetHitsTable selectedAddress={this.getSelectedAddress()} />}/>
                <NoHits />
                </LayoutResults>
            </LayoutBody>
            </Layout>
        </SearchkitProvider>
        return mysearchkit
    }
}