import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/preloading')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/preloading"!</div>
}
