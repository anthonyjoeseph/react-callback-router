import * as R from "fp-ts-routing";
import { unionize, UnionOf, ofType } from "unionize";

export const AppRoute = unionize({
  Home: {},
  Squirrel: {},
  SquirrelError: ofType<{ type: 'nut' | 'tree' }>(),
  NotFound: {},
});

export type AppRoute = UnionOf<typeof AppRoute>;

export const homeDuplex = R.end;
export const squirrelDuplex = R.lit('squirrel').then(R.end);
export const squirrelErrorDuplex = R.lit('error').then(R.str('id')).then(R.end);

export const parser = R.zero<AppRoute>()
  .alt(homeDuplex.parser.map(() => AppRoute.Home()))
  .alt(squirrelDuplex.parser.map(() => AppRoute.Squirrel()))
  .alt(squirrelErrorDuplex.parser.map(({ id }) => id === 'nut' || id === 'tree'
    ? AppRoute.SquirrelError({ type: id })
    : AppRoute.NotFound()
  ));

export const formatter = AppRoute.match<string>({
  NotFound: () => R.format(homeDuplex.formatter, {}),
  Home: () => R.format(homeDuplex.formatter, {}),
  Squirrel: () => R.format(squirrelDuplex.formatter, {}),
  SquirrelError: ({ type }) => R.format(squirrelErrorDuplex.formatter, { id: type }),
});