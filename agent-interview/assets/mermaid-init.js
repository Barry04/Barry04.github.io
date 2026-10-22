(() => {
  const blocks = [...document.querySelectorAll(".mermaid")];
  if (!blocks.length || !window.mermaid) return;

  const sources = blocks.map((el) => el.textContent);
  const isDark = () => document.body.classList.contains("dark");
  let rendering = false;
  let queued = false;

  const themeVariables = (dark) =>
    dark
      ? {
          background: "#121a21",
          primaryColor: "#1d3d3d",
          primaryTextColor: "#e8f1f4",
          primaryBorderColor: "#38b2a3",
          secondaryColor: "#1b2730",
          tertiaryColor: "#17252a",
          lineColor: "#7c8f9c",
          textColor: "#d5e0e7",
          fontSize: "14px",
        }
      : {
          background: "#ffffff",
          primaryColor: "#e8f5f3",
          primaryTextColor: "#17202a",
          primaryBorderColor: "#0f766e",
          secondaryColor: "#f3f6f8",
          tertiaryColor: "#fbfcfd",
          lineColor: "#687586",
          textColor: "#17202a",
          fontSize: "14px",
        };

  const render = async () => {
    if (rendering) {
      queued = true;
      return;
    }
    rendering = true;
    const dark = isDark();
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "loose",
      theme: dark ? "dark" : "neutral",
      fontFamily: 'Inter,"Segoe UI","Microsoft YaHei",sans-serif',
      themeVariables: themeVariables(dark),
      flowchart: { htmlLabels: true, curve: "basis", useMaxWidth: true },
      sequence: { useMaxWidth: true },
      gantt: { useMaxWidth: true },
    });

    for (const [index, el] of blocks.entries()) {
      el.removeAttribute("data-processed");
      el.innerHTML = sources[index];
      try {
        await mermaid.run({ nodes: [el] });
      } catch (error) {
        console.warn("mermaid render failed", error);
        el.innerHTML = '<div class="mermaid-error">图表渲染失败，请检查 Mermaid 语法</div>';
      }
    }

    rendering = false;
    if (queued) {
      queued = false;
      render();
    }
  };

  render();
  window.addEventListener("reader-theme-change", render);
})();
