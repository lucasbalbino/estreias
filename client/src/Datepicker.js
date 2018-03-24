import React, {PureComponent} from 'react';
import Moment from 'react-moment';
import moment from 'moment';
import 'moment/locale/pt-br';
import PropTypes from 'prop-types';

import './Datepicker.css';

class Datepicker extends PureComponent {

    render() {
        const type = this.props.type;
        const date = moment(this.props.releaseDate, "YYYY-MM-DD");
        const nextDate = moment(this.props.nextDate, "YYYY-MM-DD");
        const previousDate = moment(this.props.previousDate, "YYYY-MM-DD");

        let dateString =
            (<span>
                <Moment format="LL" locale="pt-br" add={{days: 1}}>
                    {previousDate}
                </Moment> - <Moment format="LL" locale="pt-br">
                    {date}
                </Moment>
            </span>);

        let classType = "datepicker " + type;
        return (
            <section classID="datepicker" className={classType}>
                <button className={previousDate.isValid() ? "button pull-left" : "button pull-left disabled"}
                        onClick={() => {
                            if (previousDate.isValid()) this.props.change(previousDate)
                        }}
                        disabled={!previousDate.isValid()}>
                    <i className="fa fa-chevron-circle-left" aria-hidden="true"/> Anterior
                </button>
                {dateString}
                <button className={nextDate.isValid() ? "button pull-right" : "button pull-right disabled"}
                        onClick={() => {
                            if (nextDate.isValid()) this.props.change(nextDate)
                        }}
                        disabled={!nextDate.isValid()}>
                    Próximo <i className="fa fa-chevron-circle-right" aria-hidden="true"/>
                </button>
            </section>
        );
    }
}

Datepicker.propTypes = {
    type: PropTypes.string
};

export default Datepicker;
