import { MinLength } from 'class-validator';

export const IsPassword = () => MinLength(5);
