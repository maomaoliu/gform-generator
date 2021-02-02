import React from 'react';
import { map, reduce } from 'underscore';
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

    formBeginningInfo = [
        'var form = FormApp.create(\'请重命名表单\');',
        'var item;',
        'form.setIsQuiz(true);',
        'form.setProgressBar(true);',
        'form.setCollectEmail(true);',
    ].join('\n');

    formEndingInfo = [
        "Logger.log('Published URL: ' + form.getPublishedUrl());",
        "Logger.log('Editor URL: ' + form.getEditUrl());",
        "Logger.log('ID: ' + form.getId());",
    ].join('\n');

    handleChange(event) {
        var outputLines = map(event.target.value.split('\n'), translate).filter((line) => line !== '');
        var output = reduce(outputLines, (memo, item) => { return memo + '\n' + item; }, this.formBeginningInfo);
        output = output + '\n' + this.formEndingInfo;
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