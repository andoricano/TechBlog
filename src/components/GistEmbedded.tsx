import React from "react";

export const GistEmbedded = ({ gistId }: { gistId: string }) => {
  const srcDoc = `
    <html>
      <body>
        <script src="https://gist.github.com/${gistId}.js"></script>
      </body>
    </html>
  `;

  return (
    <iframe
      srcDoc={srcDoc}
      style={{
        width: "100%",
        border: "none",
      }}
      sandbox="allow-scripts"
      title="gist"
    />
  );
};