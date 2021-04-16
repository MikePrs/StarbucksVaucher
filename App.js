import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack'
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import FormScreen from './screens/FormScreen';
import ViewFormScreen from './screens/ViewFormScreen';
import MenuScreen from './screens/MenuScreen';
import ResultsScreen from './screens/ResultsScreen';
import VoucherTicketScreen from './screens/VoucherTicketScreen';


import * as firebase from 'firebase';

var firebaseConfig = {
  apiKey: "AIzaSyA-eW42_VduJf-bhxAJZIJPUEvySB2MzMo",
  authDomain: "starbucksvaucher.firebaseapp.com",
  projectId: "starbucksvaucher",
  storageBucket: "starbucksvaucher.appspot.com",
  messagingSenderId: "880019281201",
  appId: "1:880019281201:web:7538ef636daea2fef60c10",
  measurementId: "G-LJJ77R761C"
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const switchNavigator = createSwitchNavigator({

  loginFlow: createStackNavigator({
    Login: { screen: LoginScreen },
    Register: { screen: RegisterScreen },


  },
    {
      defaultNavigationOptions: ({ navigation }) => ({
        headerTitleStyle: {
          textAlign: 'left',
          color: "white"
        },
        headerStyle: {
          backgroundColor: "#036635",
        },
      })
    }
  ),


  mainFlow: createStackNavigator({
    Menu: { screen: MenuScreen },
    Form: { screen: FormScreen },
    ViewForm: { screen: ViewFormScreen },
    Results: { screen: ResultsScreen },
    VoucherTicket: { screen: VoucherTicketScreen },

  },
    {
      defaultNavigationOptions: ({ navigation }) => ({
        headerTitleStyle: {
          textAlign: 'left',
          color: "white"
        },
        headerStyle: {
          backgroundColor: "#036635",
        },
      })
    },
    {
      initialRouteName: "Menu"
    })

});

const App = createAppContainer(switchNavigator);

export default App;