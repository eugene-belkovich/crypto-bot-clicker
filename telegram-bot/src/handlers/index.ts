import {Composer} from 'grammy';
import {startHandler} from './start';

export const handlers = new Composer();

handlers.use(startHandler);
