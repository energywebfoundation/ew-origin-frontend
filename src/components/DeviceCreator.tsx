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
  
// it's always the same ip and port since we're connected to the local ap of the device

export class DeviceCreator extends React.Component<any, {}> {
    constructor(props) {
        super(props)

        this.state = {
            device: 'new'
        }
    
        this.sendConfigToDevice = this.sendConfigToDevice.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    producer(asset_id, address, pk) {
        return {
            "name": "ChargingPoint",
            "energy-meter": {
            "module": "tasks.chargepoint",
            "class_name": "EVchargerEnergyMeter",
                "class_parameters": {
                "service_urls": ["http://es-kong", "http://0.0.0.0:9200"],
                    "manufacturer":"Ebee",
                    "model":"EV-Charge Point Energy Meter",
                    "serial_number":"0901454d4800007340d2",
                    "energy_unit":"WATT_HOUR",
                    "is_accumulated": false,
                    "connector_id": 1
                }
            },
            "carbon-emission": {
                "module": "energyweb.carbonemission",
                "class_name": "WattimeV1",
                "class_parameters": {
                    "usr": "energyweb",
                    "pwd": "en3rgy!web",
                    "ba": "FR",
                    "hours_from_now": 24
                }
            },
            "smart-contract": {
            "module": "energyweb.smart_contract.origin_v1",
            "class_name": "OriginProducer",
                "class_parameters": {
                    "asset_id": parseInt(asset_id),
                    "wallet_add": address,
                    "wallet_pwd": pk.slice(2), // remove 0x at beginning of pk
                    "client_url": "https://rpc.slock.it/tobalaba",
                    "addresses": {
                        "producer": {
                            "address": this.props.producing
                        }
                    }
                }
            }
        }
    }

    sendConfigToDevice() {
        event.preventDefault()
        console.log('Posting device config to device')
        this.setState({
            device: 'working'
        })

        var producers = []
        for (var asset_key in this.props.assets) {
            var asset = this.props.assets[asset_key]
            if (asset['type'] == 'CREATE_PRODUCING_ASSET') {
                console.log(asset['data'])
                var address = asset['data']['smartMeter']
                var pk = asset['data']['smartMeterPK']
                producers.push(this.producer(asset_key, address, pk))
            }
        }

        const config = {
            "consumers": [],
            "producers": producers,
            "ocpp16-server": {
                "host": "0.0.0.0",
                "port": 8080
            },
            "elastic-sync": {
                "service_urls": ["http://es-kong", "http://0.0.0.0:9200"]
            }
        }

        console.log(config)

        const device_id = this.state['device_id']
        const device_address = `http://usn-device-${device_id}.local:8060/config`
        fetch(device_address, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(config)
        }).then(res => {
            res.json().then(data => {
                this.setState({
                    device: 'done'
                })
            })
        })
    }

    handleChange(event) {
        this.setState({device_id: event.target.value});
    }

    render() {
        return (
            <div>
            <div className='PageHeader'>
                <div className='PageTitle'>Charging Station Configurator</div>
            </div>
            <form>
                <label>Charging Device ID
                    <input name="device_id" placeholder="device_id" onChange={this.handleChange} />
                </label>
            </form>
            <button className="primary" onClick={this.sendConfigToDevice} value={this.state['device_id']}>Configure</button>
            </div>
        )
    }
}
