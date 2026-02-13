import { cn } from "@/lib/utils"

interface PipelineCardProps {
  id: string
  title: string
  subtitle: string
  objective: string
  method: string
  ready: boolean
  position: { x: number; y: number }
  colorClass: string
}

interface PipelineConnectionProps {
  source: string
  target: string
  sourcePosition: { x: number; y: number }
  targetPosition: { x: number; y: number }
}

export function StaticPipelineCanvas() {
  // Define the cards with their properties
  const cards: PipelineCardProps[] = [
    {
      id: "A",
      title: "Centrifugation",
      subtitle: "Separation",
      objective: "Remove cells and large particulates from the culture supernatant.",
      method: "Centrifuge the cell culture medium.",
      ready: true,
      position: { x: 0, y: 0 },
      colorClass: "bg-blue-50 border-blue-500",
    },
    {
      id: "B",
      title: "Membrane Filtration",
      subtitle: "Separation",
      objective: "Remove fine particulates.",
      method: "Pass supernatant through a membrane filter.",
      ready: true,
      position: { x: 18, y: 0 },
      colorClass: "bg-green-50 border-green-500",
    },
    {
      id: "C",
      title: "Affinity Chromatography",
      subtitle: "Purification",
      objective: "Capture the target antibody.",
      method: "Use a ligand-specific affinity column.",
      ready: true,
      position: { x: 36, y: 0 },
      colorClass: "bg-violet-50 border-violet-500",
    },
    {
      id: "D",
      title: "Concentration (Centrifugal Filters)",
      subtitle: "Purification",
      objective: "Concentrate the antibody preparation.",
      method: "Spin down sample using centrifugal filters.",
      ready: true,
      position: { x: 0, y: 16 },
      colorClass: "bg-red-50 border-red-500",
    },
    {
      id: "E",
      title: "UV280 Measurement",
      subtitle: "Analysis",
      objective: "Determine antibody concentration.",
      method: "Use spectrophotometer at 280 nm.",
      ready: true,
      position: { x: 18, y: 16 },
      colorClass: "bg-amber-50 border-amber-600",
    },
    {
      id: "F",
      title: "SDS-PAGE",
      subtitle: "Analysis",
      objective: "Assess purity and molecular weight.",
      method: "Run gel electrophoresis.",
      ready: true,
      position: { x: 36, y: 16 },
      colorClass: "bg-teal-50 border-teal-600",
    },
  ]

  // Define the connections between cards
  const connections: PipelineConnectionProps[] = [
    {
      source: "A",
      target: "B",
      sourcePosition: { x: 0 + 16, y: 0 + 4 }, // Adjusted for card width and position
      targetPosition: { x: 18, y: 0 + 4 },
    },
    {
      source: "B",
      target: "C",
      sourcePosition: { x: 18 + 16, y: 0 + 4 },
      targetPosition: { x: 36, y: 0 + 4 },
    },
    {
      source: "A",
      target: "D",
      sourcePosition: { x: 0 + 4, y: 0 + 8 },
      targetPosition: { x: 0 + 4, y: 16 },
    },
    {
      source: "D",
      target: "E",
      sourcePosition: { x: 0 + 16, y: 16 + 4 },
      targetPosition: { x: 18, y: 16 + 4 },
    },
    {
      source: "E",
      target: "F",
      sourcePosition: { x: 18 + 16, y: 16 + 4 },
      targetPosition: { x: 36, y: 16 + 4 },
    },
  ]

  // Convert grid units to pixels
  const gridToPixel = (value: number) => value * 60

  return (
    <div className="relative w-full h-full bg-gray-50 overflow-auto">
      {/* Render the connections */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 6 3.5, 0 7" fill="#64748b" />
          </marker>
        </defs>

        {connections.map((connection, index) => {
          const sourceX = gridToPixel(connection.sourcePosition.x)
          const sourceY = gridToPixel(connection.sourcePosition.y)
          const targetX = gridToPixel(connection.targetPosition.x)
          const targetY = gridToPixel(connection.targetPosition.y)

          // Determine if it's a horizontal or vertical connection
          const isHorizontal = sourceY === targetY

          // Create a path with appropriate control points
          let path
          if (isHorizontal) {
            // Horizontal connection with slight curve
            path = `M ${sourceX} ${sourceY} C ${sourceX + 50} ${sourceY}, ${targetX - 50} ${targetY}, ${targetX} ${targetY}`
          } else {
            // Vertical connection with slight curve
            path = `M ${sourceX} ${sourceY} C ${sourceX} ${sourceY + 50}, ${targetX} ${targetY - 50}, ${targetX} ${targetY}`
          }

          return (
            <path
              key={`${connection.source}-${connection.target}`}
              d={path}
              stroke="#64748b"
              strokeWidth="2"
              fill="none"
              markerEnd="url(#arrowhead)"
            />
          )
        })}
      </svg>

      {/* Render the cards */}
      {cards.map((card) => (
        <div
          key={card.id}
          className={cn("absolute bg-white border rounded-md shadow-sm w-64", card.colorClass)}
          style={{
            transform: `translate(${gridToPixel(card.position.x)}px, ${gridToPixel(card.position.y)}px)`,
            zIndex: 1,
          }}
        >
          {/* Card Header */}
          <div
            className={cn("px-3 py-2 flex items-center justify-between rounded-t-md", card.colorClass.split(" ")[0])}
          >
            <div className="flex items-center flex-1 min-w-0">
              {/* Step Number */}
              <span className="text-gray-600 font-bold mr-2 text-base min-w-[20px]">{card.id}.</span>

              {/* Method Name */}
              <span className="font-medium truncate">{card.title}</span>
            </div>

            <div className="flex items-center ml-2 flex-shrink-0">
              {/* Status Badge */}
              <span
                className={cn(
                  "inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium mr-2",
                  card.ready ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800",
                )}
              >
                {card.ready ? "Ready" : "Not Ready"}
              </span>
            </div>
          </div>

          {/* Card Body */}
          <div className="px-3 py-2 text-sm">
            <div className="text-xs text-gray-500 mb-1">{card.subtitle}</div>

            <div className="mb-2">
              <span className="font-medium">Objective: </span>
              <span className="text-gray-700">{card.objective}</span>
            </div>

            <div>
              <span className="font-medium">Method: </span>
              <span className="text-gray-700">{card.method}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
