const pdfTable = require("pdfkit-table");
const fs = require('fs');

function generateReport(Details) {
        const pdf = new pdfTable();
        let data = Details.map(function (item, index) {
            return [index + 1, item.month, item.totalAmount, item.totalOrders, item.productsSold];
        });
        const table = {
            title: "Sales report",
            subtitle: "Sales report based on each month",
            headers: ["S.No", "Month", "Amount", "Orders", "Proudcts Sold"],
            rows: data,
        };

        pdf.table(table);
        return pdf;
}


module.exports = {generateReport};