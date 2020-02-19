import { languageFunctions as rwLangFunctions } from './rw/lexical';
import { languageFunctions as enLangFunctions } from './en/lexical';

export type LangFuncsArray = { [key: string]: Function };

export default { ...rwLangFunctions, ...enLangFunctions } as LangFuncsArray;
