export const exportShoutouts = (format) => {
  const url = `http://127.0.0.1:5000/api/reports/shoutouts/export?format=${format}`;

  fetch(url, {
    headers: {
      Role: "admin"
    }
  })
    .then((response) => response.blob())
    .then((blob) => {
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `shoutouts.${format}`;
      link.click();
    });
};
