import React from 'react';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import SortIcon from '../SortIcon/SortIcon';
import Utils from '../../utils/Utils';
import SurveyListLine from './SurveyListLine';
import PaginationNav from '../PaginationNav/PaginationNav';
import D from '../../i18n';

class MainScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      pagination: { size: 10, page: 1 },
      sort: { sortOn: null, asc: null },
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    const { preferences } = this.props;
    if (prevProps.preferences !== preferences) {
      this.fetchData();
    }
  }

  fetchData() {
    const { preferences, dataRetreiver } = this.props;
    dataRetreiver.getDataForMainScreen(null, (data) => {
      this.setState({
        data: data.filter(
          (survey) => (preferences[survey.id] && preferences[survey.id].preference),
        ),
      }, () => { this.handleSort('label', true); });
    });
  }

  handlePageChange(pagination) {
    this.setState({ pagination });
  }

  handleSort(property, asc) {
    const { data, sort } = this.state;
    const [sortedData, newSort] = Utils.handleSort(property, data, sort, 'mainScreen', asc);
    this.setState({ data: sortedData, sort: newSort });
  }

  render() {
    const handleSort = (property) => this.handleSort(property);
    const { pagination, data, sort } = this.state;
    function handleSortFunct(property) { return () => { handleSort(property); }; }
    return (
      <div id="MainScreen">
        <Card className="ViewCard">
          <Card.Title className="PageTitle">{D.surveyList}</Card.Title>
          {
            data.length > 0
              ? (
                <>
                  <PaginationNav.SizeSelector
                    updateFunc={(newPagination) => this.handlePageChange(newPagination)}
                  />
                  <Table id="SurveyList" className="CustomTable" bordered striped hover responsive size="sm">
                    <thead>
                      <tr>
                        <th className="EmptyHeader" />
                        <th className="ColumnSpacing" />
                        <th className="EmptyHeader" />
                        <th className="EmptyHeader" />
                        <th className="EmptyHeader" />
                        <th className="ColumnSpacing" />
                        <th className="EmptyHeader" />
                        <th className="ColumnSpacing" />
                        <th colSpan="6" className="CenteredText">{D.surveyUnits}</th>
                      </tr>
                      <tr>
                        <th onClick={handleSortFunct('label')} className="Clickable">
                          <SortIcon val="label" sort={sort} />
                          {D.survey}
                        </th>
                        <th className="ColumnSpacing" />
                        <th onClick={handleSortFunct('collectionStartDate')} className="Clickable">
                          <SortIcon val="collectionStartDate" sort={sort} />
                          {D.collectionStartDate}
                        </th>
                        <th
                          data-testid="Header-collection-end-date"
                          onClick={handleSortFunct('collectionEndDate')}
                          className="Clickable"
                        >
                          <SortIcon val="collectionEndDate" sort={sort} />
                          {D.collectionEndDate}
                        </th>
                        <th onClick={handleSortFunct('endDate')} className="Clickable">
                          <SortIcon val="endDate" sort={sort} />
                          {D.endDate}
                        </th>
                        <th className="ColumnSpacing" />
                        <th onClick={handleSortFunct('phase')} className="Clickable">
                          <SortIcon val="phase" sort={sort} />
                          {D.phase}
                        </th>
                        <th className="ColumnSpacing" />
                        <th onClick={handleSortFunct('allocated')} className="Clickable">
                          <SortIcon val="allocated" sort={sort} />
                          {D.allocated}
                        </th>
                        <th onClick={handleSortFunct('toProcessInterviewer')} className="Clickable">
                          <SortIcon val="toProcessInterviewer" sort={sort} />
                          {D.toTreatInterviewer}
                        </th>
                        <th onClick={handleSortFunct('toAffect')} className="Clickable">
                          <SortIcon val="toAffect" sort={sort} />
                          {D.toBeAssigned}
                        </th>
                        <th onClick={handleSortFunct('toFollowUp')} className="Clickable">
                          <SortIcon val="toFollowUp" sort={sort} />
                          {D.toRemind}
                        </th>
                        <th onClick={handleSortFunct('toReview')} className="Clickable">
                          <SortIcon val="toReview" sort={sort} />
                          {D.toBeReviewed}
                        </th>
                        <th onClick={handleSortFunct('finalized')} className="Clickable">
                          <SortIcon val="finalized" sort={sort} />
                          {D.terminated}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data
                        .slice(
                          (pagination.page - 1) * pagination.size,
                          Math.min(pagination.page * pagination.size, data.length),
                        )
                        .map((line) => (
                          <SurveyListLine key={line.id} lineData={line} allData={data} />
                        ))}
                    </tbody>
                  </Table>
                  <div className="tableOptionsWrapper">
                    <PaginationNav.PageSelector
                      pagination={pagination}
                      updateFunc={(newPagination) => { this.handlePageChange(newPagination); }}
                      numberOfItems={data.length}
                    />
                  </div>
                </>
              )
              : <span>{D.noSurveysToDisplay}</span>
          }
        </Card>
      </div>
    );
  }
}

export default MainScreen;
