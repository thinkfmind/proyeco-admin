import { Router, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { PrivateRoute } from "./routes/privateRouter";
import { createBrowserHistory } from "history";
import Home from "./views/home";
import Users from "./views/users";
import Login from "./views/login";
import Equipment from './views/equipment'
import EquipmentCreate from './views/equipment/create'
import AlertCreate from './views/alerts/create'
import AlertHistory from './views/alerts/history'
import Search from './views/equipment/search'
import EquipmentList from "./views/equipment/list";
// import EquipmentRegisterActivity from "./views/equipment/activity";
import Activity from "./views/equipment/activity";
import ActivityCreate from "./views/equipment/activity/create";
import ActivityCreateEmpresa from "./views/equipment/activity/createEmpresa";
import ActivityEdit from "./views/equipment/activity/edit";
import HistoricCreate from "./views/equipment/activity/historic/create";
import HistoricEdit from "./views/equipment/activity/historic/edit";
import Trash from "./views/trash";
import TrashEmpresa from "./views/trash/empresa";
import EquipmentDisponibility from "./views/equipment/disponibility";
import EquipmentEdit from "./views/equipment/edit";
import EquipmentDetails from "./views/equipment/details";
import TablaGerencia from './views/equipment/tablaGerencia'
import "./App.css";

function App() {
  const history = createBrowserHistory();
  return (
    <Provider store={store}>
      <Router history={history}>
        <Switch>
          <PrivateRoute exact path="/home" component={Home} />
          <PrivateRoute exact path="/users" component={Users} />
          <PrivateRoute exact path="/alerts/create" component={AlertCreate} />
          <PrivateRoute exact path="/alerts" component={AlertHistory} />
          <PrivateRoute exact path="/equipment" component={Equipment} />
          <PrivateRoute exact path="/equipmentalt" component={TablaGerencia} />
          <PrivateRoute exact path="/equipment/create" component={EquipmentCreate} />
          <PrivateRoute exact path="/equipment/details" component={EquipmentDetails} />
          <PrivateRoute exact path="/equipment/list" component={EquipmentList} />
          <PrivateRoute exact path="/equipment/disponibility" component={EquipmentDisponibility} />
          <PrivateRoute exact path="/equipment/activity" component={Activity} />
          <PrivateRoute exact path="/equipment/activity/create" component={ActivityCreate} />
          <PrivateRoute exact path="/equipment/activity/empresa/create" component={ActivityCreateEmpresa} />
          <PrivateRoute exact path="/equipment/activity/update" component={ActivityEdit} />
          <PrivateRoute exact path="/equipment/activity/historic/create" component={HistoricCreate} />
          <PrivateRoute exact path="/equipment/activity/historic/update" component={HistoricEdit} />
          <PrivateRoute exact path="/equipment/edit" component={EquipmentEdit} />
          <PrivateRoute exact path="/activity" component={Users} />
          <PrivateRoute exact path="/activity/create" component={Users} />
          <PrivateRoute exact path="/hystoric" component={Users} />
          <PrivateRoute exact path="/search" component={Search} />
          <PrivateRoute exact path="/trash" component={Trash} />
          <PrivateRoute exact path="/etrash" component={TrashEmpresa} />
          <Route exact path="/" component={Login} />
          <Redirect from="*" to="/home" />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
