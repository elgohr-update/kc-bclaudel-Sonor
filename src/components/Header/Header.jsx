import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import logo from './logo_com_externe_semi_bold.png';
import D from '../../i18n';
import { version } from '../../../package.json';
import { BY_INTERVIEWER, BY_SURVEY } from '../../utils/constants.json';

import './Header.css';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleFirstMenu: false,
    };
  }

  toggleFirstDropDownMenu(e) {
    const { toggleFirstMenu } = this.state;
    e.stopPropagation();
    this.setState({ toggleFirstMenu: !toggleFirstMenu });
  }

  displayFirstSubMenu(toggle) {
    const { goToMonitoringTable } = this.props;
    if (toggle) {
      return (
        <ul className="dropdown-menu">
          <li>
            <a className="selectedSubeMenu" href="#">
              {D.surveys}
              <i className="fa fa-caret-right fa-xs subMenucaret" />
            </a>
            <ul className="dropdown-menu sub-menu">
              <li>
                <a onClick={() => goToMonitoringTable(BY_SURVEY)} className="selectedSubeMenu" href="#">
                  {D.progression}
                </a>
              </li>
            </ul>
          </li>
          <li>
            <a id="selectedSubeMenu" className="selectedSubeMenu" href="#">
              {D.interviewers}
              <i className="fa fa-caret-right fa-xs subMenucaret" />
            </a>
            <ul className="dropdown-menu sub-menu" id="SecondDropdown">
              <li>
                <a onClick={() => goToMonitoringTable(BY_INTERVIEWER)} className="selectedSubeMenu" href="#">
                  {D.progression}
                </a>
              </li>
            </ul>
          </li>
        </ul>
      );
    }
    return null;
  }

  hideMenu() {
    this.setState({ toggleFirstMenu: false });
  }

  render() {
    const {
      returnFunc, user, showPreferences, goToReview, currentView,
    } = this.props;
    const { toggleFirstMenu } = this.state;
    return (
      <header id="App-header" className="shadow">
        <Container fluid>
          <Row onClick={() => { this.hideMenu(); }}>
            <Col md="auto">
              <img
                src={logo}
                id="InseeLogo"
                alt="logo"
                className="Clickable"
                onClick={() => returnFunc()}
              />
              <div id="appVersion">
                {version}
              </div>
            </Col>
            <Col>
              <div className="d-inline-flex classTest" id="headerButtonContainer">
                <Button className="HeaderButton">{D.remind}</Button>
                <li className="dropdown" id="BtnSuivreParent">
                  <Button
                    id="FollowButton"
                    className={` HeaderButton HeaderFocusableButton dropdown-toggle ${currentView === 'monitoringTable' ? ' ButtonActive' : ''}`}
                    data-toggle="dropdown"
                    href="#"
                    onClick={(e) => { this.toggleFirstDropDownMenu(e); }}
                  >
                    {D.follow}
                    <b className="caret" />
                  </Button>
                  {this.displayFirstSubMenu(toggleFirstMenu)}
                </li>
                <Button
                  onClick={() => goToReview()}
                  className={` HeaderButton HeaderFocusableButton ${currentView === 'review' ? ' ButtonActive' : ''}`}
                >
                  {D.read}
                </Button>
              </div>
            </Col>
            <Col><UserZone user={user} date={new Date()} showPreferences={showPreferences} /></Col>
          </Row>
        </Container>
      </header>
    );
  }
}

function UserZone({ user, date, showPreferences }) {
  return (
    <Card id="UserZone">
      <Card.Title>
        { 'Bienvenue '}
        {user.firstName}
        &nbsp;
        {user.lastName}
      </Card.Title>
      <Card.Subtitle className="mb-2 text-muted">{date.toLocaleDateString()}</Card.Subtitle>
      <div className="UserZoneButtons">
        <Button className="HeaderButton" onClick={() => showPreferences()}>{D.mySurveys}</Button>
        <a className="HeaderDocLink" href="" target="_blank"><i className="fa fa-question-circle fa-2x" /></a>
      </div>
    </Card>
  );
}

export default Header;
