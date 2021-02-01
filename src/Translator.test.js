import { translate } from './Translator';

describe('翻译题目类型', () => {
    test('多选', () => {
        expect(translate('abc')).toEqual('abc');
    });
});