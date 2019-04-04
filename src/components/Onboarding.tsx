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

import './Onboarding.scss'

const Web3 = require('web3')
const localStorageKey = "Onboarding"

export class Onboarding extends React.Component<any, {}> {
  
  constructor(props) {
    super(props)

    var value = {'name': null, 'coo': null, 'devices': [], 'account': {'address': null}}
    if (localStorage.getItem(localStorageKey)) {
      value = JSON.parse(localStorage.getItem(localStorageKey))
    }

    this.state = {
      value: value,
      web3: null,
      password: null,
      unlocked: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleDeviceChange = this.handleDeviceChange.bind(this)
    this.downloadConfiguration = this.downloadConfiguration.bind(this)
    this.createAccount = this.createAccount.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.deployContract = this.deployContract.bind(this)
    this.clearLocalStorage = this.clearLocalStorage.bind(this)
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
      name: null,
      meta: null
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
    const file = new Blob([JSON.stringify(this.state['value'], null, 4)], {type: 'text/plain'})
    element.href = URL.createObjectURL(file)
    element.download = "config.json"
    document.body.appendChild(element)
    element.click()
  }

  handlePasswordChange(event) {
    const value = event.target.value
    this.state['password'] = value
  }

  createAccount(event) {
    event.preventDefault()
    console.log('creating account on the server with password', this.state['password'])
    fetch('http://localhost:3003/account', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({acccount: this.state['value']['account']['address'], password: this.state['password']})
    }).then(res => {
      res.json().then(data => {
        this.state['unlocked'] = true
        this.state['value']['account'] = data
        this.updateState()
      })
    })
  }

  deployContract() {
    event.preventDefault()
    this.setState({
      deploy: true
    })
    console.log('Deploying CoO contracts, this takes a while.')
    fetch('http://localhost:3003/coo', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }).then(res => {
      res.json().then(data => {
        this.state['value']['coo'] = data['coo']
        this.state['deploy'] = false
        this.setState(this.state)
        this.updateState()
      })
    })
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
          <input type="text" name="key" value={key} disabled />
        </label>
        <label>
          Device Name:
          <input type="text" name="name" value={device['name']} placeholder={"Charging Station " + key} onChange={ (e) => this.handleDeviceChange(e, key) } />
        </label>
        <label>
          Metadata:
          <input type="text" name="meta" value={device['meta']} placeholder="Rented till..." onChange={ (e) => this.handleDeviceChange(e, key) } />
        </label>
        <button className="icon" onClick={(e) => this.handleDeviceDelete(e, key)}><i className="fa fa-trash"></i></button>
      </div>
    ))
    return (
      <form>
        {devices}
      </form>
    )
  }

  render() {
    const coo_length = this.state['value']['coo'] ? this.state['value']['coo'].length : 0
    const account_address = this.state['value']['account']['address'] ? this.state['value']['account']['address'] : '(Create or unlock an account first)' //this.getSelectedAddress()
    const coo_address = this.state['value']['coo']
    var create_account_button_text = 'Create'
    var create_account_button_class = 'primary'
    var create_account_button_disabled = false
    if (this.state['value']['account']['address']) {
      if (this.state['unlocked']) {
        create_account_button_disabled = true
        create_account_button_text = 'Unlocked'
        create_account_button_class = 'disabled'
      } else {
        create_account_button_text = 'Unlock'
        create_account_button_class = 'secondary'
      }
    }

    var deploy_button_text = 'Deploy'
    var deploy_button_class = 'primary'
    var deploy_button_disabled = false

    if (coo_address) {
      deploy_button_text = 'Deployed'
      var deploy_button_class = 'disabled'
      var deploy_button_disabled = true
    }

    if (this.state['deploy']) {
      deploy_button_text = 'Deploying..'
      var deploy_button_class = 'disabled'
      var deploy_button_disabled = true
    }


    return (
      <div className='PageWrapper'>
        <div className='PageNav'></div>

        <div className='PageContentWrapper'>
          <div className='PageHeader'>
            <div className='PageTitle'>Onboarding</div>
          </div>
          <div className='PageBody'>
            <div className="Onboarding">
              <div>Currently selected address: {account_address}</div>
              <form>
                <label>
                  Name:
                  <input type="text" name="name" value={this.state['value']['name']} placeholder="Your Name" onChange={this.handleChange} />
                </label>

                <label>
                  CoO Address:
                  <input type="text" name="coo" size={42} value={this.state['value']['coo']} placeholder="0x00..." onChange={this.handleChange} />
                  {
                    coo_length == 42
                    ?
                      <a href={this.state['value']['coo']}>Open</a>
                    :
                      <span>0x + 40 characters</span>
                  }
                </label>
              </form>
              <button className="primary" onClick={this.handleSubmit}>Add device</button>

              <div className='PageHeader'>
                <div className='PageTitle'>Device Configurator</div>
              </div>
              {this.newDeviceForm()}
              <button className="secondary" onClick={this.clearLocalStorage}>Clear</button>
              <button className="primary" onClick={this.downloadConfiguration}>Download</button>

              <div className='PageHeader'>
                <div className='PageTitle'>CoO Account</div>
              </div>

              <form>
                <label>
                  Account Password:
                  <input type="text" name="password" value={this.state['password']} placeholder={"secret password"} onChange={this.handlePasswordChange} />
                </label>
                <button className={create_account_button_class} onClick={this.createAccount} disabled={create_account_button_disabled}>{create_account_button_text}</button>
                <span>{account_address}</span>
              </form>

              <div className='PageHeader'>
                <div className='PageTitle'>CoO Contracts</div>
              </div>

              <form>
                <button className={deploy_button_class} onClick={this.deployContract} disabled={deploy_button_disabled}>{deploy_button_text}</button>
                <span>{coo_address}</span>
              </form>

            </div>
          </div>
        </div>

      </div>
    )
  }
}
