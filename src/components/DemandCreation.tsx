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
import { AssetType, Compliance, User, Demand, Currency, TimeFrame } from 'ewf-coo'
import { FullDemandProperties } from 'ewf-coo/build/ts/blockchain-facade/Demand'

export interface DemandCreationProps {
    web3Service: Web3Service,
    currentUser: User
}

export interface DemandEntryRow {
    critera: string,
    chooseFirst: string,
    showCheckbox: boolean,
    chooseSecond: string,
    propertyName: string,
    propertyIndex?: number

}

export interface DemandEnumRow {
    enumField,
    critera: string,
    chooseFirst: string,
    showCheckbox: boolean,
    chooseSecond: string,
    propertyName: string,
    propertyIndex?: number

}

export interface DemandCalenderRow {
    critera: string,
    propertyName: string
}

export class DemandCreation extends React.Component<DemandCreationProps, {}> {

    state: FullDemandProperties

    constructor(props) {
        super(props)
        this.state = {
            buyer: null,
            enabledProperties: [false, false, false, false, false, false, false, false, false, false],
            originator: '0x0000000000000000000000000000000000000000',
            locationCountry: '',
            locationRegion: '',
            minCO2Offset: 0,
            otherGreenAttributes: '',
            typeOfPublicSupport: '',
            productingAsset: 0,
            consumingAsset: 0,
            targetWhPerPeriod: null,
            pricePerCertifiedWh: null,
            assettype: AssetType.Wind,
            registryCompliance: Compliance.none,
            timeframe: TimeFrame.yearly,
            currency: Currency.Euro,
            startTime: null,
            endTime: null,
            matcher: null
        }
    }

    renderEntryTextField(row1: string, row2: string, row3: boolean, row4: string, propertyName: string, propIndex?: number) {

        const rowEntry: DemandEntryRow = {
            critera: row1,
            chooseFirst: row2,
            showCheckbox: row3,
            chooseSecond: row4,
            propertyName: propertyName,
            propertyIndex: propIndex
        }
        return (
            <DemandEntry
                value={rowEntry}
                onClick={(e) => { this.onCheckBoxEnabled(e, rowEntry) }}
                onBlur={(e) => this.handleInput(e, rowEntry)}
            />
        )
    }

    renderEntryEnum(row1: string, row2: string, row3: boolean, row4: string, propertyName: string, inputEnum, propIndex?: number) {
        const enumRowEntry: DemandEnumRow = {
            critera: row1,
            chooseFirst: row2,
            showCheckbox: row3,
            chooseSecond: row4,
            propertyName: propertyName,
            enumField: inputEnum,
            propertyIndex: propIndex
        }

        return (
            <DemandEntryEnum
                value={enumRowEntry}
                onChange={(e) => this.handleEnumInput(e, enumRowEntry)}

            />
        )
    }

    renderEntryCalender(row1: string, propName: string) {
        const calenderRowEntry: DemandCalenderRow = {
            critera: row1,
            propertyName: propName
        }

        return <DemandEntryCalendar
            value={calenderRowEntry}
            onChange={(e) => this.handleCalendarInput(e, calenderRowEntry)}
        />
    }

    handleCalendarInput(e, rowEntry) {
        const chosenDate = new Date(e.target.value).getTime() / 1000
        switch (rowEntry.propertyName) {
            case 'start':
                this.setState({
                    startTime: chosenDate
                })
                break
            case 'end':
                this.setState({
                    endTime: chosenDate
                })
                break
            default:
        }
    }

    onCheckBoxEnabled(e, rowEntry) {

        if (e.target.checked !== undefined) {

            const newProperties = this.state.enabledProperties
            newProperties[rowEntry.propertyIndex] = e.target.checked
            this.setState({
                enabledProperties: newProperties
            })
        }
    }

