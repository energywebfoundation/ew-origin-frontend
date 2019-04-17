import * as React from 'react'
const localStorageKey = "ConfigCreator"


export interface ConfigCreatorProps {

    web3
    callbackSetAddresses
    callbackSetProducingAssets

  }

export class ConfigCreator extends React.Component<ConfigCreatorProps, {}> {
  
    constructor(props) {
        super(props)

        const config = localStorage.getItem(localStorageKey) ?
            JSON.parse(localStorage.getItem(localStorageKey)) :
            ({
                topAdminPrivateKey: null,
                matcherPrivateKey: null,
                flow: []
            })

        this.state = {
            value: 'CREATE_ACCOUNT',
            coo: null,
            config: config,
            ownerAddress: null
        }

        this.downloadEWFConfiguration = this.downloadEWFConfiguration.bind(this)
        this.deployEWFConfiguration = this.deployEWFConfiguration.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.renderForms = this.renderForms.bind(this)
        this.handleDeviceChange = this.handleDeviceChange.bind(this)
    }

    componentDidMount() {
        this.props.callbackSetProducingAssets(this.state['config']['flow'])
    }

    updateState() {
        this.setState(this.state)
        localStorage.setItem(localStorageKey, JSON.stringify(this.state['config']))
        this.props.callbackSetProducingAssets(this.state['config']['flow'])
    }

    downloadEWFConfiguration() {
        const element = document.createElement("a");
        const file = new Blob([JSON.stringify(this.state['config'], null, 4)], {type: 'text/plain'})
        element.href = URL.createObjectURL(file)
        element.download = "config.json"
        document.body.appendChild(element)
        element.click()
    }

    deployEWFConfiguration() {
        event.preventDefault()
        if (this.state['deploying']) {
            console.log('Already deploying..')
            return
        }
        this.setState({
            deploying: true
        })
        console.log('Deploying CoO contracts, this takes a while.')
        fetch('http://ew-origin:3003/coo', {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({config: this.state['config']})
        }).then(res => {
            res.json().then(data => {
                this.setState({
                    deploying: false
                })
                this.props.callbackSetAddresses(JSON.parse(data))
            })
        })
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    getNewWeb3Account() {
        if (this.props.web3) {
            const account = this.props.web3.eth.accounts.create()
            return account
        }
    }

    createAccount() {
        const { address: address, privateKey: privateKey } = this.getNewWeb3Account()
        this.state['ownerAddress'] = address
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
            address: address,
            privateKey: privateKey,
            rights: 16
        }
    }

    createProducingAsset() {
        const { address: address, privateKey: privateKey } = this.getNewWeb3Account()
        return {
            smartMeter: address,
            smartMeterPK: privateKey,
            owner: this.state['ownerAddress'],
            operationalSince: null,
            capacityWh: null,
            lastSmartMeterReadWh: null,
            active: true,
            lastSmartMeterReadFileHash: null,
            country: null,
            region: null,
            zip: null,
            city: null,
            street: null,
            houseNumber: null,
            gpsLatitude: null,
            gpsLongitude: null,
            assetType: "RunRiverHydro",
            certificatesCreatedForWh: null,
            lastSmartMeterCO2OffsetRead: null,
            cO2UsedForCertificate: null,
            complianceRegistry: null,
            otherGreenAttributes: null,
            typeOfPublicSupport: null
        }
    }

    getDataForType(type) {
        switch(type) {
            case 'CREATE_ACCOUNT':
                return this.createAccount()
            case 'CREATE_PRODUCING_ASSET':
                return this.createProducingAsset()
            default:
                throw('Your\'re adding type: ' + type + ' which is not supported.')
        }
    }
    
    handleSubmit(event) {
        event.preventDefault()
        const type = this.state['value']
        if (['topAdminPrivateKey', 'matcherPrivateKey'].includes(type)) {
            const { address: address, privateKey: privateKey } = this.getNewWeb3Account()
            // config expects keys NOT to start with 0x
            this.state['config'][type] = privateKey.slice(2)
        } else {
            this.state['config']['flow'].push({
                type: type,
                data: this.getDataForType(type)
            })
        }
        this.updateState()
    }

    isIntType(name) {
        const intTypes = ['operationalSince', 'capacityWh', 'lastSmartMeterReadWh', 'lastSmartMeterCO2OffsetRead', 'certificatesCreatedForWh', 'lastSmartMeterCO2OffsetRead', 'cO2UsedForCertificate']
        return intTypes.indexOf(name) > -1
    }

    convertType(name, value) {
        if (this.isIntType(name)) {
            const intValue = parseInt(value)
            return isNaN(intValue) ? 0 : intValue
        }
        return value
    }

    handleDeviceChange(event, key) {
        const name = event.target.name
        const value = this.convertType(event.target.name, event.target.value)

        this.state['config']['flow'][key]['data'][name] = value
        this.updateState()
    }

    handleAccountChange(event) {
        const value = event.target.value
        const name = event.target.name
        this.state['config'][name] = value
        this.updateState()
    }

    handleDeviceDelete(event, key) {
        event.preventDefault()
        this.state['config']['flow'].splice(key, 1)
        this.updateState()
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
                <label>
                    Admin: {this.renderUser('topAdminPrivateKey')}
                </label>
                <br />
                <label>
                    Matcher: {this.renderUser('matcherPrivateKey')}
                </label>
                <br />
                {flow}
            </div>
        )
    }

    renderUser(name) {
        return (
            <input type="text" name={name} size={64} value={this.state['config'][name]} placeholder={name} onChange={ (e) => this.handleAccountChange(e) } />
        )
    }

    renderCreation() {
        const deploy_button_text = this.state['deploying'] ? 'Deploying..' : 'Deploy'
        const deploy_button_class = this.state['deploying'] ? 'disabled' : 'primary'
        return (
            <div>
                <form>
                <label>
                Choose type to create:
                <select value={this.state['value']} onChange={this.handleChange}>
                    <option value="topAdminPrivateKey">Admin</option>
                    <option value="matcherPrivateKey">Matcher</option>
                    <option value="CREATE_ACCOUNT">User Account</option>
                    <option value="CREATE_PRODUCING_ASSET">Producing Asset</option>
                    {/*<option value="CREATE_CONSUMING_ASSET">Consuming Asset</option>*/}
                </select>
                </label>
                <button className="primary" onClick={this.handleSubmit}>Create</button>
                {this.renderForms()}
                </form>
                <button className="secondary" onClick={this.downloadEWFConfiguration}>Download</button>
                <button className={deploy_button_class} onClick={this.deployEWFConfiguration}>{deploy_button_text}</button>
            </div>
        )
    }

    render() {
        return (
            <div>
            <div className='PageHeader'>
                <div className='PageTitle'>Config Creator</div>
            </div>
            {
                this.props.web3 ?
                this.renderCreation()
                :
                <div>
                    You need to install and unlock Metamask first.
                </div>
            }
            </div>
        )
    }
}
