import React, {PureComponent} from 'react';
import Moment from 'react-moment';
import moment from 'moment';
import 'moment/locale/pt-br';
import PropTypes from 'prop-types';

import './Datepicker.css';

class Datepicker extends PureComponent {

    render() {
        const type = this.props.type;
        const releaseDate = moment(this.props.releaseDate, "DD-MM-YYYY");
        const nextDate = moment(this.props.nextDate, "DD-MM-YYYY");
        const previousDate = moment(this.props.previousDate, "DD-MM-YYYY");
        console.log(previousDate, nextDate);

        let date = <Moment format="LL" locale="pt-br">{releaseDate}</Moment>;

        if(type === "cinema") {
            date = <span>
                    <Moment format="LL" locale="pt-br">
                        {releaseDate}
                    </Moment> - <Moment format="LL" locale="pt-br" add={{days: 6}}>
                        {releaseDate}
                    </Moment>
                </span>;
        }

        let classType = "datepicker " + type;
        return (
            <section classID="datepicker" className={classType}>
                <button className={previousDate.isValid() ? "button pull-left" : "button pull-left disabled"}
                        onClick={() => {if(previousDate.isValid()) this.props.change(previousDate)}}
                        disabled={!previousDate.isValid()}>
                    <i className="fa fa-chevron-circle-left" aria-hidden="true"/> Anterior
                </button>
                {date}
                <button className={nextDate.isValid() ? "button pull-right" : "button pull-right disabled"}
                        onClick={() => {if(nextDate.isValid()) this.props.change(nextDate)}}
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
