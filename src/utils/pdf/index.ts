export const downloadPDF = async (id: string) => {
  const res = await fetch('/transactions/pdf?' + new URLSearchParams({ id }), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const blob = await res.blob();
  const newBlob = new Blob([blob], {
    type: 'data:text/csv;charset=utf-8,'
  });

  const blobUrl = window.URL.createObjectURL(newBlob);

  const link = document.createElement('a');
  link.href = blobUrl;
  link.setAttribute('download', `${id}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);

  // clean up Url
  window.URL.revokeObjectURL(blobUrl);
};
