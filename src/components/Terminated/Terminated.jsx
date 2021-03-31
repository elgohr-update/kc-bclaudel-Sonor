import React, { useState, useEffect, useCallback } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link, Redirect } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import SurveySelector from '../SurveySelector/SurveySelector';
import TerminatedTable from './TerminatedTable';
import Utils from '../../utils/Utils';
import D from '../../i18n';

function Terminated({
  location, dataRetreiver, match,
}) {
  const { survey } = location;
  const { id } = match.params;
  const [data, setData] = useState([]);
  const [sort, setSort] = useState({ sortOn: 'finalizationDate', asc: true });
  const [redirect, setRedirect] = useState(!survey && id ? '/' : null);

  const fetchData = useCallback(() => {
    let surveyId = null;
    if (survey) surveyId = survey.id;
    dataRetreiver.getListSuTerminated(surveyId, (res) => {
      setData(res);
      setRedirect(null);
    });
  }, [dataRetreiver, survey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function handleSort(property, asc) {
    const [sortedData, newSort] = Utils.handleSort(property, data, sort, 'terminated', asc);
    setSort(newSort);
    setData(sortedData);
  }

  function validateUpdateComment(suToModifiedSelected, comment){
    dataRetreiver.updateSurveyUnitsComment(suToModifiedSelected, comment)
      .then((res) => {
        if (res.status === 200 || res.status === 201 || res.status === 204) {
          NotificationManager.success(D.reviewAlertSuccess, D.updateSuccess, 3500);
        } else {
          NotificationManager.error(D.reviewAlertError, D.error, 3500);
        }
        fetchData();
      });
  }

  const surveyTitle = !survey || (<div className="SurveyTitle">{survey.label}</div>);
  const surveySelector = !survey || (
    <SurveySelector
      survey={survey}
      updateFunc={(newSurvey) => setRedirect({ pathname: `/terminated/${newSurvey.id}`, survey: newSurvey })}
    />
  );

  return redirect ? <Redirect to={redirect} />
    : (
      <div>
        <Container fluid>
          <Row>
            <Col>
              <Link to="/" className="ButtonLink ReturnButtonLink">
                <Button className="ReturnButton" data-testid="return-button">{D.back}</Button>
              </Link>
            </Col>
            <Col xs={6}>
              {surveyTitle}
            </Col>
            <Col>
              {surveySelector}
            </Col>
          </Row>
        </Container>
        <Card className="ViewCard">
          <Card.Title className="PageTitle">
            {D.titleListSu}
            {data.length}
          </Card.Title>
          {
            data.length > 0
              ? (
                <TerminatedTable
                  data={data}
                  sort={sort}
                  survey={survey}
                  dataRetreiver={dataRetreiver}
                  handleSort={handleSort}
                  validateUpdateComment={validateUpdateComment}
                />
              )
              : <span>{D.noSuFinalized}</span>
          }
        </Card>
      </div>
    );
}

export default Terminated;
