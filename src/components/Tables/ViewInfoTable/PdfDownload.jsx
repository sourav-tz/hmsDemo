import { usePDF, Document, Page, Text, StyleSheet, PDFViewer, View, Image, Font } from '@react-pdf/renderer';
import { Button } from '../../ui/button';
import { PiFilePdfDuotone } from "react-icons/pi";
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// Register fonts for PDF
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'http://fonts.gstatic.com/s/roboto/v30/KFOkCnqEu92Fr1MmgWxPKTM1K9nz.ttf' },
    { src: 'http://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlvAx05IsDqlA.ttf', fontWeight: 700 },
  ]
});

const PdfDownload = ({ myData, adminInfo }) => {
  // Get admin data from Redux store as backup
  const adminData = useSelector(state => state.userStorage.data);

  // Log admin data for debugging
  console.log("Admin data for PDF:", adminData);
  console.log("Admin info prop:", adminInfo);

  // Extract admin data from the nested dataValues property if it exists
  const adminDataValues = adminData?.dataValues || {};

  // Determine the admin information to use in the PDF
  // First try the adminInfo prop, then try various paths in the Redux store
  const adminNameToUse = adminInfo?.name || adminDataValues?.name || adminData?.name || "Admin";
  const adminEmailToUse = adminInfo?.email || adminDataValues?.email || adminData?.email || "admin@example.com";

  console.log("Admin info to use in PDF:", { name: adminNameToUse, email: adminEmailToUse });
    ///pdf Styles
const styles = StyleSheet.create({
    page: {
      fontFamily: 'Roboto',
      padding: 30,
      backgroundColor: '#ffffff',
    },
    detailSection: {
      paddingHorizontal: 10,
      paddingVertical: 10,
    },
    header: {
      display: 'flex',
      flexDirection: 'row',
      gap: 15,
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '70%',
      paddingVertical: 15,
      borderBottom: '2px solid #333333',
      marginBottom: 20,
      zIndex: 1,
    },
    headerImage: {
      width: 70,
    },
    headerText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#000000',
    },
    headerSubText: {
      fontSize: 14,
      color: '#333333',
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 8,
      marginTop: 16,
      backgroundColor: '#f5f5f5',
      paddingVertical: 6,
      paddingHorizontal: 10,
      color: '#000000',
      borderRadius: 4,
      borderLeft: '4px solid #333333',
    },
    infoContainer: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 8,
      paddingHorizontal: 10,
    },
    infoItem: {
      width: '48%',
      marginBottom: 8,
      borderBottom: '1px solid #f3f4f6',
      paddingBottom: 4,
    },
    label: {
      fontSize: 9,
      color: '#444444',
      marginBottom: 2,
      textTransform: 'uppercase',
      fontWeight: 'bold',
    },
    value: {
      fontSize: 11,
      color: '#000000',
    },
    fullWidth: {
      width: '100%',
      marginBottom: 8,
      borderBottom: '1px solid #f3f4f6',
      paddingBottom: 4,
    },
    footer: {
      position: 'absolute',
      bottom: 30,
      left: 30,
      right: 30,
      textAlign: 'center',
      paddingTop: 10,
      borderTop: '1px solid #000000',
      fontSize: 9,
      color: '#333333',
    },
    photoContainer: {
      position: 'absolute',
      top: 20,
      right: 30,
      width: 90,
      height: 110,
      border: '1px solid #000000',
      backgroundColor: '#f9fafb',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      zIndex: 2,
    },
    photoText: {
      fontSize: 9,
      color: '#333333',
      textAlign: 'center',
      fontWeight: 'bold',
    },
    photo: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    // Document section at the end of the PDF
    documentSection: {
      marginTop: 20,
      marginBottom: 20,
      paddingHorizontal: 10,
    },
    documentWrapper: {
      marginTop: 10,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    documentTitle: {
      fontSize: 12,
      fontWeight: 'bold',
      marginBottom: 8,
      color: '#333333',
    },
    documentImage: {
      width: 250,
      height: 150,
      objectFit: 'contain',
      border: '1px solid #cccccc',
    },
    // Admin verification section
    adminSection: {
      marginTop: 20,
      marginBottom: 30,
      paddingHorizontal: 10,
    },
    adminInfo: {
      marginTop: 10,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    adminDetails: {
      width: '60%',
    },
    adminLabel: {
      fontSize: 10,
      color: '#555555',
      marginBottom: 2,
    },
    adminValue: {
      fontSize: 10,
      marginBottom: 10,
    },
    signatureBox: {
      width: '30%',
      height: 80,
      border: '1px solid #000000',
      marginTop: 20,
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      padding: 5,
    },
    signatureLabel: {
      fontSize: 8,
      color: '#555555',
    },
  });



    ///pdf section
    var MyDoc = (
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Photo and Documents */}
          <View style={styles.photoContainer}>
            {myData.profile?.photoLink ? (
              <Image src={myData.profile.photoLink} style={styles.photo} />
            ) : (
              <Text style={styles.photoText}>STUDENT PHOTO</Text>
            )}
          </View>



          {/* Header */}
          <View style={styles.header}>
            <Image style={styles.headerImage} src="https://upload.wikimedia.org/wikipedia/en/7/75/National_Institute_of_Technology%2C_Kurukshetra_Logo.png" />
            <View>
              <Text style={styles.headerText}>NIT Kurukshetra</Text>
              <Text style={styles.headerSubText}>{myData.hostel?.hostelName ? `${myData.hostel.hostelName} (Hostel ${myData.hostelNo})` : `Hostel ${myData.hostelNo}`}</Text>
            </View>
          </View>

          <View style={styles.detailSection}>
            {/* Basic Information */}
            <Text style={styles.sectionTitle}>STUDENT INFORMATION</Text>
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Text style={styles.label}>Roll Number</Text>
                <Text style={styles.value}>{myData.rollNo}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.label}>Full Name</Text>
                <Text style={styles.value}>{myData.firstName} {myData.lastName}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.label}>Year</Text>
                <Text style={styles.value}>{myData.year}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.label}>Room</Text>
                <Text style={styles.value}>{myData.roomId || 'Not Assigned'}</Text>
              </View>
            </View>

            {/* Academic Information */}
            <Text style={styles.sectionTitle}>ACADEMIC INFORMATION</Text>
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Text style={styles.label}>Course Name</Text>
                <Text style={styles.value}>{myData.course?.courseName || 'Not Available'}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.label}>Department</Text>
                <Text style={styles.value}>{myData.course?.department || 'Not Available'}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.label}>Course ID</Text>
                <Text style={styles.value}>{myData.courseId}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.value}>{myData.email}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.label}>Personal Email</Text>
                <Text style={styles.value}>{myData.profile?.pEmail || 'Not Available'}</Text>
              </View>
            </View>

            {/* Contact Information */}
            <Text style={styles.sectionTitle}>CONTACT INFORMATION</Text>
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Text style={styles.label}>Primary Contact</Text>
                <Text style={styles.value}>{myData.profile?.contactNumber || 'Not Available'}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.label}>Secondary Contact</Text>
                <Text style={styles.value}>{myData.profile?.secondaryContact || 'Not Available'}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.label}>Phone Number</Text>
                <Text style={styles.value}>{myData.profile?.phoneNumber || 'Not Available'}</Text>
              </View>
            </View>

            {/* Personal Details */}
            <Text style={styles.sectionTitle}>PERSONAL DETAILS</Text>
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Text style={styles.label}>Gender</Text>
                <Text style={styles.value}>{myData.profile?.gender || 'Not Available'}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.label}>Date of Birth</Text>
                <Text style={styles.value}>{myData.profile?.dob || 'Not Available'}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.label}>Blood Group</Text>
                <Text style={styles.value}>{myData.profile?.bloodGroup || 'Not Available'}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.label}>Identification Mark</Text>
                <Text style={styles.value}>{myData.profile?.identificationMark || 'Not Available'}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.label}>Aadhar Number</Text>
                <Text style={styles.value}>{myData.profile?.addharNumber || 'Not Available'}</Text>
              </View>
            </View>

            {/* Address Information */}
            <Text style={styles.sectionTitle}>ADDRESS INFORMATION</Text>
            <View style={styles.infoContainer}>
              <View style={styles.fullWidth}>
                <Text style={styles.label}>Permanent Address</Text>
                <Text style={styles.value}>
                  {myData.profile?.subAddress || 'Not Available'}
                  {myData.profile?.city && myData.profile?.state ?
                    `, ${myData.profile.city}, ${myData.profile.state}${myData.profile.pinCode ? ` - ${myData.profile.pinCode}` : ''}` :
                    ''}
                </Text>
              </View>
              <View style={styles.fullWidth}>
                <Text style={styles.label}>Local Guardian Address</Text>
                <Text style={styles.value}>{myData.profile?.localGuardianAddress || 'Not Available'}</Text>
              </View>
            </View>

            {/* Family Information */}
            <Text style={styles.sectionTitle}>FAMILY INFORMATION</Text>
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Text style={styles.label}>Father&apos;s Name</Text>
                <Text style={styles.value}>{myData.profile?.fatherName || 'Not Available'}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.label}>Father&apos;s Contact</Text>
                <Text style={styles.value}>{myData.profile?.fatherContact || 'Not Available'}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.label}>Father&apos;s Occupation</Text>
                <Text style={styles.value}>{myData.profile?.fatherOccupation || 'Not Available'}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.label}>Mother&apos;s Name</Text>
                <Text style={styles.value}>{myData.profile?.motherName || 'Not Available'}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.label}>Mother&apos;s Contact</Text>
                <Text style={styles.value}>{myData.profile?.motherContact || 'Not Available'}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.label}>Mother&apos;s Occupation</Text>
                <Text style={styles.value}>{myData.profile?.motherOccupation || 'Not Available'}</Text>
              </View>
            </View>

            {/* Local Guardian Information */}
            <Text style={styles.sectionTitle}>LOCAL GUARDIAN INFORMATION</Text>
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Text style={styles.label}>Name</Text>
                <Text style={styles.value}>{myData.profile?.localGuardian || 'Not Available'}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.label}>Contact</Text>
                <Text style={styles.value}>{myData.profile?.localGuardianContact || 'Not Available'}</Text>
              </View>
            </View>
          </View>

          {/* Aadhar Card Document Section */}
          {myData.profile?.aadharCardDocument && (
            <View style={styles.documentSection}>
              <Text style={styles.sectionTitle}>IDENTITY DOCUMENT</Text>
              <View style={styles.documentWrapper}>
                <Text style={styles.documentTitle}>AADHAR CARD</Text>
                <Image src={myData.profile.aadharCardDocument} style={styles.documentImage} />
              </View>
            </View>
          )}

          {/* Admin Verification Section */}
          <View style={styles.adminSection}>
            <Text style={styles.sectionTitle}>VERIFICATION</Text>
            <View style={styles.adminInfo}>
              <View style={styles.adminDetails}>
                <Text style={styles.adminLabel}>Verified By (Hostel Authority):</Text>
                <Text style={styles.adminValue}>_______________________________</Text>
                <Text style={styles.adminLabel}>Name:</Text>
                <Text style={styles.adminValue}>{adminNameToUse}</Text>
                <Text style={styles.adminLabel}>Email:</Text>
                <Text style={styles.adminValue}>{adminEmailToUse}</Text>
              </View>
              <View style={styles.signatureBox}>
                <Text style={styles.signatureLabel}>Signature</Text>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text>OFFICIAL DOCUMENT - Generated on {new Date().toLocaleDateString()} | NIT Kurukshetra Hostel Management System</Text>
          </View>
        </Page>
      </Document>
    );


    const [instance] = usePDF({ document: MyDoc });

    if (instance.loading) return <p>Loading...</p>;

    if (instance.error) return <div>Something went wrong</div>;

    return<>
        <a href={instance.url} download={`${myData.rollNo}.pdf`}>
        <Button className="bg-purple-600 hover:bg-purple-500" size="sm"><PiFilePdfDuotone /></Button>
    </a>
    </>

  }

  // PropTypes validation
  PdfDownload.propTypes = {
    myData: PropTypes.shape({
      rollNo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      email: PropTypes.string,
      courseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      hostelNo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      roomId: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
      profile: PropTypes.object,
      course: PropTypes.object,
      hostel: PropTypes.object
    }).isRequired,
    adminInfo: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string
    })
  };

  export default PdfDownload;