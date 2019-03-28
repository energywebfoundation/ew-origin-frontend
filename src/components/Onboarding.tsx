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

const Web3 = require('web3')

const localStorageKey = "Onboarding"

export class Onboarding extends React.Component<any, {}> {

  constructor(props) {
    super(props)

    var value = {'name': 'Your Name', 'coo': 'The CoO Address', 'devices': []}
    if (localStorage.getItem(localStorageKey)) {
      value = JSON.parse(localStorage.getItem(localStorageKey))
    }

    this.state = {
      value: value,
      web3: null
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleDeviceChange = this.handleDeviceChange.bind(this)
    this.downloadConfiguration = this.downloadConfiguration.bind(this)
  }

  updateState() {
    this.setState(this.state)
    localStorage.setItem(localStorageKey, JSON.stringify(this.state['value']))
  }

  handleChange(event) {
    const value = event.target.value
    const name = event.target.name
    this.state['value'][name] = value
    this.updateState()
  }

  handleDeviceChange(event, key) {
    const value = event.target.value
    const name = event.target.name
    this.state['value']['devices'][key][name] = value
    this.updateState()
  }
  
  handleDeviceDelete(event, key) {
    this.state['value']['devices'].splice(key, 1)
    this.updateState()
    event.preventDefault()
  }

  handleSubmit(event) {
    const newDevice = {
      name: 'MyNewDevice',
      meta: 'My New Device Meta Data'
    }

    this.state['value']['devices'].push(newDevice)
    this.updateState()
    event.preventDefault()
  }

  clearLocalStorage(event) {
    localStorage.clear()
  }

  downloadConfiguration() {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(this.state['value'])], {type: 'text/plain'})
    element.href = URL.createObjectURL(file)
    element.download = "config.json"
    document.body.appendChild(element)
    element.click()
  }

  async componentDidMount() {
    await this.showKeyId(this.props)

    window.addEventListener('load', async () => {
      // Modern dapp browsers...
      if (window['ethereum']) {
          const ethereum = window['ethereum']
          const web3 = new Web3(ethereum)
          try {
              // Request account access if needed
              await ethereum.enable();
              console.log('Acccounts now exposed')
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
    });
  }

  getSelectedAddress() {
    try {
      return this.state['web3'].eth.givenProvider.selectedAddress
    } catch (error) {
      return ''
    }
  }

  async showKeyId(props) {
    console.log(props.web3Service)
  }

  newDeviceForm() {
    const devices = this.state['value']['devices'].map((device, key) => (
      <div key={key}>
        <label>
          Device Name:
          <input type="text" name="key" value={key} disabled />
          <input type="text" name="name" value={device['name']} onChange={ (e) => this.handleDeviceChange(e, key) } />
          <input type="text" name="meta" value={device['meta']} onChange={ (e) => this.handleDeviceChange(e, key) } />
          <input type="submit" value="x" onClick={(e) => this.handleDeviceDelete(e, key)} />
        </label>
      </div>
    ))
    return (
      <form>
        <input type="submit" value="Add device" onClick={this.handleSubmit} />
        {devices}
      </form>
    )
  }

  render() {
    return (
      <div className='PageWrapper'>
        <div className='PageNav'></div>

        <div className='PageContentWrapper'>
          <div className='PageHeader'>
            <div className='PageTitle'>Onboarding</div>
          </div>
          <div className='PageBody'>
            <span>
              Currently selected address: {this.getSelectedAddress()}
            </span>
            <form>
              <label>
                Name:
                <input type="text" name="name" value={this.state['value']['name']} onChange={this.handleChange} />
              </label>

              <label>
                CoO Address:
                <input type="text" name="coo" value={this.state['value']['coo']} onChange={this.handleChange} />
              </label>
            </form>
            {this.newDeviceForm()}
            <div onClick={this.clearLocalStorage}><span>Clear local storage</span></div>
            <div onClick={this.downloadConfiguration}><span>Download</span></div>
          </div>
        </div>

      </div>
    )
  }
}
