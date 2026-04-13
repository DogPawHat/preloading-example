## Design Context

### Users

**Primary audience**: Developers learning TanStack Router/Query prefetching patterns
**Context**: Educational material consumed during focused learning sessions — following tutorials, referencing implementations, or teaching workshops
**Job to be done**: Understand how different prefetching strategies work through interactive examples; eventually read companion blog posts for deeper explanation

### Brand Personality

**Voice**: Technical, minimalistic, informative
**Tone**: Precise but approachable — like a well-crafted developer tool or technical documentation that respects the reader's intelligence
**Emotional goals**: Confidence ("I understand this now"), clarity (no cognitive load from visual noise), trust (this is correct and well-built)

### Aesthetic Direction

**Visual tone**: Developer console aesthetic — functional, information-dense, purposeful
**Theme**: Light AND dark mode (system preference + manual toggle)
**References**:

- https://www.effect.website/ — clean technical aesthetic, purposeful spacing, no decorative fluff, strong information hierarchy
  **Anti-references**:
- AI-generated UI (GPT-5+ style) — generic gradients, glassmorphism without purpose, "designed" looking elements that serve no function
- Gradient text, side-stripe borders, glow effects
- Template-y dashboard patterns

### Design Principles

1. **Function over decoration** — Every visual element must earn its place. No decorative gradients, no pointless shadows, no "visual interest" that doesn't aid comprehension.

2. **Information density is a feature** — This is teaching material. Users need to see code, data, and state at a glance. White space is good; empty space is wasteful.

3. **State should be visible** — Cache status, loading states, prefetch activity — these are the _point_ of the demo. Make them obvious without being intrusive.

4. **Respect the code** — The typography and layout should make code snippets feel at home. Monospace is appropriate here because it's literally about code.

5. **Dark mode is not an afterthought** — Both themes should be equally considered, equally usable, and equally "correct."

6. **Accessibility is non-negotiable** — WCAG 2.1 AA compliance for EU EAA requirements. Sufficient contrast, keyboard navigation, reduced motion support, screen reader friendly.

### Technical Notes

- Current stack: TanStack Start, Tailwind v4, JetBrains Mono (already in place)
- The warm beige + amber palette works for light mode; needs a thoughtful dark counterpart
- Status dots (cached/fetching/idle) are a key interaction pattern — preserve and refine
- Hairline borders and zero border-radius fit the technical aesthetic