    handleEnumInput(e, rowEntry) {
        if (e.target.value !== undefined) {

            switch (rowEntry.propertyName) {
                case 'assetType':
                    this.setState({
                        assettype: e.target.value
                    })
                    break
                case 'compliance':
                    this.setState({
                        registryCompliance: e.target.value
                    })
                    break
                case 'timeFrame':
                    this.setState({
                        timeframe: e.target.value
                    })
                    break
                case 'currency':
                    this.setState({
                        currency: e.target.value
                    })
                    break
                default:
            }
        }
    }

    handleInput(e, rowEntry) {
        if (e.target.value !== undefined) {

            switch (rowEntry.propertyName) {
                case 'originator':
                    this.setState({
                        originator: e.target.value
                    })
                    break
                case 'country':
                    this.setState({
                        locationCountry: e.target.value
                    })
                    break
                case 'region':
                    this.setState({
                        locationRegion: e.target.value
                    })
                    break
                case 'greenAttributes':
                    this.setState({
                        otherGreenAttributes: e.target.value
                    })
                    break
                case 'publicSupport':
                    this.setState({
                        typeOfPublicSupport: e.target.value
                    })
                    break
                case 'prodAsset':
                    this.setState({
                        productingAsset: e.target.value
                    })
                    break
                case 'consAsset':
                    this.setState({
                        consumingAsset: e.target.value
                    })
                    break
                case 'maxConsumption':
                    this.setState({
                        targetWhPerPeriod: e.target.value
                    })
                    break
                case 'price':
                    this.setState({
                        pricePerCertifiedWh: e.target.value
                    })
                    break
                case 'matcher':
                    this.setState({
                        matcher: e.target.value
                    })
                    break
                case 'offset':
                    this.setState({
                        minCO2Offset: e.target.value
                    })
                    break
                default:
            }
        }
    }

    async createDemand() {
        console.log('CREATE DEMAND PRESSED')
        console.log(this.props.currentUser.accountAddress)

        this.setState({
            buyer: this.props.currentUser.accountAddress
        })

        const creationDemandProperties: FullDemandProperties = {
            buyer: this.state.buyer,
            enabledProperties: this.state.enabledProperties,
            originator: this.state.originator,
            locationCountry: this.state.locationCountry,
            locationRegion: this.state.locationRegion,
            minCO2Offset: this.state.minCO2Offset,
            otherGreenAttributes: this.state.otherGreenAttributes,
            typeOfPublicSupport: this.state.typeOfPublicSupport,
            productingAsset: this.state.productingAsset,
            consumingAsset: this.state.consumingAsset,
            targetWhPerPeriod: this.state.targetWhPerPeriod,
            pricePerCertifiedWh: this.state.pricePerCertifiedWh,
            assettype: this.state.assettype,
            registryCompliance: this.state.registryCompliance,
            timeframe: this.state.timeframe,
            currency: this.state.currency,
            startTime: this.state.startTime,
            endTime: this.state.endTime,
            matcher: this.state.matcher
        }
        if ((this.state.pricePerCertifiedWh !== null && this.state.pricePerCertifiedWh.toString() !== '')
            && (this.state.targetWhPerPeriod !== null && this.state.targetWhPerPeriod.toString() !== '')
            && (this.state.startTime !== null && this.state.startTime.toString() !== '')
            && (this.state.endTime !== null && this.state.endTime.toString() !== '')
            && (this.state.matcher !== '')) {

            const createdDemand: Demand = await Demand.CREATE_DEMAND(creationDemandProperties, this.props.web3Service.blockchainProperties, this.props.currentUser.accountAddress)

        }
    }

