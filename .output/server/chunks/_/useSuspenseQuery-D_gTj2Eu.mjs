import { u as useBaseQuery, Q as QueryObserver, h as defaultThrowOnError } from './table-VHJbrm0X.mjs';

function useSuspenseQuery(options, queryClient) {
  return useBaseQuery(
    {
      ...options,
      enabled: true,
      suspense: true,
      throwOnError: defaultThrowOnError,
      placeholderData: void 0
    },
    QueryObserver,
    queryClient
  );
}

export { useSuspenseQuery as u };
//# sourceMappingURL=useSuspenseQuery-D_gTj2Eu.mjs.map
