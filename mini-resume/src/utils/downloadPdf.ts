import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

/**
 * Renders a DOM element as a high-quality PDF and triggers a browser download.
 *
 * How it works:
 *  1. html2canvas captures the element at 2× resolution for crispness.
 *  2. The canvas is converted to a JPEG data-URL.
 *  3. jsPDF creates an A4 document and tiles the image across pages
 *     (supports multi-page resumes automatically).
 *  4. pdf.save() creates a Blob with the correct application/pdf MIME type
 *     and clicks a hidden <a download> link — reliably downloads on
 *     Chrome, Edge, Firefox, and Safari.
 */
export async function downloadResumePdf(
  element: HTMLElement,
  filename: string = "resume.pdf"
): Promise<void> {
  // --- 1. Capture the element to a canvas ---
  const canvas = await html2canvas(element, {
    scale: 2,               // 2× for sharp text
    useCORS: true,          // allow cross-origin images (e.g. profile photo URLs)
    backgroundColor: "#ffffff",
    logging: false,
  });

  const imgData = canvas.toDataURL("image/jpeg", 0.95);

  // --- 2. A4 dimensions in mm ---
  const A4_W = 210;
  const A4_H = 297;

  // --- 3. Scale image to fit A4 width ---
  const imgWidth = A4_W;
  const imgHeight = (canvas.height * A4_W) / canvas.width;

  // --- 4. Create PDF and add pages ---
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  let yOffset = 0;
  let pageIndex = 0;

  while (yOffset < imgHeight) {
    if (pageIndex > 0) {
      pdf.addPage();
    }

    // addImage(data, format, x, y, w, h)
    // Negative y shifts the image up so the correct slice is visible
    pdf.addImage(imgData, "JPEG", 0, -yOffset, imgWidth, imgHeight);

    yOffset += A4_H;
    pageIndex++;
  }

  // --- 5. Trigger download ---
  pdf.save(filename);
}
