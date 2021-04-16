import React from 'react';
import { StyleSheet, Text, View, FlatList, ScrollView, Image } from 'react-native';
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
      results: []
    };
  };

  componentDidMount() {
    firebase.database().ref('users/results')
      .on('value', (snapshot) => {

        if (snapshot.val() !== undefined) {
          console.log(snapshot.val())
          this.setState({ results: snapshot.val().sort(this.sortArray('moria')) })
        }
      });


    let id = this.props.navigation.getParam("id", "");
    this.setState({ userId: id })

    firebase.database().ref('users/' + id + '__' + id)
      .on('value', (snapshot) => {
        if (snapshot.val()) {
          this.setState({
            AMKA: snapshot.val().AMKA,
          })
        }
      })
  }




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

  color(amka, index) {
    console.log(this.state.AMKA)
    console.log(amka)
    console.log(this.state.AMKA == amka)
    if (this.state.AMKA == amka) {
      return '#2eb82e'
    }
    if (index <= 10) {
      return 'orange'
    } else {
      return '#cccccc'
    }
  }

  UserColor(amka) {
    console.log(this.state.AMKA)
    console.log(amka)
    console.log(this.state.AMKA == amka)
    if (this.state.AMKA == amka) {
      return '#2eb82e'
    }

  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{fontSize:17,padding:5,color:'red'}}>Top 10 appliers will receive a voucher id</Text>
        <View style={styles.titles2}>

          <Text style={{ fontSize: 20, paddingRight: 95 }}>  AMKA</Text>
          <Text style={{ fontSize: 20 }}>MORIA  </Text>

        </View>
        <FlatList
          data={this.state.results}
          keyExtractor={(item, index) => (item.amka, index)}
          renderItem={({ item, index }) => {

            return (
              <ScrollView>
                <Text style={{ fontSize: 20, paddingLeft: 15, top: 30 }}>{index + 1}  </Text>
                <View style={[styles.titles, { backgroundColor: this.color(item.amka, index + 1) }]}>

                  <Text style={{ fontSize: 20, paddingRight: 90 }} > {item.amka}</Text>
                  <Text style={{ fontSize: 20 }} >{item.moria} </Text>
                </View>
              </ScrollView>
            )
          }}
        />
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
    paddingTop: 20
  },
  titles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: 'grey',
    borderWidth: 2,
    width: '75%',
    alignSelf: 'center',

  },
  titles2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: 'grey',
    borderWidth: 2,
    width: '85%',
    alignSelf: 'center',
    backgroundColor: 'yellow'
  },
  headerTitle: {
    flexDirection: 'row',
    paddingRight: 60
  },
});