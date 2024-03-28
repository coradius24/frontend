"use client";
import { Button } from "@/components/button/LinkButton";
import {
  Document,
  Font,
  Image,
  PDFDownloadLink,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import React, { useState } from "react";

const GenerateInvoice = React.memo(({ invoiceData }) => {
  const [isGenerate, setIsGenerate] = useState(false);

  if (isGenerate) {
    return <InvoiceComponent invoiceData={invoiceData} />;
  }

  return (
    <Button text={"ডাউনলোড"} onClick={() => setIsGenerate(true)} size={10} />
  );
});

const InvoiceComponent = React.memo(({ invoiceData }) => {
  return (
    <div>
      <PDFDownloadLink
        document={<PDF invoiceData={invoiceData} />}
        fileName="invoice.pdf"
      >
        {({ blob, url, loading, error }) =>
          loading ? (
            <Button text={"ডাউনলোড হচ্ছে "} size={10} />
          ) : (
            <Button text={"ডাউনলোড করুন"} size={10} />
          )
        }
      </PDFDownloadLink>
    </div>
  );
});

export default GenerateInvoice;

const PDF = React.memo(({ invoiceData }) => {
  const styles = StyleSheet.create({
    page: {
      width: 600,
      minWidth: 600,
      backgroundColor: "white",
    },
    header: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    headerImage: {
      marginBottom: 20,
      width: "100%",
    },
    headerContainer: {
      display: "flex",
      justifyContent: "space-between",
      flexDirection: "row",
      flexWrap: "wrap",
      width: "100%",
      margin: "5px 24px",
      fontSize: 12,
      fontWeight: "500",
    },
    headerLeft: {
      gap: 3,
    },
    headerRight: {
      width: "20%",
      marginRight: "30px",
      gap: 3,
    },
    priceTableImage: {
      marginTop: 20,
      width: "100%",
    },
    priceTableContent: {
      maxHeight: "220px",
      display: "flex",
      flex: 1,
      margin: 24,
      marginTop: 0,
      fontSize: 12,
      color: "#3F403F",
      flexDirection: "row",
    },
    priceSl: {
      flexDirection: "column",
      width: 35,
      paddingTop: 20,
      height: "220px",
      textAlign: "center",
      borderRight: "1px solid #66697B",
      borderLeft: "1px solid #66697B",
      height: "220px",
      borderBottom: "1px solid #66697B",
    },
    courseTitle: {
      flexDirection: "column",
      width: 250,
      paddingTop: 20,
      paddingLeft: 15,
      paddingRight: 10,
      textAlign: "center",
      borderRight: "1px solid #66697B",
      height: "220px",
      borderBottom: "1px solid #66697B",
    },
    price: {
      flexDirection: "column",
      width: 90,
      paddingTop: 20,
      textAlign: "center",
      borderRight: "1px solid #66697B",
      height: "220px",
      borderBottom: "1px solid #66697B",
    },
    paid: {
      flexDirection: "column",
      width: 90,
      paddingTop: 20,
      textAlign: "center",
      borderRight: "1px solid #66697B",
      height: "220px",
      borderBottom: "1px solid #66697B",
    },
    totalPaid: {
      flexDirection: "column",
      width: 90,
      paddingTop: 20,
      textAlign: "center",
      borderRight: "1px solid #66697B",
      height: "220px",
      borderBottom: "1px solid #66697B",
    },
    footerContainer: {
      display: "flex",
      justifyContent: "space-between",
      flexDirection: "row",
      flexWrap: "wrap",
      width: "100%",
      margin: "5px 24px",
    },
    footerLeft: {
      width: "50%",
      gap: 3,
    },
    footerLeftTitle: {
      gap: 3,
      fontSize: 16,
      fontFamily: "Lato Bold",
    },
    footerLeftDesc: {
      fontSize: 12,
      fontFamily: "Lato",
    },
    footerRight: {
      width: "20%",
      marginRight: "45px",
      gap: 3,
      display: "flex",
      fontSize: 12,
    },
    footerRightItem: {
      justifyContent: "space-between",
      flexDirection: "row",
    },
    lightText: {
      fontFamily: "Lato",
    },
    boldText: {
      fontFamily: "Lato Bold",
    },
    dueImage: {
      width: 220,
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "flex-end",
      position: "relative",
      marginTop: 20,
      marginLeft: "auto",
      marginRight: 24,
    },
    dueImageText: {
      position: "absolute",
      left: 0,
      right: 0,
      margin: "0 auto",
      color: "#fff",
      width: "100%",
      top: "10px",
      textAlign: "center",
    },
    footerImage: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      width: "100%",
    },
  });

  Font.register({
    family: "Manrope",
    src: `https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700&display=swap`,
  });

  Font.register({
    family: "Open Sans",
    src: `https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFVZ0e.ttf`,
  });

  Font.register({
    family: "Lato",
    src: `https://fonts.gstatic.com/s/lato/v16/S6uyw4BMUTPHjx4wWw.ttf`,
  });

  Font.register({
    family: "Lato Italic",
    src: `https://fonts.gstatic.com/s/lato/v16/S6u8w4BMUTPHjxsAXC-v.ttf`,
  });

  Font.register({
    family: "Lato Bold",
    src: `https://fonts.gstatic.com/s/lato/v16/S6u9w4BMUTPHh6UVSwiPHA.ttf`,
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerImage}>
          <Image src={"/invoice-header.png"} style={styles.image} />
        </View>
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <Text>Name: {invoiceData.name}</Text>
            <Text>Email: {invoiceData.email}</Text>
            <Text>Mobile: {invoiceData.mobileNumber}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text>Invoice#: {invoiceData.id}</Text>
            <Text>Date : {invoiceData.date}</Text>
          </View>
        </View>
        <View style={styles.priceTableImage}>
          <Image src={"/price-table.png"} style={styles.image} />
        </View>
        <View style={styles.priceTableContent}>
          <View style={styles.priceSl}>
            <Text>01</Text>
          </View>
          <View style={styles.courseTitle}>
            <Text>{invoiceData.title}</Text>
          </View>
          <View style={styles.price}>
            <Text>{invoiceData.paid + invoiceData.due} Tk</Text>
          </View>
          <View style={styles.paid}>
            <Text>{invoiceData.paid} Tk</Text>
          </View>
          <View style={styles.totalPaid}>
            <Text>{invoiceData.paid} Tk</Text>
          </View>
        </View>
        <View style={styles.footerContainer}>
          <View style={styles.footerLeft}>
            <Text style={styles.footerLeftTitle}>
              Thank you for the Admission!
            </Text>
            <Text style={styles.footerLeftDesc}>
              I want to express my heartfelt gratitude for the incredible
              opportunity you have granted me by offering admission to your
              esteemed institution.
            </Text>
          </View>
          <View style={styles.footerRight}>
            <View style={styles.footerRightItem}>
              <Text style={styles.lightText}>Discount:</Text>
              <Text style={styles.boldText}>
                {" "}
                -{"   "}
                {invoiceData.discountAmount}Tk
              </Text>
            </View>
            <View style={styles.footerRightItem}>
              <Text style={styles.lightText}>Sub Total:</Text>
              <Text style={styles.boldText}>
                {" "}
                {"   "}
                {invoiceData.paid + invoiceData.due} Tk
              </Text>
            </View>
            <View style={styles.footerRightItem}>
              <Text style={styles.lightText}>Total:</Text>
              <Text style={styles.boldText}>
                {" "}
                {"   "}
                {invoiceData.paid + invoiceData.due} Tk
              </Text>
            </View>
          </View>
        </View>
        {invoiceData.due > 0 && (
          <View style={styles.dueImage}>
            <Image src={"/due.png"} style={styles.image} />
            <Text style={styles.dueImageText}>{invoiceData.due} Tk</Text>
          </View>
        )}
        <View style={styles.footerImage}>
          <Image src={"/invoice-footer.png"} style={styles.image} />
        </View>
      </Page>
    </Document>
  );
});
