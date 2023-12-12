export const objectToCsv = (data: { [key: string]: any }[]) => {
  if (data.length === 0) return '';
  const csvRows = [];

  /* Get headers as every csv data format
        has header (head means column name)
        so objects key is nothing but column name
        for csv data using Object.key() function.
        We fetch key of object as column name for
        csv */
  const headers = Object.keys(data[0]);

  /* Using push() method we push fetched
           data into csvRows[] array */
  csvRows.push(headers.join(';'));

  // Loop to get value of each objects key
  for (const row of data) {
    const values = headers.map((header) => {
      const val = row[header];
      return `"${val}"`;
    });

    // To add, separator between each value
    csvRows.push(values.join(';'));
  }

  /* To add new line for each objects values
           and this return statement array csvRows
           to this function.*/
  return csvRows.join('\n');
};

export const downloadCSV = (csvString: string, filename: string) => {
  const blob = new Blob(['\uFEFF' + csvString], {
    type: 'data:text/csv;charset=utf-8,'
  });
  const blobURL = window.URL.createObjectURL(blob);

  // Create new tag for download file
  const anchor = document.createElement('a');
  anchor.download = `${filename}.csv`;
  anchor.href = blobURL;
  anchor.dataset.downloadurl = ['text/csv', anchor.download, anchor.href].join(
    ':'
  );
  anchor.click();

  // Remove URL.createObjectURL. The browser should not save the reference to the file.
  setTimeout(() => {
    // For Firefox it is necessary to delay revoking the ObjectURL
    URL.revokeObjectURL(blobURL);
  }, 100);
};