    render() {
        return <div>
            <div className='container'>
                <form>
                    <h4>Criteria</h4>
                    {this.renderEntryTextField('Originator', 'all', true, 'only This:', 'originator', 0)}
                    <div className='InternalTableHeader'>Location</div>
                    {this.renderEntryTextField('Country', 'all', true, 'only this country:', 'country', 3)}
                    {this.renderEntryTextField('Region', 'all', true, 'only this region:', 'region', 4)}
                    {this.renderEntryEnum('Asset', 'all', true, 'only this assetType', 'assetType', AssetType)}
                    {this.renderEntryEnum('Complaince', 'all', true, 'only if compliant to', 'compliance', Compliance)}
                    {this.renderEntryTextField('Minimal CO2 offset', 'all', true, 'only if below:', 'offset', 5)}
                    {this.renderEntryTextField('Other green attributes', 'all', true, 'only the following attribute', 'greenAttributes', 8)}
                    {this.renderEntryTextField('Type of public support', 'all', true, 'only the following public supports', 'publicSupport', 9)}
                    <div className='InternalTableHeader'>Consumption</div>
                    {this.renderEntryTextField('Use a specific producing asset', 'all', true, 'only use this asset:', 'prodAsset', 6)}
                    {this.renderEntryTextField('Coupled to consumption', 'no', true, 'Yes, coupled to this consumption address', 'consAsset', 7)}
                    {this.renderEntryTextField('Max. Consumption per period in kWh', '', false, '', 'maxConsumption')}
                    {this.renderEntryEnum('Timeframe', '', false, '', 'timeFrame', TimeFrame)}
                    {this.renderEntryTextField('Agreed price', '', false, '', 'price')}
                    {this.renderEntryEnum('Currency', '', false, '', 'currency', Currency)}
                    {this.renderEntryCalender('start:', 'start')}
                    {this.renderEntryCalender('end:', 'end')}
                    {this.renderEntryTextField('Matcher', '', false, '', 'matcher')}
                    <button type='button' onClick={() => this.createDemand()}>CREATE DEMAND</button>
                </form>
            </div>

        </div>

    }

}

function DemandEntry(props) {
    return (
        <div className='form-row'>
            <div className='form-group col-md-3'>
                {props.value.critera}
            </div>
            <div className='form-group col-md-1'>
                {props.value.chooseFirst}
            </div>
            <div className='form-group col-md-1'>
                {props.value.showCheckbox ? <label className='form-check-input' onClick={props.onClick} >
                    <input className='form-check-input' type='checkbox' />
                </ label> : null}
            </div>
            <div className='form-group col-md-3'>
                {props.value.chooseSecond}
            </div>
            <div className='form-group col-md-4'>
                {DemandInputField(props)}
            </div>
        </div>
    )
}

function DemandInputField(props) {

    let inputType = 'text'
    const propertyName = props.value.propertyName

    if (propertyName === 'prodAsset' || propertyName === 'consAsset' || propertyName === 'maxConsumption' || propertyName === 'price') {
        inputType = 'number'
    }

    return <input type={inputType} className='form-control' name='originatingAddress' onBlur={props.onBlur} />
}

function DemandEntryEnum(props) {

    const items = Object.keys(props.value.enumField).filter(key => isNaN(Number(key)))

    return (
        <div className='form-row'>
            <div className='col-3' >
                {props.value.critera}
            </div>
            <div className='col-1' >
                {props.value.chooseFirst}
            </div>
            <div className='col-1'>
                {props.value.showCheckbox ? <label className='form-check-input'  >
                    <input className='form-check-input' type='checkbox' onClick={props.onClick} />
                </ label> : null}
            </div>
            <div className='col-3'>
                {props.value.chooseSecond}
            </div>
            <div className='col-4'>
                <select className='form-control' onChange={props.onChange}> {items.map((item, index) => <option value={index} key={index}>{item}</option>)}</select>
            </div>
        </div>
    )

}

function DemandEntryCalendar(props) {
    return (
        <div className='form-row'>
            <div className='col-3'>
                {props.value.critera}
            </div>
            <div className='col-1'>

            </div>
            <div className='col-1'>

            </div>
            <div className='col-3'>

            </div>
            <div className='col-4'>
                <input type='datetime-local'
                    className='form-control' placeholder='Enter timestamp' onChange={props.onChange} />
            </div>
        </div>
    )

}
