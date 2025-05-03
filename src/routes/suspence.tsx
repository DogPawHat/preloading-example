import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/suspence')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/suspence"!</div>
}
