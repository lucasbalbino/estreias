import React, {PureComponent} from 'react';
import Loading from './Loading';
import PropTypes from 'prop-types';

class Trailer extends PureComponent {
    constructor(props) {
        super(props);

        this.trailerLoaded = this.trailerLoaded.bind(this);

        this.state = {
            trailerIsLoading: true
        }
    }

    trailerLoaded = () => {
        this.setState({trailerIsLoading: false});
    };

    render() {
        let classType = "trailer-loading " + this.props.type;
        return (
            <div className="trailer embed-responsive embed-responsive-16by9">
                {this.state.trailerIsLoading ? <Loading type={classType}/> : null}
                <iframe title={this.props.title} src={this.props.src}
                        ref="iframe" onLoad={this.trailerLoaded}
                        width="560" height="315"
                        frameBorder="0" allowFullScreen/>
            </div>
        );
    }

}

Trailer.propTypes = {
    src: PropTypes.string.isRequired,
    title: PropTypes.string,
    type: PropTypes.string
};

export default Trailer;