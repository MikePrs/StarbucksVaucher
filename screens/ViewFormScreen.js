import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Container, Content, Card, CardItem } from 'native-base';
import * as firebase from 'firebase';

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
      userId: '',
      name: '',
      lastName: '',
      fatherName: '',
      date: '',
      AFM: '',
      AMKA: '',
      OAED: '',
      ADT: '',
    };
  };

  componentDidMount() {
    let id = this.props.navigation.getParam("id", "");
    this.setState({ userId: id })

    console.log('view id' + id)

    firebase.database().ref('users/' + id + '__' + id)
      .on('value', (snapshot) => {

        this.setState({

          AFM: snapshot.val().AFM,
          AMKA: snapshot.val().AMKA,
          OAED: snapshot.val().OAED,
          ADT: snapshot.val().ADT,

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





  render() {
    return (
      <Container>

        <Content>
          <Card>
            <CardItem header>
              <Text style={{ fontSize: 20 }}>Name: </Text>
              <Text style={{ fontSize: 20 }}>{this.state.name} </Text>
            </CardItem>
            <CardItem>
              <Text style={{ fontSize: 20 }}>Last Name: </Text>
              <Text style={{ fontSize: 20 }}>{this.state.lastName} </Text>
            </CardItem>
            <CardItem>
              <Text style={{ fontSize: 20 }}>Fathers Name: </Text>
              <Text style={{ fontSize: 20 }}>{this.state.fatherName} </Text>
            </CardItem>
            <CardItem>
              <Text style={{ fontSize: 20 }}>Birth Date: </Text>
              <Text style={{ fontSize: 20 }}>{this.state.date} </Text>
            </CardItem>
            <CardItem>
              <Text style={{ fontSize: 20 }}>AFM: </Text>
              <Text style={{ fontSize: 20 }}>{this.state.AFM} </Text>
            </CardItem>
            <CardItem>
              <Text style={{ fontSize: 20 }}>AMKA: </Text>
              <Text style={{ fontSize: 20 }}>{this.state.AMKA} </Text>
            </CardItem>
            <CardItem>
              <Text style={{ fontSize: 20 }}>OAED: </Text>
              <Text style={{ fontSize: 20 }}>{this.state.OAED} </Text>
            </CardItem>
            <CardItem>
              <Text style={{ fontSize: 20 }}>ADT: </Text>
              <Text style={{ fontSize: 20 }}>{this.state.ADT} </Text>
            </CardItem>
          </Card>
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