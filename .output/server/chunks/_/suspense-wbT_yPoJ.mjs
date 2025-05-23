import { jsxs, jsx } from 'react/jsx-runtime';
import { u as useSuspenseQuery } from './useSuspenseQuery-D_gTj2Eu.mjs';
import { R as Route$5, L as Link, g as getServerPokemonList } from './ssr.mjs';
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell, f as buttonVariants, g as cn } from './table-VHJbrm0X.mjs';
import { useMemo } from 'react';
import 'react-dom';
import 'valibot';
import 'drizzle-orm';
import 'drizzle-orm/libsql';
import '@t3-oss/env-core';
import 'drizzle-orm/sqlite-core';
import 'node:async_hooks';
import 'node:stream';
import 'react-dom/server';
import 'node:stream/web';
import 'class-variance-authority';
import 'clsx';
import 'tailwind-merge';

const POKEMON_LIMIT = 20;
const matchPokemonIdExp = /\/api\/v2\/pokemon\/(\d+)\/?/;
const SplitComponent = function RouteComponent() {
  var _a;
  const {
    offset: currentOffset
  } = Route$5.useSearch();
  const newKey = ["pokemon-list", "suspense", {
    limit: POKEMON_LIMIT,
    offset: currentOffset
  }];
  const {
    data
  } = useSuspenseQuery({
    queryKey: newKey,
    queryFn: async () => {
      const result = await getServerPokemonList({
        data: {
          offset: currentOffset
        }
      });
      return {
        results: result.pokemon.map((p) => ({
          name: p.name,
          url: `/api/v2/pokemon/${p.id}/`
        })),
        next: result.nextOffset !== null ? `/api/v2/pokemon/?offset=${result.nextOffset}` : null,
        previous: result.prevOffset !== null ? `/api/v2/pokemon/?offset=${result.prevOffset}` : null
      };
    }
  });
  const previousOffset = useMemo(() => {
    var _a2;
    if ((data == null ? void 0 : data.previous) == null) {
      return null;
    }
    return (_a2 = new URL(data.previous).searchParams.get("offset")) != null ? _a2 : null;
  }, [data == null ? void 0 : data.previous]);
  const nextOffset = useMemo(() => {
    var _a2;
    if ((data == null ? void 0 : data.next) == null) {
      return null;
    }
    return (_a2 = new URL(data.next).searchParams.get("offset")) != null ? _a2 : null;
  }, [data == null ? void 0 : data.next]);
  const results = (_a = data.results) != null ? _a : [];
  return /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
    /* @__PURE__ */ jsxs("h1", { className: "text-2xl font-bold mb-4", children: [
      "National Pok\xE9dex: Pok\xE9mon ",
      currentOffset + 1,
      "-",
      currentOffset + POKEMON_LIMIT
    ] }),
    /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { children: "#" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Name" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Details" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: results.map((pokemon) => {
        var _a2;
        return /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { children: (_a2 = pokemon.url.match(matchPokemonIdExp)) == null ? void 0 : _a2[1] }),
          /* @__PURE__ */ jsx(TableCell, { className: "capitalize", children: pokemon.name }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("a", { href: pokemon.url, target: "_blank", rel: "noopener noreferrer", className: "text-blue-600 underline", children: "View" }) })
        ] }, pokemon.name);
      }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-center gap-4 mt-4", children: [
      /* @__PURE__ */ jsx(Link, { to: "/suspense", className: buttonVariants({
        variant: "outline",
        className: cn(!previousOffset && "opacity-50 cursor-not-allowed")
      }), search: {
        offset: Number(previousOffset)
      }, disabled: !previousOffset, children: "Previous" }),
      /* @__PURE__ */ jsx(Link, { to: "/suspense", search: {
        offset: Number(nextOffset)
      }, className: buttonVariants({
        variant: "outline",
        className: cn(!nextOffset && "opacity-50 cursor-not-allowed")
      }), disabled: !nextOffset, children: "Next" })
    ] })
  ] });
};

export { SplitComponent as component };
//# sourceMappingURL=suspense-wbT_yPoJ.mjs.map
