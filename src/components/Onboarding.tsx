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
import { Header } from './Header'
import { ConfigCreator } from './ConfigCreator'
import { User } from 'ewf-coo'

import './Onboarding.scss'

const Web3 = require('web3')
const localStorageKey = "Onboarding"

export class Onboarding extends React.Component<any, {}> {
  
  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      coo: JSON.parse(localStorage.getItem(localStorageKey))
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.createAccount = this.createAccount.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.clearLocalStorage = this.clearLocalStorage.bind(this)
  }

  updateState() {
    this.setState(this.state)
    localStorage.setItem(localStorageKey, JSON.stringify(this.state['coo']))
  }

  handleChange(event) {
    const value = event.target.value
    const name = event.target.name
    this.state[name] = value
    this.updateState()
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
    document.location.reload()
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

  setCooAddress = (cooAdress) => {
    this.state['coo'] = cooAdress
    this.updateState()
  }

  async showKeyId(props) {
    console.log(props.web3Service)
  }

  render() {
    const coo_length = this.state['coo'] ? this.state['coo'].length : 0

    var user: User

    return (
      <div className='PageWrapper'>
        <Header currentUser={user} baseUrl='/' />
        <div className='PageNav'></div>

        <div className='PageContentWrapper'>
          <div className='PageHeader'>
            <div className='PageTitle'>Onboarding</div>
          </div>
          <div className='PageBody'>
            <div className="Onboarding">
              <form>

                <label>
                  CoO Address:
                  <input type="text" name="coo" size={42} value={this.state['coo']} placeholder="0x00..." onChange={this.handleChange} />
                  {
                    coo_length == 42
                    ?
                      <a href={this.state['coo']}>Open</a>
                    :
                      <span>0x + 40 characters</span>
                  }
                </label>
              </form>

              <ConfigCreator web3={this.state['web3']} callbackSetCooAddress={this.setCooAddress} />

              <div className='PageHeader'>
                <div className='PageTitle'>Dev</div>
              </div>

              <button className="secondary" onClick={this.clearLocalStorage}>Reset</button>

            </div>
          </div>
        </div>

      </div>
    )
  }
}
