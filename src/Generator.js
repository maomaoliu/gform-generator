import React from 'react';
import _, { map, reduce } from 'underscore';
import { translate } from './Translator';

class Generator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 'Input text area.',
            outputValue: 'Output text area.'
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        var outputLines = map(event.target.value.split('\n'), translate);
        var output = reduce(outputLines, function(memo, item){ return memo + '\n' + item; }, '');
        this.setState({ outputValue: output });
    }

    render() {
        return (
            <div className="generator" >
                <header className="app-header">
                    <h1>
                        Google Form script translator.
                    </h1>
                </header>
                <div className="main">
                    <div className="input-panel">
                        <textarea defaultValue={this.state.value} onChange={this.handleChange} />
                    </div>
                    <div className="output-panel">
                        <textarea value={this.state.outputValue} readOnly />
                    </div>
                </div>
            </div>
        );
    }
}

export default Generator;