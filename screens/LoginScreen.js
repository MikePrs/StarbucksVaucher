import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Container, Content, Form, Item, Text, Input, Label, Button } from 'native-base';
import * as firebase from 'firebase';



export default class LoginScreen extends React.Component {


  static navigationOptions = {

    headerTitleStyle: {
      color: 'white'
    },
    title: '',
    headerRight: () =>
      <View style={styles.headerTitle}>
        <Text style={{color:'white',marginTop:10,fontSize:20,fontWeight:'bold'}}>STARBUCKS</Text>
        <Image style={{ height: 50, width: 50 }} color="white" source={require('../assets/starbucksLogo.png')} />
        <Text style={{ color: 'white', marginTop: 10, fontSize: 20,}}>VOUCHER</Text>
      </View>
    


  };
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: ''
    };
  };

  componentDidMount = async () => {

    firebase.auth().onAuthStateChanged(authenticate => {
      if (authenticate) {
        this.setState({
          email: authenticate.email,
          id: authenticate.uid

        })
        this.props.navigation.navigate("mainFlow")
      }
    })
  }

  signInUser = (email, password) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {

        this.props.navigation.navigate("mainFlow")
        
      })
      .catch(err => {
        alert(err.message)
      })
  };

  render() {
    return (

      <Container >
        <Content style={{ marginTop: 30 }}>
          <Label style={{ fontSize: 30, padding: 10, color: '#036635', fontWeight: 'bold' }}>Login</Label>
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
              onPress={() => { this.signInUser(this.state.email, this.state.password) }}
            >
              <Text style={{ fontSize: 20, color: 'white' }}>Login</Text>
            </Button>
          </View>
          <View style={{ paddingHorizontal: 50 }}>
            <Button block light style={{ borderWidth: 3, borderColor: '#036635', backgroundColor: 'white' }}
              onPress={() => { this.props.navigation.navigate("Register") }}
            >
              <Text style={{ fontSize: 20, color: '#036635' }}>Register</Text>
            </Button>
          </View>
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
  headerTitle: {
    flexDirection: 'row',
    paddingRight: 60
  },
});