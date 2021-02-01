import { each, map, toArray, union } from 'underscore';

var itemCache = [];

function resetCache() {
    itemCache = [];
}

function addToCache(item) {
    itemCache.push(item);
}

export function translate(line) {
    line = line.trim();
    var output = '';
    var lineType = decideLineType(line);
    if (lineType === lineTypes.TypeLine) {
        each(translateTypeLine(line), (line) => {
            output = appendNewLine(output, line);
        });
    }
    if (lineType === lineTypes.OptionLine) {
        addToCache(line);
    }
    if (lineType === lineTypes.AnswerLine) {
        each(translateAnswerLine(line), (line) => {
            output = appendNewLine(output, line);
        });
    }
    if (lineType === lineTypes.AnswerDescLine) {
        each(translateAnswerDesc(line), (line) => {
            output = appendNewLine(output, line);
        });
    }
    if (lineType === lineTypes.SectionDescLine) {
        addToCache(line);
    }

    return output;
};

function translateAnswerLine(line) {
    var answers = line.match(answerRegex)[0];
    var options = map(itemCache, (item) => {
        return translateOption(item, answers.includes(item.charAt(0)));
    });
    return union(toArray(options), afterOption());
}

function translateTypeLine(line) {
    var itemType = decideItemType(line);

    return [
        translateTypeScript(itemType),
        translateTitle(line),
        afterTitle(itemType),
    ];
}

function translateTypeScript(itemType) {
    if (itemType === itemTypes.CheckboxItem) {
        return 'item = form.addCheckboxItem();';
    }
    if (itemType === itemTypes.RadioboxItem) {
        return 'item = form.addMultipleChoiceItem();';
    }
    if (itemType === itemTypes.SectionDesc) {
        return 'item = form.addSectionHeaderItem();';
    }
    if (itemType === itemTypes.SectionDescEnd) {
        return 'item.setHelpText(\''+ itemCache.join('\n') + '\');';
    }
}

function translateTitle(line) {
    var title = line.split(']')[1].trim();
    if (title === '') return;
    return 'item.setTitle(\'' + title + '\');';
}

function afterTitle(itemType) {
    if ([itemTypes.CheckboxItem, itemTypes.RadioboxItem].includes(itemType)) {
        return 'item.setChoices([';
    }
}

function translateOption(optionValue, isAnswer) {
    return 'item.createChoice(\'' + optionValue + '\',' + isAnswer + '),';
}

function afterOption() {
    return [
        ']);',
        'item.setPoints(1);',
        'item.setRequired(true);',
    ];
}

function translateAnswerDesc(line) {
    return [
        'item.setFeedbackForCorrect(FormApp.createFeedback().setText(\'' + line + '\').build());',
        'item.setFeedbackForIncorrect(FormApp.createFeedback().setText(\'' + line + '\').build());',
    ];
}

function decideLineType(line) {
    if (line.startsWith('[')) return lineTypes.TypeLine;
    if (line.match(optionRegex) !== null) return lineTypes.OptionLine;
    if (line.startsWith('答案')) return lineTypes.AnswerLine;
    if (line.startsWith('解析')) return lineTypes.AnswerDescLine;
    if (line !== '') return lineTypes.SectionDescLine;
}

function decideItemType(line) {
    if (line.startsWith('[多选]')) return itemTypes.CheckboxItem;
    if (line.startsWith('[单选]')) return itemTypes.RadioboxItem;
    if (line.startsWith('[分节]')) return itemTypes.SectionDesc;
    if (line.startsWith('[分节结束]')) return itemTypes.SectionDescEnd;
}

function appendNewLine(exists, newLine) {
    resetCache();
    if (newLine === undefined) return exists;
    return exists + '\n' + newLine;
}

const itemTypes = {
    CheckboxItem: 'CheckboxItem', RadioboxItem: 'RadioboxItem', SectionDesc: 'SectionDesc', SectionDescEnd: 'SectionDescEnd'
};

const lineTypes = {
    TypeLine: 'TypeLine', OptionLine: 'OptionLine', AnswerLine: 'AnswerLine', AnswerDescLine: 'AnswerDescLine', SectionDescLine: 'SectionDescLine'
}

const optionRegex = /^[A-Z]\s.+/g;
const answerRegex = /[A-Z]+/g;