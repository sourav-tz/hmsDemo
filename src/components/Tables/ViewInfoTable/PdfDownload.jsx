import { usePDF, Document, Page,Text,StyleSheet, PDFViewer, View, Image,Font} from '@react-pdf/renderer';
import {Button} from '../../ui/button';
Font.register({
    family: 'Roboto',
    fonts: [
      { src: 'http://fonts.gstatic.com/s/roboto/v30/KFOkCnqEu92Fr1MmgWxPKTM1K9nz.ttf' },
      { src: 'http://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlvAx05IsDqlA.ttf', fontWeight: 700 },
    ]
  });

  import { PiFilePdfDuotone } from "react-icons/pi";

  

  const PdfDownload = ({myData})=>{
    ///pdf Styles
const styles = StyleSheet.create({
    detailSection:{
      paddingHorizontal:30,
      paddingVeritical:20,
    },
     
     header:{
       display:'flex',
       flexDirection:'row',
       gap:10,
       justifyContent:'center',
       alignItems:'center',
       width:'100%',
       paddingVertical:20
       
     },
     headerImage:{
       width:75
     },
     
     headerText:{
     fontSize:28,
   },
   });
  
  
  
    ///pdf section
    var MyDoc = (
      <Document>
      <Page style={styles.body}>
        <View style={styles.header}>
          <Image style={styles.headerImage} src="https://upload.wikimedia.org/wikipedia/en/7/75/National_Institute_of_Technology%2C_Kurukshetra_Logo.png" />
          <View>
            <Text style={styles.headerText}>NIT Kurukshetra</Text>
              <Text>Hostel Vivekanand</Text>
          </View>
        </View>
        <View style={styles.detailSection}>
          <Text style={{fontSize:24,borderBottom:'2px solid black'}}>Student Details</Text>
          <View style={{padding:10, display:'flex',flexDirection:'column', gap:20,flexWrap:'wrap'}}>
          <Text>Roll No: {myData.profile.rollNo}</Text>
          <Text>First Name: {myData.firstName}</Text>
            <Text>Last Name: {myData.lastName}</Text>
            <Text>Year: {myData.year}</Text>
            <Text>Official Email: {myData.email}</Text>
            <Text>courseId: {myData.courseId}</Text>
            <Text>Hostel No: {myData.hostelNo}</Text>
            <Text>roomId: {myData.roomId}</Text>
          <Text>Blood Group: {myData.profile.bloodGroup}</Text>
          <Text>Identification Mark: {myData.profile.identificationMark}</Text>
          <Text>Gender: {myData.profile.gender}</Text>
          <Text>Personal Email: {myData.profile.pEmail}</Text>
          <Text>Address: {myData.profile.subAddress}</Text>
          <Text>City: {myData.profile.city}</Text>
          <Text>State: {myData.profile.state}</Text>
          <Text>Pincode: {myData.profile.pinCode}</Text>
          <Text>Contact Number: {myData.profile.contactNumber}</Text>
          <Text>Secondary Number: {myData.profile.secondaryContact}</Text>
          <Text>Father Name: {myData.profile.fatherName}</Text>
          <Text>Father Contact: {myData.profile.fatherContact}</Text>
          <Text>Father Occupation: {myData.profile.fatherOccupation}</Text>
          <Text>Mother Name: {myData.profile.motherName}</Text>
          <Text>Mother Contact: {myData.profile.motherContact}</Text>
          <Text>Mother Occupation: {myData.profile.motherOccupation}</Text>
          <Text>Blood Group: {myData.profile.bloodGroup}</Text>
          <Text>Date of Birth: {myData.profile.dob}</Text>
          <Text>Blood Group: {myData.profile.bloodGroup}</Text>
          <Text>Addhar Number: {myData.profile.addharNumber}</Text>
  
          </View>  
        </View>
      </Page>
    </Document>
    );


    const [instance, updateInstance] = usePDF({ document: MyDoc });

    if (instance.loading) return <p>Loading...</p>;
    
    if (instance.error) return <div>Something went wrong</div>;

    return<>
        <a href={instance.url} download={`${myData.profile.rollNo}.pdf`}>
        <Button className="bg-purple-600 hover:bg-purple-500" size="sm"><PiFilePdfDuotone /></Button>
    </a>
    </>
  
  }

  export default PdfDownload;