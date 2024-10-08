import { exhaustive } from "exhaustive";

// ------------------------------------------ Type of the lib Discrim (ignore it) -----------------
type ValidateOutput<T> = unknown extends T ? unknown : T;
type ExhaustiveTag<
  Union extends object,
  Tag extends keyof Union,
  Output = unknown,
> = [Union[Tag]] extends [string]
  ? {
      [Key in `${Union[Tag]}`]: (
        value: Extract<
          Union,
          {
            [K in Tag]: Key;
          }
        >,
      ) => Output;
    } & ExhaustiveDefaultCase<NoInfer<Output>>
  : Union[Tag] extends boolean
    ? {
        true: (
          value: Extract<
            Union,
            {
              [K in Tag]: true;
            }
          >,
        ) => Output;
        false: (
          value: Extract<
            Union,
            {
              [K in Tag]: false;
            }
          >,
        ) => Output;
      } & ExhaustiveDefaultCase<NoInfer<Output>>
    : never;
type ExhaustiveDefaultCase<Output> = {
  /**
   * Default case
   *
   * @description
   * When declared, "exhaustive" will fallback to this case
   * instead of throwing an unreachable error on unmatched case
   */
  _?: (value: never) => Output;
};

type ValidateKeys<T, U> = [keyof T] extends [keyof U]
  ? T
  : {
      [Key in keyof U]: Key extends keyof T ? T[Key] : never;
    };

type MatchCases<InferredCases, StrictCases, Output> = unknown extends Output
  ? InferredCases
  : StrictCases;
type ExtractOutput<
  Cases extends Record<string, (...args: any) => unknown>,
  Output,
> = unknown extends Output
  ? ValidateOutput<ReturnType<Cases[keyof Cases]>>
  : Output;

// ----------------------------------- Lib Discrim ------------------------------------------
export interface Discrim {
  __kind: string;
}

export const matchType = <
  Union extends object,
  Tag extends keyof Union & "__kind",
  Output,
  Cases extends ExhaustiveTag<Union, Tag, unknown> = ExhaustiveTag<
    Union,
    Tag,
    unknown
  >,
>(
  union: Union,
  cases: MatchCases<
    ValidateKeys<Cases, ExhaustiveTag<Union, Tag, unknown>>,
    ExhaustiveTag<Union, Tag, Output>,
    Output
  >,
): ExtractOutput<Cases, Output> => {
  //@ts-ignore
  return exhaustive.tag(union, "__kind", cases);
};
