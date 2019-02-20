import React from 'react'
import { AppRegistry, StatusBar, View } from 'react-native';
import {} from './src/utils/ScreenUtils'
import { Provider } from 'react-redux'
import Store from './src/utils/ConfigRedux'
import CodePush from 'react-native-code-push'
import App from './App'

class Root extends React.Component {

    render() {
        return (
            <Provider store={Store}>
                <App />
            </Provider>
        );
    }
}

// var wrapper = CodePush({
//   checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
//   installMode: CodePush.InstallMode.ON_NEXT_RESTART
// })(Root);

AppRegistry.registerComponent('colavideoapp', () => Root);
