import * as React from 'react'

export class ConfigCreator extends React.Component {
  
    constructor(props) {
        super(props)

        this.state = {
            value: 'CREATE_ACCOUNT',
            config: {
                topAdminPrivateKey: null,
                matcherPrivateKey: null,
                flow: []
            }
        }

        this.downloadEWFConfiguration = this.downloadEWFConfiguration.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.renderForms = this.renderForms.bind(this)
        this.handleDeviceChange = this.handleDeviceChange.bind(this)
    }

    downloadEWFConfiguration() {
        const element = document.createElement("a");
        const file = new Blob([JSON.stringify(this.state['config'], null, 4)], {type: 'text/plain'})
        element.href = URL.createObjectURL(file)
        element.download = "config.json"
        document.body.appendChild(element)
        element.click()
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    createAccount() {
        return {
            firstName: null,
            surname: null,
            organization: null,
            street: null,
            number: null,
            zip: null,
            city: null,
            country: null,
            state: null,
            address: null,
            privateKey: null,
            rights: null
        }
    }

    createProducingAsset() {
        return {
            smartMeter: null,
            smartMeterPK: null,
            owner: null,
            operationalSince: null,
            capacityWh: null,
            lastSmartMeterReadWh: null,
            active: null,
            lastSmartMeterReadFileHash: null,
            country: null,
            region: null,
            zip: null,
            city: null,
            street: null,
            houseNumber: null,
            gpsLatitude: null,
            gpsLongitude: null,
            assetType: null,
            certificatesCreatedForWh: null,
            lastSmartMeterCO2OffsetRead: null,
            cO2UsedForCertificate: null,
            complianceRegistry: null,
            otherGreenAttributes: null,
            typeOfPublicSupport: null
        }
    }

    createConsumingAsset() {
        return {
            smartMeter: null,
            smartMeterPK: null,
            owner: null,
            operationalSince: null,
            capacityWh: null,
            lastSmartMeterReadWh: null,
            active: null,
            lastSmartMeterReadFileHash: null,
            country: null,
            region: null,
            zip: null,
            city: null,
            street: null,
            houseNumber: null,
            gpsLatitude: null,
            gpsLongitude: null,
            maxCapacitySet: null,
            certificatesUsedForWh: null
        }
    }

    getDataForType(type) {
        switch(type) {
            case 'CREATE_ACCOUNT':
                return this.createAccount()
            case 'CREATE_PRODUCING_ASSET':
                return this.createProducingAsset()
            case 'CREATE_CONSUMING_ASSET':
                return this.createConsumingAsset()
            default:
                throw('Your\'re adding type: ' + this.state['value'] + ' which is not supported.')
        }
    }
    
    handleSubmit(event) {
        const type = this.state['value']
        this.state['config']['flow'].push({
            type: type,
            data: this.getDataForType(type)
        })
        this.setState(this.state)
        event.preventDefault();
    }

    handleDeviceChange(event, key) {
        const value = event.target.value
        const name = event.target.name
        this.state['config']['flow'][key]['data'][name] = value
        this.setState(this.state)
    }

    handleDeviceDelete(event, key) {
        this.state['config']['flow'].splice(key, 1)
        this.setState(this.state)
    }

    capitalize(string) {
        string = string.toLowerCase().replace(/_/g, ' ')
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    renderForms() {
        var flow = this.state['config']['flow'].map((flowpart, key) => (
            <label key={key}>{this.capitalize(flowpart['type'])}
                {
                    Object.keys(flowpart['data']).map((property, pkey) => (
                        <input key={pkey} type="text" name={property} value={flowpart['data'][property]} placeholder={property} onChange={ (e) => this.handleDeviceChange(e, key) } />
                    ))
                }

                <button className="icon" onClick={(e) => this.handleDeviceDelete(e, key)}><i className="fa fa-trash"></i></button>
            </label>
        ))
        return (
            <div>
                {flow}
            </div>
        )
    }

    render() {
        return (
            <div>
            <div className='PageHeader'>
                <div className='PageTitle'>Config Creator</div>
            </div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                    Choose type to create:
                    <select value={this.state['value']} onChange={this.handleChange}>
                        <option value="CREATE_ACCOUNT">Account</option>
                        <option value="CREATE_PRODUCING_ASSET">Producing Asset</option>
                        <option value="CREATE_CONSUMING_ASSET">Consuming Asset</option>
                    </select>
                    </label>
                    <input type="submit" value="Create" />
                    {this.renderForms()}
                </form>
                <button className="primary" onClick={this.downloadEWFConfiguration}>Download</button>
            </div>
        )
    }
}
