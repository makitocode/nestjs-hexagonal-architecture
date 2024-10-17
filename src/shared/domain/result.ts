/**
 * Represents the Result of an operation.
 * @template Value - The type of value that the result should hold if successful.
 */
export class Result<Value> {
  /**
   * Represents whether the operation was successful.
   * @type {boolean}
   */
  public readonly isSuccess: boolean;

  /**
   * Represents whether the operation has failed.
   * It is essentially the opposite of `isSuccess`.
   * @type {boolean}
   */
  public readonly isFailure: boolean;

  /**
   * Represents the error occurred during the operation, if any.
   * This property is defined only if `isFailure` is `true`.
   * @type {Value | string | undefined}
   */
  public readonly error?: Error | string;

  /**
   * Represents the value resulting from a successful operation.
   * This property is defined only if `isSuccess` is `true`.
   * @type {Value | undefined}
   */
  private readonly _value?: Value;

  /**
   * @param isSuccess - Represents whether the operation was successful or not.
   * @param error - Represents the error occurred during the operation.
   * @param value - Represents the value to be held by Result if successful.
   */
  public constructor(isSuccess: boolean, error?: string, value?: Value) {
    if (isSuccess && error) {
      throw new Error("InvalidOperation: A result cannot be successful and contain an error");
    }
    if (!isSuccess && !error) {
      throw new Error("InvalidOperation: A failing result needs to contain an error message");
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error;
    this._value = value;

    Object.freeze(this);
  }

  /**
   * Gets the value held by Result.
   * @returns The value if successful.
   * @throws If the operation was a failure.
   */
  public getValue(): Value {
    if (!this.isSuccess) {
      // console.log(this.error);
      throw new Error("Can't get the value of an error result. Use 'errorValue' instead.");
    }

    return this._value;
  }

  /**
   * Gets the error value held by Result.
   * @returns The error value.
   */
  public errorValue(): Value {
    return this.error as Value;
  }

  /**
   * Creates a new Result object representing a successful operation.
   * @template U - The type of value that the Result object should hold.
   * @param value - The value to be held by the Result object.
   * @returns A Result object representing a successful operation.
   */
  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, null, value);
  }

  /**
   * Creates a new Result object representing a failed operation.
   * @template U - The type of error that the Result object should hold.
   * @param error - The error to be held by the Result object.
   * @returns A Result object representing a failed operation.
   */
  public static fail<U>(error: any): Result<U> {
    return new Result<U>(false, error);
  }

  /**
   * Combines multiple Result objects and returns the first failing Result object if any.
   * @param results - An array of Result objects to be combined.
   * @returns A Result object representing a successful operation if all Result objects in the array are successful,
   * or the first failing Result object encountered in the array.
   */
  public static combine(results: Result<any>[]): Result<any> {
    for (const result of results) {
      if (result.isFailure) return result;
    }
    return Result.ok();
  }
}

/**
 * Represents a value of one of two possible types (a disjoint union).
 * @template L - The type of the "Left" value.
 * @template R - The type of the "Right" value.
 */
export type Either<L, R> = Left<L, R> | Right<L, R>;

/**
 * Represents the Left side of an Either type.
 * @template L - The type of value that Left should hold.
 * @template R - The type of value that Right should hold.
 */
export class Left<L, R> {
  readonly value: L;

  constructor(value: L) {
    this.value = value;
  }

  isLeft(): this is Left<L, R> {
    return true;
  }

  isRight(): this is Right<L, R> {
    return false;
  }
}

/**
 * Represents the Right side of an Either type.
 * @template L - The type of value that Left should hold.
 * @template R - The type of value that Right should hold.
 */
export class Right<L, R> {
  readonly value: R;

  constructor(value: R) {
    this.value = value;
  }

  isLeft(): this is Left<L, R> {
    return false;
  }

  isRight(): this is Right<L, R> {
    return true;
  }
}

/**
 * Creates a new Left value.
 * @template L - The type of value that Left should hold.
 * @template R - The type of value that Right should hold.
 * @param l - The value to be held by Left.
 * @returns R Left value.
 */
export const left = <L, R>(l: L): Either<L, R> => {
  return new Left(l);
};

/**
 * Creates a new Right value.
 * @template L - The type of value that Left should hold.
 * @template R - The type of value that Right should hold.
 * @param r - The value to be held by Right.
 * @returns R Right value.
 */
export const right = <L, R>(r: R): Either<L, R> => {
  return new Right<L, R>(r);
};
