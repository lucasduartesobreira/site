declare const tags: unique symbol;

export type Tagged<BaseType, Tags extends string> = BaseType extends {
  [tags]: infer OldTags;
}
  ? BaseType extends infer Base & { [tags]: OldTags }
    ? Base & { [tags]: OldTags | Tags }
    : never
  : BaseType & { [tags]: Tags };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function tagger<Tag extends string>(_tag: Tag) {
  return <Type>(v: Type) => {
    return v as Tagged<Type, Tag>;
  };
}

export type GetTags<
  Type extends
    | { [tags]: unknown }
    | ((...args: unknown[]) => Tagged<unknown, string>),
> = Type extends { [tags]: unknown }
  ? GetTagsFromTagged<Type>
  : Type extends (...args: unknown[]) => Tagged<unknown, string>
    ? GetTagsFromTags<Type>
    : never;

export type GetTagsFromTagged<Type extends { [tags]: unknown }> = Type extends {
  [tags]: infer Tags;
}
  ? Tags
  : never;

export type GetTagsFromTags<
  Fn extends (...args: unknown[]) => Tagged<unknown, string>,
> = GetTagsFromTagged<ReturnType<Fn>>;
