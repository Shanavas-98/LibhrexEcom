const pdfTable = require('pdfkit-table')
const fs = require('fs');

const create = (header,body) => {
    // create a PDF from PDFKit, and a table from pDFTable
    const pdf = new pdfDocument({
        autoFirstPage: false
    });
    const table = new pdfTable(pdf, {
        bottomMargin: 30
    });

    table
        // add some plugins (here, a 'fit-to-width' for a column)
        .addPlugin(new (require('voilab-pdf-table/plugins/fitcolumn'))({
            column: 'description'
        }))
        // set defaults to your columns
        .setColumnsDefaults({
            headerBorder: 'B',
            align: 'right'
        })
        // add table columns
        .addColumns(header)
        // add events (here, we draw headers on each new page)
        .onPageAdded(function (tb) {
            tb.addHeader();
        });

    // if no page already exists in your PDF, do not forget to add one
    pdf.addPage();

    // draw content, by passing data to the addBody method
    table.addBody(body);

    return pdf;
}

module.exports=create;

//const stream = doc.pipe(fs.createWriteStream("output.pdf"))