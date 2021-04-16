import React from 'react';
import { StyleSheet, View, Image, Alert } from 'react-native';
import { Container, Content, Form, Item, Input, Label, Button, Text } from 'native-base';
import * as firebase from 'firebase';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export default class App extends React.Component {

  static navigationOptions = {
    title: '',
    headerRight: () =>
      <View style={styles.headerTitle}>
        <Text style={{ color: 'white', marginTop: 10, fontSize: 20, fontWeight: 'bold' }}>STARBUCKS</Text>
        <Image style={{ height: 50, width: 50 }} color="white" source={require('../assets/starbucksLogo.png')} />
        <Text style={{ color: 'white', marginTop: 10, fontSize: 20, }}>VOUCHER</Text>
      </View>
  };


  constructor(props) {
    super(props)

    this.state = {
      voucherID: '',
      voucherOK: false,
      html: ''
    };
  };



  componentDidMount() {
    let id = this.props.navigation.getParam("id", "");
    this.setState({ userId: id })



    firebase.database().ref('users/' + id + '__' + id)
      .on('value', (snapshot) => {

        this.setState({

          AFM: snapshot.val().AFM,
          AMKA: snapshot.val().AMKA,
          OAED: snapshot.val().OAED,
          ADT: snapshot.val().ADT,
          moria: snapshot.val().moria,
        })
      });

    firebase.database().ref('users/' + id)
      .on('value', (snapshot) => {

        this.setState({

          name: snapshot.val().name,
          lastName: snapshot.val().lastName,
          fatherName: snapshot.val().fatherName,
          date: snapshot.val().date,
        })
      });


  };

  ok() {
    if (this.state.voucherID.length === 16) {
      this.setState({ voucherOK: true })

    } else {
      Alert.alert('Voucher ID should be 16 digits .')
    }
  }


  async getPDF() {



    const html =
      `<div style='text-align: center'>
      <img src="https://pbs.twimg.com/media/DeZLY6EUwAE7yur.jpg">
      <h1> Your STARBUCKS Voucher ticket </h1>
      <h2>Name: ${this.state.name}</h2>
      <h2>Last Name: ${this.state.lastName}</h2>
      <h2>Father Name: ${this.state.fatherName}</h2>
      <h2>Birthday: ${this.state.date}</h2>
      <h2>AMKA: ${this.state.AMKA}</h2>
      <h2>AFM: ${this.state.AFM}</h2>
      <h2>OAED: ${this.state.OAED}</h2>
      <h2>ADT: ${this.state.ADT}</h2>
      <h2>Moria: ${this.state.moria}</h2>
      <p style='font-size: 30px '><b>Your ticket code : ${this.state.voucherID} </b></p>
      <div/>`;

    const { uri } = await Print.printToFileAsync({ html });
    Sharing.shareAsync(uri);

  }




  render() {


    if (!this.state.voucherOK) {


      return (
        <Container >


          <Content style={{ marginTop: 100 }}>
            <Form>
              <Label style={{ alignSelf: 'center', fontSize: 25, padding: 40, color: 'green' }}>Give your VoucherID</Label>
              <Item fixedLabel>

                <Input
                  onChangeText={voucherID => this.setState({
                    voucherID
                  })}
                  style={{ borderWidth: 2, borderColor: 'green', marginHorizontal: 20, borderRadius: 10 }}
                  maxLength={16}
                  keyboardType='numeric'
                  autoCorrect={false}
                  autoCapitalize="none"
                />
              </Item>
            </Form>
            <Button success
              style={{ backgroundColor: 'green', margin: 40, alignSelf: 'center' }}
              onPress={() => { this.ok() }}
            >
              <Text> OK </Text>
            </Button>
          </Content>

        </Container>
      );


    } else {
      return (
        <Container >


          <Content style={{ marginTop: 100 }}>
            <Form>
              <Label style={{ alignSelf: 'center', fontSize: 25, padding: 40, color: 'grey' }}>Give your VoucherID</Label>
              <Item fixedLabel>

                <Input
                  disabled
                  onChangeText={voucherID => this.setState({
                    voucherID
                  })}
                  style={{ borderWidth: 2, borderColor: 'grey', marginHorizontal: 20, borderRadius: 10 }}
                  maxLength={16}
                />
              </Item>
            </Form>
            <Button disabled
              style={{ backgroundColor: 'grey', margin: 40, alignSelf: 'center' }}
              onPress={() => { this.ok() }}
            >
              <Text> OK </Text>
            </Button>

            <Button success
              style={{ alignSelf: 'center' }}
              onPress={() => { this.getPDF() }}
            >
              <Text>Get your ticket in PDF .</Text>
            </Button>
          </Content>

        </Container>
      );
    }

  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flexDirection: 'row',
    paddingRight: 60
  },

});