import { jsxs, jsx } from 'react/jsx-runtime';
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell, f as buttonVariants, g as cn, u as useBaseQuery, Q as QueryObserver } from './table-VHJbrm0X.mjs';
import { e as Route$1, P as POKEMON_LIMIT$3, L as Link, d as useRouter, i as isRedirect, g as getServerPokemonList } from './ssr.mjs';
import { useMemo } from 'react';
import 'class-variance-authority';
import 'clsx';
import 'tailwind-merge';
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

function useQuery(options, queryClient) {
  return useBaseQuery(options, QueryObserver, queryClient);
}
function useServerFn(serverFn) {
  const router = useRouter();
  return async (...args) => {
    try {
      const res = await serverFn(...args);
      if (isRedirect(res)) {
        throw res;
      }
      return res;
    } catch (err) {
      if (isRedirect(err)) {
        err.options._fromLocation = router.state.location;
        return router.navigate(router.resolveRedirect(err).options);
      }
      throw err;
    }
  };
}
const SplitComponent = function RouteComponent() {
  var _a;
  const getPokemonList = useServerFn(getServerPokemonList);
  const {
    offset: currentOffset
  } = Route$1.useSearch();
  const newKey = ["pokemon-list", "basic", {
    limit: POKEMON_LIMIT$3,
    offset: currentOffset
  }];
  const {
    data,
    error
  } = useQuery({
    queryKey: newKey,
    queryFn: async () => {
      return await getPokemonList({
        data: {
          offset: currentOffset
        }
      });
    }
  });
  const previousOffset = useMemo(() => {
    if ((data == null ? void 0 : data.prevOffset) == null) {
      return null;
    }
    return data.prevOffset.toString();
  }, [data == null ? void 0 : data.prevOffset]);
  const nextOffset = useMemo(() => {
    if ((data == null ? void 0 : data.nextOffset) == null) {
      return null;
    }
    return data.nextOffset.toString();
  }, [data == null ? void 0 : data.nextOffset]);
  if (data) {
    const results = (_a = data.pokemon) != null ? _a : [];
    return /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
      /* @__PURE__ */ jsxs("h1", { className: "text-2xl font-bold mb-4", children: [
        "National Pok\xE9dex: Pok\xE9mon ",
        currentOffset + 1,
        "-",
        currentOffset + POKEMON_LIMIT$3
      ] }),
      /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "#" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Name" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Details" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: results.map((pokemon) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { children: pokemon.id }),
          /* @__PURE__ */ jsx(TableCell, { className: "capitalize", children: pokemon.name }),
          /* @__PURE__ */ jsx(TableCell, { children: pokemon.types.map((type) => /* @__PURE__ */ jsx("span", { className: "inline-block px-2 py-1 mr-1 text-sm font-medium rounded-full bg-gray-100", children: type.type.name }, type.type.name)) })
        ] }, pokemon.name)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-center gap-4 mt-4", children: [
        /* @__PURE__ */ jsx(Link, { to: "/basic", className: buttonVariants({
          variant: "outline",
          className: cn(!previousOffset && "opacity-50 cursor-not-allowed")
        }), search: {
          offset: Number(previousOffset)
        }, disabled: !previousOffset, children: "Previous" }),
        /* @__PURE__ */ jsx(Link, { to: "/basic", search: {
          offset: Number(nextOffset)
        }, className: buttonVariants({
          variant: "outline",
          className: cn(!nextOffset && "opacity-50 cursor-not-allowed")
        }), disabled: !nextOffset, children: "Next" })
      ] })
    ] });
  }
  if (error) return /* @__PURE__ */ jsx("div", { children: "Error loading Pok\xE9mon." });
  return /* @__PURE__ */ jsx("div", { children: "No data" });
};

export { SplitComponent as component };
//# sourceMappingURL=basic-D2SeuWcm.mjs.map
