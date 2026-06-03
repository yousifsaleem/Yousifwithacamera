export function LayoutGuides() {
  const fullHeight = { top: 0, bottom: 0 };

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9997,
        pointerEvents: "none"
      }}
    >
      <div
        style={{
          position: "absolute",
          ...fullHeight,
          left: "var(--page-margin)",
          width: 3,
          background: "rgba(255, 0, 0, 0.95)"
        }}
      />
      <div
        style={{
          position: "absolute",
          ...fullHeight,
          right: "var(--page-margin)",
          width: 3,
          background: "rgba(255, 0, 0, 0.95)"
        }}
      />
      <div
        style={{
          position: "absolute",
          ...fullHeight,
          left: "50%",
          width: 3,
          transform: "translateX(-50%)",
          background: "rgba(0, 70, 255, 0.95)"
        }}
      />
      <div
        style={{
          position: "absolute",
          ...fullHeight,
          left: "var(--home-rect-edge-guide)",
          width: 3,
          background: "rgba(0, 190, 90, 0.95)"
        }}
      />
      <div
        style={{
          position: "absolute",
          ...fullHeight,
          right: "var(--home-rect-edge-guide)",
          width: 3,
          background: "rgba(0, 190, 90, 0.95)"
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "var(--page-margin)",
          top: 92,
          transform: "translateX(-50%)",
          color: "red",
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: "0.12em"
        }}
      >
        MARGIN
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 92,
          transform: "translateX(-50%)",
          color: "blue",
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: "0.12em"
        }}
      >
        CENTER
      </div>
      <div
        style={{
          position: "absolute",
          left: "var(--home-rect-edge-guide)",
          top: 92,
          transform: "translateX(-50%)",
          color: "green",
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: "0.12em"
        }}
      >
        RECT EDGE
      </div>
      <div
        style={{
          position: "absolute",
          right: "var(--home-rect-edge-guide)",
          top: 92,
          transform: "translateX(50%)",
          color: "green",
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: "0.12em"
        }}
      >
        RECT EDGE
      </div>
    </div>
  );
}
