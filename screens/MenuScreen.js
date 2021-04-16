import React from 'react';
import { StyleSheet, Text, View, Image, Alert } from 'react-native';
import { Container, Content, Button } from 'native-base';
import * as firebase from 'firebase';


var periodEnd = '2020-12-1'
export default class App extends React.Component {
  static navigationOptions = {
    title: '',
    headerRight: () =>
      <View style={styles.headerTitle}>
        <Text style={{ color: 'white', marginTop: 10, fontSize: 20, fontWeight: 'bold' }}>STARBUCKS</Text>
        {/* <Image style={{ height: 50, width: 50 }} color="white" source={require('../assets/starbucksLogo.png')} /> */}
        <Text style={{ color: 'white', marginTop: 10, fontSize: 20, }}>VOUCHER</Text>
      </View>
  };


  constructor(props) {
    super(props)

    this.state = {
      AMKA: '',
      flag: false,
      periodEnd:'',
    };
  };

  sortArray(prop) {

    return function (a, b) {
      if (a[prop] < b[prop]) {
        return 1;
      } else if (a[prop] >= b[prop]) {
        return -1;
      }
      return 0;
    }
  }

  componentDidMount() {
     
    firebase.database().ref('users/expire')
      .on('value', (snapshot) => {
        console.log(snapshot)
        this.setState({ periodEnd: snapshot.val() })
      });

    firebase.auth().onAuthStateChanged(authenticate => {

      if (authenticate) {
        console.log('menu screen user id ---- ' + authenticate.uid)
        this.setState({
          userId: authenticate.uid
        })

        firebase.database().ref('users/' + authenticate.uid + '__' + authenticate.uid)
          .on('value', (snapshot) => {
            if (snapshot.val()) {
              this.setState({
                AMKA: snapshot.val().AMKA,
              })
              firebase.database().ref('users/results')
                .on('value', (snapshot) => {

                  if (snapshot.val() !== undefined) {
                    //console.log(snapshot.val())
                    this.setState({ results: snapshot.val().sort(this.sortArray('moria')).slice(0, 10) })
                    this.ticketCheck(snapshot.val().sort(this.sortArray('moria')).slice(0, 10), this.state.AMKA)
                  }
                });
            }
          });
      }
    })
  }



  signOut = () => {
    console.log("user signed out ");
    firebase
      .auth()
      .signOut()
      .then(this.props.navigation.navigate('Login'))
      .catch(err => { alert(err) });


  }



  ticketCheck(results, amka) {

    console.log('AMKA' + this.state.AMKA)
    console.log('Results ' + JSON.stringify(results))

    results.find((results) => {

      if (results.amka == amka) {
        console.log('AMKA found')
        this.setState({ flag: true })
        return;
      }
    });

  }

  periodCheck(periodEnd) {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    // console.log(year + '-' + month + '-' + date > periodEnd)
    if (year + '-' + month + '-' + date > periodEnd) {
      return true;
    } else if ((year + '-' + month + '-' + date <= periodEnd)) {
      return false;
    }
  }

  submitCheck(screen) {
    firebase.database().ref('users/' + this.state.userId + '__' + this.state.userId)
      .once("value")
      .then(snapshot => {
        if (!snapshot.exists()) {
          Alert.alert('Submit Form first. ')
        } else {
          this.setState({ submited: true })
          this.props.navigation.navigate(screen, { id: this.state.userId })
        }
      })
  }



  render() {
    return (
      <View style={styles.container}>
        <View style={{ padding: 50 }}>
          <Image style={{ height: 100, width: 100 }} color="white" source={require('../assets/starbucksLogo.png')} />
        </View>
        <Container>
          <Content>

            <Button style={[styles.buttons, { borderColor: '#004d00', }]} transparent
              onPress={() => { this.props.navigation.navigate('Form') }}
            >
              <Text style={{ fontSize: 30, color: '#004d00' }}>Submit Form</Text>
            </Button>

            <Button style={[styles.buttons, { borderColor: '#008000', }]} transparent
              onPress={() => { this.submitCheck('ViewForm') }}
            >
              <Text style={{ fontSize: 30, color: '#008000' }}>View Form</Text>
            </Button>

            <Button style={[styles.buttons, { borderColor: '#00b300', }]} transparent
              onPress={() => {
                if (this.periodCheck(this.state.periodEnd)) {
                  this.submitCheck('Results');
                } else {
                  Alert.alert('Rsults will open after the expiration date.')
                }
              }}
            >
              <Text style={{ fontSize: 30, color: '#00b300' }}>Results board</Text>
            </Button>

            <Button style={[styles.buttons, { borderColor: '#00e600', }]} transparent
              onPress={() => {

                if (this.periodCheck(this.state.periodEnd)) {
                  if (this.state.submited) {


                    if (!this.state.flag) {
                      Alert.alert("You are not in the beneficiaries table . ")
                    } else {
                      this.props.navigation.navigate("VoucherTicket", { id: this.state.userId })
                    }
                  } else {
                    Alert.alert('Submit Form first.')
                  }
                } else {
                  Alert.alert('Voucher will open after the expiration date.')
                }
              }}
            >
              <Text style={{ fontSize: 30, color: '#00e600' }}>Get Vaucher Ticket</Text>
            </Button>

            <Button style={[styles.buttons, { borderColor: '#66ff66', }]} transparent
              onPress={() => { this.signOut() }}
            >
              <Text style={{ fontSize: 30, color: '#66ff66' }}>Sign Out</Text>
            </Button>
          </Content>
        </Container>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',

  },
  rowContainer: {
    flexDirection: 'row'
  },
  headerTitle: {
    flexDirection: 'row',
    paddingRight: 100
  },
  buttons: {
    borderWidth: 2,
    padding: 20,
    margin: 10,
    borderRadius: 20
  }


});