import React, {PureComponent} from 'react';
import './Datepicker.css';

class Datepicker extends PureComponent {

    render() {
        return (
            <section classID="datepicker" className="datepicker">
                <button className="button pull-left">
                    <i className="fa fa-chevron-circle-left" aria-hidden="true"/> Anterior
                </button>
                <span>16 de Novembro de 2017 - 22 de Novembro de 2017</span>
                <button className="button pull-right" href="#">
                    Próximo <i className="fa fa-chevron-circle-right" aria-hidden="true"/>
                </button>
            </section>
        );
    }
}
export default Datepicker;
