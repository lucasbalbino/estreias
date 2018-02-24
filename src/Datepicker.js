import React, {PureComponent} from 'react';
import Moment from 'react-moment';
import 'moment/locale/pt-br';
import PropTypes from 'prop-types';

import './Datepicker.css';

class Datepicker extends PureComponent {

    render() {
        const type = this.props.type;
        const date = this.props.releaseDate;

        let classType = "datepicker " + type;
        return (
            <section classID="datepicker" className={classType}>
                <button className="button pull-left">
                    <i className="fa fa-chevron-circle-left" aria-hidden="true"/> Anterior
                </button>
                <span>
                    <Moment format="LL" locale="pt-br">
                        {date}
                    </Moment> - <Moment format="LL" locale="pt-br" add={{days: 6}}>
                        {date}
                    </Moment>
                </span>
                <button className="button pull-right" href="#">
                    Próximo <i className="fa fa-chevron-circle-right" aria-hidden="true"/>
                </button>
            </section>
        );
    }
}

Datepicker.propTypes = {
    releaseDate: PropTypes.instanceOf(Date)
};

export default Datepicker;
