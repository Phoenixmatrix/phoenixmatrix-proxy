import * as ramda from 'ramda';

declare module 'ramda' {
  export function invoker(foo: string): Date;
}

declare module 'foo' {
  export default 'foo';
}
