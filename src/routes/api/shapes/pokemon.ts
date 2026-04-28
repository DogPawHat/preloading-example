import { createFileRoute } from "@tanstack/react-router";
import { ELECTRIC_PROTOCOL_QUERY_PARAMS } from "@electric-sql/client";

import { env } from "~/env.js";

export const Route = createFileRoute("/api/shapes/pokemon")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        let electricUrl = new URL(`https://api.electric-sql.cloud/v1/shape`);
        const query = new URL(request.url).searchParams;

        // Forward only Electric protocol parameters
        ELECTRIC_PROTOCOL_QUERY_PARAMS.forEach((param) => {
          if (query.get(param)) {
            electricUrl.searchParams.set(param, query.get(param)!);
          }
        });

        // Server controls table and authorization
        electricUrl.searchParams.set("table", "pokemon");
        electricUrl.searchParams.append("source_id", env.ELECTRIC_SOURCE);
        electricUrl.searchParams.append("secret", env.ELECTRIC_SECRET);

        // Proxy response with streaming...
        const response = await fetch(electricUrl);

        const headers = new Headers(response.headers);
        headers.delete(`content-encoding`);
        headers.delete(`content-length`);

        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers,
        });
      },
    },
  },
});
