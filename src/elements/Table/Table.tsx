import * as React from 'react'
import {
  Button,
  DropdownButton,
  MenuItem,
  OverlayTrigger,
  Popover,
} from 'react-bootstrap'
import Toggle from 'react-toggle'
import DatePicker from 'react-date-picker';
import * as renderHTML  from 'react-render-html'
import * as moment from 'moment'
import * as action from '../../../assets/action.svg'
import './toggle.scss'
import './Table.scss'
import './datepicker.scss'

export class Table extends React.Component<any, any> {
  constructor(props) {
    super(props)
    const { header, footer, data, actions, actionWidth, classNames, type = 'data' } = props

    const toggles = {}
    if (type === 'admin') {
      for (let i = 0; i < header.length; i++) {
        if (header[i].header) continue
        const { data } = header[i]
        for (let d = 0; d < data.length; d++) {
          const row = data[d]
          if (row.toggle.default) toggles['toggle_' + row.key] = true
        }
      }
    }

    this.state = {
      ...toggles,
      inputs: {enabledProperties: [false, false, false, false, false, false, false, false, false, false]},
      date: new Date(),
    }
  }
  calculateTotal = (data, keys) => {
    const ret = {}
    const offset = keys[0].colspan - 1
    for (let k = 1; k < keys.length; k++) {
      const key = keys[k].key
      ret[key] = 0
    }
    for (let d = 0; d < data.length; d++) {
      const row = data[d]
      for (let k = 1; k < keys.length; k++) {
        const key = keys[k].key
        ret[key] += Number(row[k + offset])
      }
    }
    return ret
  }

  handleDropdown = (key, itemInput) => {
    return ((value) => {
      
      const { data } = this.props
      if (itemInput.labelKey) {
        const items = data[itemInput.data]
        let val = items.filter(item => (item[itemInput.key] === value))
        val = val.length > 0 ? val[0][itemInput.labelKey] : ''
        this.setState({
          [key]: value,
          ['dropdown_' + key]: val,
        })
      } else {
        this.setState({ [key]: value })
      }
      const newInputs = {...this.state.inputs}
      newInputs[key] = value

      this.setState({ inputs: newInputs })
    }).bind(this)
  }

  handleToggle = (key, index) => {
  
    const stateKey = 'toggle_' + key
    return (() => {
      const { state } = this
      //state[stateKey] = state[stateKey] ? false : true
      this.setState(state)

      if(index !== undefined) {
        const newInputs = {...this.state.inputs}
        newInputs.enabledProperties[index] = !newInputs.enabledProperties[index]

        this.setState({ inputs: newInputs })
      }
      

    }).bind(this)
  }

  handleInput = (key) => {
    return ((e) => {
      const newInputs = {...this.state.inputs}
      newInputs[key] = e.target.value

      this.setState({ inputs: newInputs })
    }).bind(this)
  }

  handleDate = (key) => {
    return ((date) => {

      const output = moment(date).format('DD MMM YY')
      this.setState({ [key]: date, ['date_' + key]: output })
      const newInputs = {...this.state.inputs}
      newInputs[key] = moment(date).unix()

      this.setState({ inputs: newInputs })
    }).bind(this)
  }

