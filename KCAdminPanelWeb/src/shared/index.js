import './style.scss'

export * from './Buttons'
export * from './Input'
export * from './FormModel'
export * from './SearchBox'
export * from './TextArea'
export * from './MapView'

export const Loader = (props) => {
    return <div className="loading" style={
        props.containerHeight ? { height: '100%' } : {}
    }>Loading...</div>
}