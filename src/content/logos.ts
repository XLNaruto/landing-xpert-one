import type { ClientLogo } from "@/types"

/**
 * Placeholder wordmarks, drawn to a common 220×48 box so the strip never
 * jumps when one is swapped for a client's real logo.
 */
export const logos: ClientLogo[] = [
  { name: "Client One", src: "/media/logos/clients/client-one.svg", width: 220, height: 48 },
  { name: "Client Two", src: "/media/logos/clients/client-two.svg", width: 220, height: 48 },
  { name: "Client Three", src: "/media/logos/clients/client-three.svg", width: 220, height: 48 },
  { name: "Client Four", src: "/media/logos/clients/client-four.svg", width: 220, height: 48 },
  { name: "Client Five", src: "/media/logos/clients/client-five.svg", width: 220, height: 48 },
]
