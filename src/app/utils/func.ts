export type FunctionAX = (a: number, x: number) => number;

export interface TheFunction {
  func: FunctionAX;
  deriv: FunctionAX;
};
