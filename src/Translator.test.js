import { translate } from './Translator';
import { each } from 'underscore';

describe('翻译标题行', () => {
    test('多选', () => {
        var expected = [
            expect.stringContaining('item = form.addCheckboxItem();'),
            expect.stringContaining('item.setTitle(\'这是多选题\');'),
            expect.stringContaining('item.setChoices(['),
        ];
        each(expected, function (result) {
            expect(translate('[多选] 这是多选题')).toEqual(result);
        });
    });
    test('单选', () => {
        var expected = [
            expect.stringContaining('item = form.addMultipleChoiceItem();'),
            expect.stringContaining('item.setTitle(\'这是单选题\');'),
            expect.stringContaining('item.setChoices(['),
        ];
        each(expected, function (result) {
            expect(translate('[单选] 这是单选题')).toEqual(result);
        });
    });
    test('分节', () => {
        var expected = [
            expect.stringContaining('item = form.addSectionHeaderItem();'),
            expect.stringContaining('item.setTitle(\'这是用来分节的\');'),
        ];
        each(expected, function (result) {
            expect(translate('[分节] 这是用来分节的')).toEqual(result);
        });
    });
});

describe('翻译选项与答案', () => {
    test('多选', () => {
        var expected = [
            expect.stringContaining('item.createChoice(\'A 选项A\',true),'),
            expect.stringContaining('item.createChoice(\'B 选项B\',false),'),
            expect.stringContaining('item.createChoice(\'C 选项C\',true),'),
            expect.stringContaining(']);'),
            expect.stringContaining('item.setPoints(1);'),
            expect.stringContaining('item.setRequired(true);'),
        ];
        each(expected, function (result) {
            translate('A 选项A');
            translate('B 选项B');
            translate('C 选项C');
            var output = translate('答案：AC');
            expect(output).toEqual(result);
        });
    });
    test('单选', () => {
        var expected = [
            expect.stringContaining('item.createChoice(\'A 选项A\',false),'),
            expect.stringContaining('item.createChoice(\'B 选项B\',false),'),
            expect.stringContaining('item.createChoice(\'C 选项C\',true),'),
            expect.stringContaining(']);'),
            expect.stringContaining('item.setPoints(1);'),
            expect.stringContaining('item.setRequired(true);'),
        ];
        each(expected, function (result) {
            translate('A 选项A');
            translate('B 选项B');
            translate('C 选项C');
            var output = translate('答案：C');
            expect(output).toEqual(result);
        });
    });
});

describe('翻译答案描述', () => {
    test('答案描述', () => {
        var expected = [
            expect.stringContaining('item.setFeedbackForCorrect(FormApp.createFeedback().setText(\'解析：答案解析\').build());'),
            expect.stringContaining('item.setFeedbackForIncorrect(FormApp.createFeedback().setText(\'解析：答案解析\').build());'),
        ];
        each(expected, function (result) {
            expect(translate('解析：答案解析')).toEqual(result);
        });
    })
});

describe('空行', () => {
    test('空行返回空字符串',() => {
        expect(translate('')).toEqual('');
    });
});

describe('翻译分节描述行', () => {
    test('分节描述行 - 单行', () => {
        translate('1 就只是描述');
        expect(translate('[分节结束]')).toEqual(expect.stringContaining('item.setHelpText(\'1 就只是描述\');'))
    });
    test('分节描述行 - 多行', () => {
        translate('1 就只是描述');
        translate('2 还是描述');
        expect(translate('[分节结束]')).toEqual(expect.stringContaining('item.setHelpText(\'1 就只是描述\\n2 还是描述\');'))
    });
});