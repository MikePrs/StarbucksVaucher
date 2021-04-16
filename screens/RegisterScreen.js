import React from 'react';
import { StyleSheet, View, Alert, Image } from 'react-native';
import { Container, Content, Form, Item, Text, Input, Label, Button } from 'native-base';
import * as firebase from 'firebase';
import DatePicker from 'react-native-datepicker'


export default class RegisterScreen extends React.Component {

  static navigationOptions = {

    headerTitleStyle: {
      textAlign: 'left',
      color: "white"
    },
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
      email: '',
      password: '',
      //userId: '',

      name: '',
      lastName: '',
      fatherName: '',
      date: '',
    };
  };


  SignUpUser = (email, password) => {

    if ((this.state.date === '')
      || (this.state.name === '')
      || (this.state.lastName === '')
      || (this.state.fatherName === '')
    ) {
      Alert.alert('Fill All fields.')
    } else {
      try {
        firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then((user) => {
            if (firebase.auth().currentUser) {
              var userId = firebase.auth().currentUser.uid;
              if (userId) {
                // this.setState({
                //   userId: authenticate.uid
                // })


                firebase.database().ref('users/' + userId)
                  .set({
                    name: this.state.name,
                    lastName: this.state.lastName,
                    fatherName: this.state.fatherName,
                    date: this.state.date,
                    time: Date.now(),
                  }).then(() => {
                    console.log('register id ' + userId)
                    this.props.navigation.navigate("mainFlow");

                  })
              }

            }
          })

          .catch(err => {
            alert(err.message)
          })
      } catch (err) {
        alert("Fill all required fields")
      }
    }


  }



  render() {

    return (
      <Container >

        <Content style={{ marginTop: 30 }}>
          <Label style={{ fontSize: 30, padding: 10, color: '#036635', fontWeight: 'bold' }}>Register</Label>
          <Form>
            <Item fixedLabel>
              <Label>Name</Label>
              <Input
                onChangeText={name => this.setState({
                  name
                })}
                autoCorrect={false}
                autoCapitalize="none"
              />
            </Item>
            <Item fixedLabel last>
              <Label>Last Name</Label>
              <Input
                onChangeText={lastName => this.setState({
                  lastName
                })}
                autoCorrect={false}
                autoCapitalize="none"
              />
            </Item>
            <Item fixedLabel>
              <Label>Father Name</Label>
              <Input
                onChangeText={fatherName => this.setState({
                  fatherName
                })}
                autoCorrect={false}
                autoCapitalize="none"
              />
            </Item>
            <Item>
              <Label>Birthday</Label>
              <DatePicker

                date={this.state.date}
                mode="date"
                placeholder="select date"
                format="YYYY-MM-DD"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                onDateChange={(date) => { this.setState({ date }) }}
                useNativeDriver="false"
                androidMode="spinner"
              />
            </Item>

          </Form>
          <Form>
            <Item fixedLabel>
              <Label>Email</Label>
              <Input
                onChangeText={email => this.setState({
                  email
                })}
                keyboardType='email-address'
                autoCorrect={false}
                autoCapitalize="none"
              />
            </Item>
            <Item fixedLabel last>
              <Label>Password</Label>
              <Input
                onChangeText={password => this.setState({
                  password
                })}
                secureTextEntry={true}
                autoCorrect={false}
                autoCapitalize="none"
              />
            </Item>


          </Form>

          <View style={{ paddingHorizontal: 50, paddingVertical: 20 }}>
            <Button block style={{ backgroundColor: '#036635' }}
              onPress={() => { this.SignUpUser(this.state.email, this.state.password) }}
            >
              <Text style={{ fontSize: 20, color: 'white' }}>Register</Text>
            </Button>
          </View>
          <View style={{ paddingHorizontal: 50 }}>
            <Button block light style={{ borderWidth: 3, borderColor: '#036635', backgroundColor: 'white' }}
              onPress={() => { this.props.navigation.navigate("Login") }}
            >
              <Text style={{ fontSize: 20, color: '#036635' }}>Login</Text>
            </Button>
          </View>
        </Content>
      </Container >
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
  headerTitle: {
    flexDirection: 'row',
    paddingRight: 60
  },
});