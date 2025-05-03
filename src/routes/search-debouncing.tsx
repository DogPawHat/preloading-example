import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/search-debouncing')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/search-debouncing"!</div>
}
