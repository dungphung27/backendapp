import logo from './logo.svg';
import './App.css';
import { AppProvider } from "./context/AppContext";
import SendMessageButton from './provider/sendSMS';
import MyComponent from './provider/MyComponet';
function App() {
  return (
    <AppProvider>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            <code>TRACKING WEBSITE</code> 
          </p>
          <SendMessageButton phoneNumber="+84368609105" messageBody="chung xấu  trai số 1 thế giới" />
          <MyComponent />
        </header>
      </div>
    </AppProvider> 
  );
}

export default App;
