import React from "react";
import { jsPDF } from "jspdf";
import { PrinterOutlined } from "@ant-design/icons";

const InstructionsPDF = ({ user }) => {
  const handleGeneratePDF = () => {
    const doc = new jsPDF();

    // Agregar el contenido del PDF
    doc.text("Instrucciones para el Usuario", 10, 10);
    doc.text("1. Abre la página en tu navegador.", 10, 20);
    doc.text("2. Presiona el botón para generar el PDF.", 10, 30);
    doc.text("3. Imprime el PDF desde tu navegador.", 10, 40);
    doc.text("4. Disfruta de la experiencia.", 10, 50);

    // Guardar el PDF
    doc.save("instrucciones.pdf");

    // Mostrar el PDF en una ventana emergente para impresión
    const pdfOutput = doc.output("datauristring");
    const printWindow = window.open(pdfOutput, "_blank");
    printWindow.print();
  };

  return <button icon={<PrinterOutlined />} onClick={handleGeneratePDF} />;
};

export default InstructionsPDF;