  render() {

    

    const {
      state,
      props,
      handleToggle,
      handleDropdown,
      handleInput,
      handleDate
    } = this
    const { header, footer, data, actions, actionWidth, classNames, type = 'data' , operations = [], operationClicked = () => {}} = props
    const total = type === 'data' ? this.calculateTotal(data, footer) : 0


    const popoverFocus = (id: number) => (
      <Popover id="popover-trigger-focus">
        <div className="popover-wrapper">
          {operations.map((o, index) => <div key={index} onClick={() => operationClicked(o, id)  } className="popover-item">{o}</div>)}
        </div>
      </Popover>
    );

 
    return (
      <div className="TableWrapper">
        {
          type === 'data' &&
          <table  className={(classNames || []).join(' ')}>
            <thead>
              <tr>
                {
                  header.map((item, index) => {
                    return (<th  style={ item.style || {}} key={index}>{renderHTML(renderText(item.label))}</th>)
                  })
                }
                {actions && <th style={{width: actionWidth || 72.89}} className='Actions' >{renderHTML(renderText('Actions'))}</th>}
              </tr>
            </thead>
            <tfoot>
              <tr>
                {
                  footer.map((item, index) => {
                    return (<td colSpan={item.colspan || 1} className={`Total ${item.hide ? 'Hide' : 'Show'}`} style={item.style || {}} key={index}>{renderHTML(renderText(item.label || total[item.key].toFixed(3)))}</td>)
                  })
                }
                {actions && <td className='Actions'></td>}
              </tr>
            </tfoot>
            <tbody>
              {
                data.map((row, rowIndex) => {
                  
                  return (
                    <tr key={row[0]}>
                      {
                        header.map((item, colIndex) => {
                          return (
                            <td key={colIndex} style={{ ...item.style, ...item.styleBody } || {}} className={`${item.styleBody.opacity ? 'Active' : ''}`}>{renderHTML(renderText(row[colIndex]))}</td>
                          )
                        })
                      }
                      {
                        actions &&
                        <td className='Actions'>
                          { operations.length > 0 &&
                          <OverlayTrigger trigger="focus" placement="bottom" overlay={popoverFocus(row[0])}>
                            <Button><img src={action as any} /></Button>
                          </OverlayTrigger> }
                        </td>
                      }
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        }
        {
          type === 'admin' &&
          <table className={`${type}`}>
            <thead>
              <tr>
                <td style={{width:'18.33'}}>&nbsp;</td>
                <td style={{width:'11.13'}}>&nbsp;</td>
                <td style={{width:'12.85'}}>&nbsp;</td>
                <td style={{width:'25.28'}}>&nbsp;</td>
                <td style={{width:'32.4'}}>&nbsp;</td>


   
              </tr>
            </thead>
            <tbody>
              {
                header.map((item, rIndex) => {
                  return (
                    item.header
                      ?
                      <tr key={rIndex} className={`${item.footer ? 'TableFooter' : 'TableHeader'}`}>
                        <th colSpan={5} className='Actions'>
                          {
                            item.footer
                              ?
                              <button onClick={() => item.footerClick(this.state.inputs)}>{item.footer}</button>
                              :
                              item.header
                          }
                        </th>
                      </tr>
                      :
                      item.data.map((item, index) => (
                        <tr key={index}>
                          <td className='Actions Label'>{renderHTML(renderText(item.label.length ? item.label + ':' : ''))}</td>
                          <td className={`Actions ToggleLabel ${state['toggle_' + item.key] || (item.toggle.ref && state['toggle_' + item.toggle.ref]) ? 'Disabled' : 'Active'}`}>{renderHTML(renderText(item.toggle.hide ? '' : item.toggle.label))}</td>
                          <td className={`Actions Toggle`}>
                            {
                              item.toggle.hide
                                ? <div />
                                :
                                <div>
                                  <Toggle
                                    defaultChecked={item.toggle.default || false}
                                    icons={false}
                                    onChange={handleToggle(item.key, item.toggle.index)} />
                                </div>
                            }
                          </td>
                          <td className={`Actions ToggleDescription ${state['toggle_' + item.key] || (item.toggle.ref && state['toggle_' + item.toggle.ref]) ? 'Active' : 'Disabled'}`}>{renderHTML(renderText(item.toggle.description.length ? item.toggle.description + ':' : ''))}</td>
                          <td className={`Actions Input`}>
                            {item.input.type === 'text' &&
                              <div>
                                <input onChange={handleInput(item.key)} />
                              </div>
                            }
                            {item.input.type === 'date' &&
                              <div>
                                <input className='Date' value={state['date_' + item.key] || 'Pick a date'} />
                                <DatePicker
                                  onChange={handleDate(item.key)}
                                  value={state[item.key]}
                                />
                              </div>
                            }
                            {
                              item.input.type === 'select' &&
                              <DropdownButton
                                bsStyle='default'
                                title={(item.input.labelKey ? state['dropdown_' + item.key] : state[item.key]) || `Choose ${item.label}`}
                                onSelect={handleDropdown(item.key, item.input)}
                              >
                                {
                                  item.input.key
                                    ? data[item.input.data].map(opt => { return (<MenuItem eventKey={opt[item.input.key]}>{opt[item.input.labelKey]}</MenuItem>) })
                                    : data[item.input.data].map((opt, index) => { return (<MenuItem eventKey={opt} key={index}>{opt}</MenuItem>) })
                                }
                              </DropdownButton>
                            }
                          </td>
                        </tr>
                      ))
                  )
                })
              }
            </tbody>
          </table>
        }
      </div>
    )
  }
}

const renderText = (data, tag = 'div') => {
  return `<${tag}>${Number(data) ? addCommas(data) : data}</${tag}>`
}

const addCommas = (intNum) => {
  return (intNum + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,')
}



