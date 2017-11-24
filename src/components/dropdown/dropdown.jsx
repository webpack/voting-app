import React from 'react';
import './dropdown-style';

// Specify BEM block name
const block = 'dropdown';

export default class Dropdown extends React.Component {
    constructor(props) {
        super(props);

        this._handleAllClicks = this._handleAllClicks.bind(this);
        this.state = {
            open: false
        };
    }

    render() {
        let { className = '', options, onChange } = this.props,
            { width = 150, tipOffset = 6 } = this.props;

        return (
            <span 
                ref={ ref => this._container = ref }
                className={ `${block} ${className}` }>
                <span
                    className={ `${block}__trigger` }
                    onClick={ this._toggle.bind(this) }>
                    { this.props.children }
                </span>

                { this.state.open ? (
                    <div 
                        className={ `${block}__menu` }
                        style={{ width }} >
                        { options.map(option => (
                            <button
                                key={ option.label }
                                className={ `${block}__option` }
                                onClick={ option.onClick || onChange.bind(null, option) }>
                                { option.label }
                            </button>
                        ))}

                        <figure 
                            className={ `${block}__tip` }
                            style={{ right: tipOffset }} />
                    </div>
                ) : null }
            </span>
        );
    }

    componentWillMount() {
        if ( document ) {
            document.addEventListener(
                'click',
                this._handleAllClicks
            );
        }
    }

    componentWillUnmount() {
        if ( document ) {
            document.removeEventListener(
                'click',
                this._handleAllClicks
            );
        }
    }

    /**
     * Display and hide the menu
     * 
     */
    _toggle() {
        this.setState({
            open: !this.state.open
        });
    }

    /**
     * Handle any clicks throughout the page
     *
     * @param {object} e - Native click event
     */
    _handleAllClicks(e) {
        if ( !this._container.contains(e.target) ) {
            this.setState({
                open: false
            });
        }
    }
}