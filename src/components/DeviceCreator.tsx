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
const device_address = 'http://10.42.0.1:8000/8000'
//const device_address = 'http://127.0.0.1:8000/8000'

export class DeviceCreator extends React.Component<any, {}> {
    constructor(props) {
        super(props)

        this.state = {
            device: 'new'
        }
    
        this.sendConfigToDevice = this.sendConfigToDevice.bind(this)
    }

    sendConfigToDevice() {
        event.preventDefault()
        console.log('Posting device config to device')
        this.setState({
            device: 'working'
        })

        const config = {
            "consumers": [
            ],
            "producers": [
                {
                "name": "ChargingPoint0901454d4800007340d2",
                "energy-meter": {
                "module": "tasks.chargepoint",
                "class_name": "EVchargerEnergyMeter",
                    "class_parameters": {
                    "service_urls": ["http://es-kong", "http://0.0.0.0:9200"],
                        "manufacturer":"Ebee",
                        "model":"EV-Charge Point Energy Meter",
                        "serial_number":"10901454d4800007340d2",
                        "energy_unit":"WATT_HOUR",
                        "is_accumulated": false,
                        "connector_id": 0
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
                        "asset_id": 2,
                        "wallet_add": "0x4A616994A229565f7f7E96161eFd78b780bf24e2",
                        "wallet_pwd": "1b17e7cb5879a18fb6c9e7aee03a66841f2aa10102bd537752ecbdb5b6252d2f",
                        "client_url": "https://rpc.slock.it/tobalaba"
                        }
                    }
                }
            ],
            "ocpp16-server": {
                "host": "127.0.0.1",
                "port": 8080
            },
            "elastic-sync": {
                "service_urls": ["http://es-kong", "http://0.0.0.0:9200"]
            },
            "iot-layer": {
                "client_url": "https://rpc.slock.it/tobalaba",
                "wallet_add": "0x16bC9F8a9bE6296F3D4C87Dcd866726593662B3f",
                "wallet_pwd": "0x54f4f12baa6d986e052420e5c1e69274475e73cd450acaafb97cbc53094887cf",
                "device_id": "10901454d4800007340d2"
            }
        }

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

    render() {
        return (
            <div>
            <div className='PageHeader'>
                <div className='PageTitle'>Device Creator</div>
            </div>
            <button className="primary" onClick={this.sendConfigToDevice}>Create</button>
            </div>
        )
    }
}
