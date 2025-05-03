import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/intent-preloading')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/intent-preloading"!</div>
}
