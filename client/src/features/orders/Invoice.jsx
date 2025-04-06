import React from "react";
import {
  Button,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Grid,
  Chip,
  useTheme,
  TableContainer,
  Card,
  CardContent,
} from "@mui/material";
import { jsPDF } from "jspdf";
import {
  HiOutlineDownload,
  HiOutlineX,
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlineShoppingCart,
  HiOutlineTag,
} from "react-icons/hi";

const Invoice = ({ order, onClose }) => {
  const theme = useTheme();

  const getStatusColor = (status) => {
    const statusMap = {
      pending: "warning",
      completed: "success",
      cancelled: "error",
      processing: "info",
    };
    return statusMap[status.toLowerCase()] || "default";
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    let yPos = 20;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;

    // Helper function to add text with proper alignment
    const addText = (text, x, y, options = {}) => {
      doc.text(text, x, y, options);
      return doc.getTextDimensions(text).h + 5;
    };

    // Add company logo (placeholder)
    // doc.addImage("/api/placeholder/100/50", "PNG", margin, yPos, 50, 25);

    // Company details on the right
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    let rightColumnY = yPos;
    addText("Your Company Name", pageWidth - margin, rightColumnY, {
      align: "right",
    });
    rightColumnY += 5;
    addText("123 Business Street", pageWidth - margin, rightColumnY, {
      align: "right",
    });
    rightColumnY += 5;
    addText("City, State 12345", pageWidth - margin, rightColumnY, {
      align: "right",
    });
    rightColumnY += 5;
    addText("Phone: (555) 123-4567", pageWidth - margin, rightColumnY, {
      align: "right",
    });

    // Invoice title
    yPos += 40;
    doc.setFontSize(24);
    doc.setTextColor(44, 62, 80);
    doc.setFont("helvetica", "bold");
    addText("INVOICE", pageWidth / 2, yPos, { align: "center" });

    // Invoice details
    yPos += 20;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);

    // Left column
    let leftColumnY = yPos;
    doc.setFont("helvetica", "bold");
    addText("Bill To:", margin, leftColumnY);
    leftColumnY += 7;
    doc.setFont("helvetica", "normal");
    addText(order.name || "N/A", margin, leftColumnY);
    if (order.address) {
      leftColumnY += 5;
      addText(order.address, margin, leftColumnY);
    }

    // Right column - Invoice details
    let detailsY = yPos;
    const detailsX = pageWidth - margin - 80;

    doc.setFont("helvetica", "bold");
    addText("Invoice Number:", detailsX, detailsY);
    detailsY += 7;
    addText("Date:", detailsX, detailsY);
    detailsY += 7;
    addText("Due Date:", detailsX, detailsY);
    detailsY += 7;
    addText("Status:", detailsX, detailsY);

    // Values
    doc.setFont("helvetica", "normal");
    addText(order.orderId, detailsX + 80, yPos, { align: "right" });
    addText(new Date().toLocaleDateString(), detailsX + 80, yPos + 7, {
      align: "right",
    });
    addText(
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      detailsX + 80,
      yPos + 14,
      { align: "right" }
    );
    addText(order.status, detailsX + 80, yPos + 21, { align: "right" });

    // Products table
    yPos += 50;

    // Table headers
    const headers = ["Item", "Quantity", "Price", "Total"];
    const columnWidths = [
      contentWidth * 0.4,
      contentWidth * 0.2,
      contentWidth * 0.2,
      contentWidth * 0.2,
    ];

    // Add table header
    doc.setFillColor(44, 62, 80);
    doc.setTextColor(255, 255, 255);
    doc.rect(margin, yPos, contentWidth, 10, "F");

    let xPos = margin;
    headers.forEach((header, index) => {
      doc.text(header, xPos + 5, yPos + 7);
      xPos += columnWidths[index];
    });

    // Add table rows
    yPos += 10;
    doc.setTextColor(0, 0, 0);

    order.products.forEach((item, index) => {
      // Add zebra striping
      if (index % 2 === 0) {
        doc.setFillColor(240, 240, 240);
        doc.rect(margin, yPos, contentWidth, 10, "F");
      }

      xPos = margin;
      const price = item.product.price || 0;
      const total = price * item.quantity;

      // Item details
      doc.text(item.product.name, xPos + 5, yPos + 7);
      doc.text(item.quantity.toString(), xPos + columnWidths[0] + 5, yPos + 7);
      doc.text(
        `$${price.toFixed(2)}`,
        xPos + columnWidths[0] + columnWidths[1] + 5,
        yPos + 7
      );
      doc.text(
        `$${total.toFixed(2)}`,
        xPos + columnWidths[0] + columnWidths[1] + columnWidths[2] + 5,
        yPos + 7
      );

      yPos += 10;
    });

    // Add total section
    yPos += 10;
    doc.setFillColor(44, 62, 80);
    doc.setTextColor(255, 255, 255);
    doc.rect(pageWidth - margin - 100, yPos, 100, 10, "F");
    doc.text(
      `Total: $${order.totalAmount.toFixed(2)}`,
      pageWidth - margin - 95,
      yPos + 7
    );

    // Add footer
    const footerY = doc.internal.pageSize.height - 20;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Thank you for your business!", pageWidth / 2, footerY, {
      align: "center",
    });

    // Save the PDF
    doc.save(`Invoice_${order.orderId}.pdf`);
  };

  const formatDate = (date) => {
    return new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ position: "relative" }}>
          <Typography
            variant="h5"
            gutterBottom
            align="center"
            sx={{
              fontWeight: "bold",
              color: theme.palette.primary.main,
              mb: 1,
            }}
          >
            Invoice
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            {/* Left Column - Order Details */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <HiOutlineTag size={15} />
                  <Typography variant="body2">
                    <strong>Order ID:</strong> {order.orderId}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <HiOutlineUser size={15} />
                  <Typography variant="body2">
                    <strong>Customer:</strong> {order.name || "N/A"}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <HiOutlineCalendar size={15} />
                  <Typography variant="body2">
                    <strong>Date:</strong> {formatDate(new Date())}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Right Column - Status and Amount */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: { xs: "flex-start", md: "flex-end" },
                }}
              >
                <Chip
                  label={order.status}
                  color={getStatusColor(order.status)}
                  sx={{ fontWeight: "bold", px: 2 }}
                />
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
                >
                  ${order.totalAmount.toFixed(2)}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <HiOutlineShoppingCart size={20} />
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Order Items
              </Typography>
            </Box>

            <TableContainer
              component={Paper}
              elevation={0}
              sx={{ border: `1px solid ${theme.palette.divider}` }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
                    <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Product Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Quantity</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="right">
                      Price
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="right">
                      Total
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.products.map((productItem, index) => (
                    <TableRow key={productItem.product._id} hover>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{productItem.product.name}</TableCell>
                      <TableCell>{productItem.quantity}</TableCell>
                      <TableCell align="right">
                        ${(productItem.product.price || 0).toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        $
                        {(
                          (productItem.product.price || 0) *
                          productItem.quantity
                        ).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} />
                    <TableCell sx={{ fontWeight: "bold" }} align="right">
                      Total:
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="right">
                      ${order.totalAmount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: 3,
            }}
          >
            <Button
              variant="outlined"
              startIcon={<HiOutlineX />}
              onClick={onClose}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                px: 3,
              }}
            >
              Close
            </Button>
            <Button
              variant="contained"
              startIcon={<HiOutlineDownload />}
              onClick={handleDownloadPDF}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                px: 3,
              }}
            >
              Download PDF
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Invoice;
