import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import './Datepicker.css';

class Datepicker extends PureComponent {

    render() {
        return (
            <section classID="datepicker" className="datepicker">
                <button className="button pull-left">
                    <i className="fa fa-chevron-circle-left" aria-hidden="true"/> Anterior
                </button>
                <span>{this.props.periodo}</span>
                <button className="button pull-right" href="#">
                    Próximo <i className="fa fa-chevron-circle-right" aria-hidden="true"/>
                </button>
            </section>
        );
    }
}

Datepicker.propTypes = {
    titulo: PropTypes.string
};

export default Datepicker;
