import { useMemo, useRef, useState } from "react";
import {
  CRITICALITY_TONE,
  ENVIRONMENT_TONE,
  assignNodeColors,
} from "../../lib/display";
import {
  CENTER_X,
  CENTER_Y,
  GRAPH_HEIGHT,
  GRAPH_WIDTH,
  LABEL_LIMIT,
  labelAnchor,
  layoutStar,
  truncate,
} from "../../lib/graphLayout";
import type { Application, Resource } from "../../types";
import { Badge } from "../ui/Badge";

function ResourceTooltip({
  resource,
  x,
  y,
  containerRef,
  onLeave,
}: {
  resource: Resource;
  x: number;
  y: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onLeave: (event: React.MouseEvent) => void;
}) {
  const below = y < CENTER_Y;
  const bridge = (
    <div
      onMouseLeave={onLeave}
      className="pointer-events-auto mx-auto h-10 w-16"
    />
  );

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute z-10 w-60"
      style={{
        left: `${(x / GRAPH_WIDTH) * 100}%`,
        top: `${(y / GRAPH_HEIGHT) * 100}%`,
        transform: below ? "translate(-50%, 0)" : "translate(-50%, -100%)",
      }}
    >
      {below && bridge}

      <div
        onMouseLeave={onLeave}
        className="pointer-events-auto rounded-lg border border-line bg-surface p-3 shadow-xl"
      >
        <p className="font-mono text-[13px] font-medium break-all text-ink">
          {resource.name}
        </p>
        <p className="mt-0.5 text-xs text-ink-soft">
          {resource.type} · {resource.provider} · {resource.region}
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          <Badge className={ENVIRONMENT_TONE[resource.environment]}>
            {resource.environment}
          </Badge>
          <Badge className={CRITICALITY_TONE[resource.criticality]}>
            {resource.criticality}
          </Badge>
        </div>
        <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-2 text-xs">
          <dt className="text-ink-muted">Owner</dt>
          <dd className="text-ink-soft">{resource.owner}</dd>
          <dt className="text-ink-muted">Open issues</dt>
          <dd
            className={
              resource.openIssues > 0
                ? "font-medium text-red-600"
                : "text-ink-soft"
            }
          >
            {resource.openIssues}
          </dd>
          <dt className="text-ink-muted">Tags</dt>
          <dd className="text-ink-soft">{resource.tags.join(", ") || "—"}</dd>
        </dl>
      </div>

      {!below && bridge}
    </div>
  );
}

export function ApplicationGraph({
  application,
  members,
}: {
  application: Application;
  members: Resource[];
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const activeGroupRef = useRef<SVGGElement>(null);

  const colors = useMemo(() => assignNodeColors(members), [members]);
  const { nodes } = useMemo(() => layoutStar(members.length), [members.length]);

  const showLabels = members.length <= LABEL_LIMIT;
  const nodeRadius = showLabels ? 20 : 13;

  const activeIndex = members.findIndex((member) => member.id === activeId);
  const activeMember = activeIndex >= 0 ? members[activeIndex] : undefined;
  const activeNode = activeIndex >= 0 ? nodes[activeIndex] : undefined;

  const centerLabel = truncate(application.name, 22);
  const centerWidth = Math.max(132, centerLabel.length * 8.5 + 28);

  // The node and its tooltip are separate hit areas, so only a move that lands
  // outside both of them closes the tooltip.
  function handlePointerLeave(event: React.MouseEvent) {
    const next = event.relatedTarget;
    if (next instanceof Node) {
      if (tooltipRef.current?.contains(next)) return;
      if (activeGroupRef.current?.contains(next)) return;
    }
    setActiveId(null);
  }

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`}
        className="w-full"
        onMouseLeave={handlePointerLeave}
      >
        <title>{`${application.name} and its ${members.length} member resources`}</title>

        {nodes.map((node, index) => (
          <line
            key={members[index].id}
            x1={CENTER_X}
            y1={CENTER_Y}
            x2={node.x}
            y2={node.y}
            stroke={activeIndex === index ? colors[index] : "#cbd5e1"}
            strokeWidth={activeIndex === index ? 2.5 : 1.5}
          />
        ))}

        <g>
          <rect
            x={CENTER_X - centerWidth / 2}
            y={CENTER_Y - 23}
            width={centerWidth}
            height={46}
            rx={10}
            fill="#4f46e5"
          />
          <text
            x={CENTER_X}
            y={CENTER_Y}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#ffffff"
            fontSize={14}
            fontWeight={600}
          >
            {centerLabel}
          </text>
        </g>

        {nodes.map((node, index) => {
          const member = members[index];
          const isActive = activeIndex === index;
          const anchor = labelAnchor(node.x);
          const labelGap = nodeRadius + 12;

          return (
            <g
              key={member.id}
              ref={isActive ? activeGroupRef : null}
              tabIndex={0}
              aria-label={`${member.name}, ${member.type}, ${member.provider} ${member.region}, ${member.environment}, ${member.criticality} criticality, owner ${member.owner}, ${member.openIssues} open issues`}
              onMouseEnter={() => setActiveId(member.id)}
              onMouseLeave={handlePointerLeave}
              onFocus={() => setActiveId(member.id)}
              onBlur={() => setActiveId(null)}
              className="cursor-default focus:outline-none"
            >
              <circle
                cx={node.x}
                cy={node.y}
                r={nodeRadius}
                fill={colors[index]}
                stroke="#ffffff"
                strokeWidth={isActive ? 4 : 2}
                opacity={activeId === null || isActive ? 1 : 0.55}
              />
              {member.openIssues > 0 && (
                <>
                  <circle
                    cx={node.x + nodeRadius * 0.78}
                    cy={node.y - nodeRadius * 0.78}
                    r={8}
                    fill="#dc2626"
                    stroke="#ffffff"
                    strokeWidth={1.5}
                  />
                  <text
                    x={node.x + nodeRadius * 0.78}
                    y={node.y - nodeRadius * 0.78}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#ffffff"
                    fontSize={9}
                    fontWeight={700}
                  >
                    {member.openIssues}
                  </text>
                </>
              )}
              {showLabels && (
                <text
                  x={
                    anchor === "middle"
                      ? node.x
                      : anchor === "start"
                        ? node.x + labelGap
                        : node.x - labelGap
                  }
                  y={
                    anchor === "middle"
                      ? node.y + (node.y < CENTER_Y ? -labelGap : labelGap)
                      : node.y
                  }
                  textAnchor={anchor}
                  dominantBaseline="central"
                  fontSize={11}
                  fontFamily="ui-monospace, monospace"
                  fill={isActive ? "#101828" : "#475467"}
                  fontWeight={isActive ? 600 : 400}
                >
                  {truncate(member.name, 22)}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {activeMember && activeNode && (
        <ResourceTooltip
          resource={activeMember}
          x={activeNode.x}
          y={activeNode.y}
          containerRef={tooltipRef}
          onLeave={handlePointerLeave}
        />
      )}

      <ul className="sr-only">
        {members.map((member) => (
          <li key={member.id}>
            {member.name} — {member.type}, {member.provider} {member.region},{" "}
            {member.environment}, {member.criticality} criticality, owned by{" "}
            {member.owner}, {member.openIssues} open issues
          </li>
        ))}
      </ul>
    </div>
  );
}
