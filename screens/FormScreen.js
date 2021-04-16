import React from 'react';
import { StyleSheet, View, Text, Alert, Image } from 'react-native';
import { Container, Content, Form, Item, Input, Button } from 'native-base';
import * as firebase from 'firebase';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

var periodEnd = '2020-12-29';

export default class FormScreen extends React.Component {

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
      count: 0,
      results: [],
      periodEnd:'',
      AFM: '',
      AMKA: '',
      OAED: '',
      ADT: '',
      date: '',
      userId: ''
    };
  };



  async componentDidMount() {

    firebase.database().ref('users/count')
      .on('value', (snapshot) => {
        console.log(snapshot)
        this.setState({ count: snapshot.val() })
      });
    
    firebase.database().ref('users/expire')
      .on('value', (snapshot) => {
        console.log(snapshot)
        this.setState({ periodEnd: snapshot.val() })
        this.periodCheck(snapshot.val());
      });

    

    firebase.auth().onAuthStateChanged(authenticate => {
      if (authenticate) {
        this.setState({
          userId: authenticate.uid
        })
      }
    })

  }


  GenerateRandomNumber = () => {

    var RandomNumber = Math.floor(Math.random() * 100) + 1;

    this.setState({
      NumberHolder: RandomNumber
    })
  }

  addToResults(amka, moria, afm) {
    var array = [];


    array.push(amka + ' ' + moria)
    this.setState({ results: array })

    console.log('AMKA---' + amka)
    console.log('MORIA---' + moria)
    console.log('AFM---' + afm)
    console.log('RESULTS---' + this.state.results)
    console.log('count---' + this.state.count)

    firebase.database().ref('users/results').child(this.state.count).set({ moria: moria, amka: amka, afm: afm })
    firebase.database().ref('users/').child('count').set(this.state.count + 1)

  }

  checkAMKA(count, amka) {
    console.log('COUNT  ' + count);
    console.log('AMKA  ' + amka);
    var value;
    for (let i = 0; i < count; i++) {
      firebase.database().ref('users/results/' + i)
        .on('value', (snapshot) => {

          console.log('OTHER AMKA  ' + snapshot.val().amka)
          if (snapshot.val().amka === amka) {
            value = true
          }
        })
    }
    if (value) {
      return true
    } else {
      return false
    }

  }

  checkAFM(count, afm) {
    
    console.log('COUNT  ' + count);
    console.log('AFM  ' + afm);
    var value;
    for (let i = 0; i < count; i++) {
      firebase.database().ref('users/results/' + i)
        .on('value', (snapshot) => {

          console.log('OTHER AFM  ' + snapshot.val().afm)
          if (snapshot.val().afm === afm) {
            value = true
          }
        })
    }
    if (value) {
      return true
    } else {
      return false
    }

  }

  createForm() {

    console.log('AFM check '+this.checkAMKA(this.state.count, this.state.AMKA))
    console.log('AFM check '+this.checkAFM(this.state.count, this.state.AFM))
    this.periodCheck(this.state.periodEnd);


    if (this.state.formState) {
 
      
      if ((this.state.ADT.length == 9) &&
        (this.state.AMKA.length == 11) &&
        (this.state.AFM.length == 9) &&
        (this.state.OAED.length == 13))
      {
        firebase.database().ref('users/' + this.state.userId)
          .on('value', (snapshot) => {
            if (snapshot.val()) {
              this.setState({ date: snapshot.val().date })
              firebase.database().ref('users/' + this.state.userId + '__' + this.state.userId)
                .once("value")
                .then(snapshot => {
                  if (snapshot.exists()) {
                    Alert.alert('This form already exists . ')
                  } else {


                    if (this.checkAMKA(this.state.count, this.state.AMKA)) {
                      Alert.alert('This AMKA exists')
                    } else {
                      if (this.checkAFM(this.state.count, this.state.AFM)) {
                        Alert.alert('This AFM exists')
                      } else {
                        if ((this.state.date).toString() <= '1984-12-31') {
                          Alert.alert(`Applier have to be borned after 31/12/1984 `)
                        } else {

                          this.GenerateRandomNumber();
                          firebase.database().ref('users/' + this.state.userId + '__' + this.state.userId)
                            .set({
                              AFM: this.state.AFM,
                              AMKA: this.state.AMKA,
                              OAED: this.state.OAED,
                              ADT: this.state.ADT,
                              time: Date.now(),
                              moria: this.state.NumberHolder
                            }).then(() => {
                              this.addToResults(this.state.AMKA, this.state.NumberHolder, this.state.AFM);
                              this.props.navigation.navigate('Menu')
                            });
                        }
                      }
                    }


                  }
                })
            }
          });

        console.log(this.state.date)
       
      } else {
        Alert.alert('Fill form properly .')
      }

    } else {
      Alert.alert('Form period has expired. ')
    }
  }

  periodCheck(periodEnd) {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    console.log(year + '-' + month + '-' + date > periodEnd)
    if (year + '-' + month + '-' + date > periodEnd) {
      this.setState({ formStatus: 'Filling period has expired', endDate: periodEnd, formState: false })
    } else if ((year + '-' + month + '-' + date <= periodEnd)) {
      this.setState({ formStatus: 'Filling period', endDate: 'expires:' + periodEnd, formState: true })
    }
  }

  fillPeriod() {
    if (this.state.formState) {
      return 'green'
    } else if (!this.state.formState) {
      return 'red'
    }
  }



  render() {

    return (
      <Container style={{ paddingVertical: 50 }}>
        <View style={styles.status} >
          <Text style={{
            color: this.fillPeriod(),
            fontSize: 20,
            alignSelf: 'center'
          }}>
            {this.state.formStatus}
          </Text>
          <Text style={{ color: 'red', fontSize: 20, alignSelf: 'center' }}> {this.state.endDate}</Text>
        </View>
        <Content>
          <Form>
            <Item stackedLabel>
              <View style={styles.labelRow}>
                <Text style={styles.label}>A.F.M</Text>
                {
                  (this.state.AFM.length !== 9)
                    ?
                    <View style={styles.labelRow}>
                      <MaterialIcons name="error-outline" size={24} color="red" style={{ paddingLeft: 20 }} />
                      <Text style={styles.errMessage}> Should have 9 digits .</Text>
                    </View>
                    :
                    <AntDesign name="checkcircleo" size={24} color="green" style={{ paddingLeft: 20 }} />
                }
              </View>
              <Input
                onChangeText={AFM => this.setState({
                  AFM
                })}
                maxLength={9}
                keyboardType='numeric'
                autoCorrect={false}
                autoCapitalize="none"
              />
            </Item>
            <Item stackedLabel last>

              <View style={styles.labelRow}>
                <Text style={styles.label}>A.M.K.A</Text>
                {
                  (this.state.AMKA.length !== 11)
                    ?
                    <View style={styles.labelRow}>
                      <MaterialIcons name="error-outline" size={24} color="red" style={{ paddingLeft: 20 }} />
                      <Text style={styles.errMessage}> Should have 11 digits .</Text>
                    </View>
                    :
                    <AntDesign name="checkcircleo" size={24} color="green" style={{ paddingLeft: 20 }} />
                }
              </View>
              <Input
                onChangeText={AMKA => this.setState({
                  AMKA
                })}
                maxLength={11}
                keyboardType='numeric'
                autoCorrect={false}
                autoCapitalize="none"
              />
            </Item>
            <Item stackedLabel>

              <View style={styles.labelRow}>
                <Text style={styles.label}>O.A.E.D card ID</Text>
                {
                  (this.state.OAED.length !== 13)
                    ?
                    <View style={styles.labelRow}>
                      <MaterialIcons name="error-outline" size={24} color="red" style={{ paddingLeft: 20 }} />
                      <Text style={styles.errMessage}> Should have 13 digits .</Text>
                    </View>
                    :
                    <AntDesign name="checkcircleo" size={24} color="green" style={{ paddingLeft: 20 }} />
                }
              </View>
              <Input
                onChangeText={OAED => this.setState({
                  OAED
                })}
                maxLength={13}
                keyboardType='numeric'
                autoCorrect={false}
                autoCapitalize="none"
              />
            </Item>
            <Item stackedLabel last>
              <View style={styles.labelRow}>
                <Text style={styles.label}>A.D.T</Text>
                {
                  (this.state.ADT.length !== 9)
                    ?
                    <View style={styles.labelRow}>
                      <MaterialIcons name="error-outline" size={24} color="red" style={{ paddingLeft: 20 }} />
                      <Text style={styles.errMessage}> Should have 9 characters . </Text>
                    </View>
                    :
                    <AntDesign name="checkcircleo" size={24} color="green" style={{ paddingLeft: 20 }} />
                }
              </View>
              <Input
                onChangeText={ADT => this.setState({
                  ADT
                })}
                maxLength={9}
                autoCorrect={false}
                autoCapitalize="none"
              />
            </Item>

          </Form>
          <Button full style={{ backgroundColor: '#036635' }}
            onPress={() => { this.createForm() }}
          >
            <Text style={{ fontSize: 20, color: 'white' }}>Submit Form</Text>
          </Button>

        </Content>
      </Container>
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
  label: {
    alignSelf: 'flex-start',
    fontSize: 17
  },
  status: {
    padding: 10, marginTop: -30, marginBottom: 20,

    flexDirection: 'row',
  },
  headerTitle: {
    flexDirection: 'row',
    paddingRight: 60
  },
  labelRow: {
    flexDirection: 'row',
    alignSelf: 'flex-start'
  },
  errMessage: {
    fontSize: 17,
    color: 'red'
  }
});