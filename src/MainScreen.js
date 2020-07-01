import React from 'react';


class MainScreen extends React.Component {

  render() {

      return (
        <div id='MainScreen'>
          <div id='SurveyListTitle'>Liste des enquêtes</div>
          <table id='SurveyList'>
            <thead>
              <tr>
                <th rowSpan='2'>Enquête</th>
                <th rowSpan='2' className='ColumnSpacing'/>
                <th rowSpan='2'>Début collecte</th>
                <th rowSpan='2'>Fin collecte </th>
                <th rowSpan='2'>Fin traitement</th>
                <th rowSpan='2' className='ColumnSpacing'/>
                <th rowSpan='2'>Phase</th>
                <th rowSpan='2' className='ColumnSpacing'/>
                <th colSpan='4'>Unités enquêtées</th>
              </tr>
              <tr>
                <th>Confiées</th>
                <th>À affecter</th>
                <th>En cours</th>
                <th>À controler</th>
              </tr>
            </thead>
            <tbody>
              {displaySurveyLines(this.props)}
            </tbody>
          </table>
        </div>
      );
  }

}

function displaySurveyLines(props){
  const lines = []
  let key = 0
  let oddLine = true
  props.data.forEach(lineData =>{
    lines.push(<SurveyListLine key={key} oddLine={oddLine} {...lineData} {...props}/>)
    oddLine = !oddLine
    key = key + 1
  })
  return lines
}

class SurveyListLine extends React.Component {

  render() {
      const lineColor = this.props.oddLine ? 'DarkgreyLine' : 'LightGreyLine'
      const goToPortal = ()=>{this.props.goToCampaignPortal(this.props.id, this.props.label, this.props.collectionStart, this.props.collectionEnd, this.props.endOfTreatment)}
      const goToListSU = ()=>{this.props.goToListSU(this.props.id)}
      const goToMonitoringTable = ()=>{this.props.goToMonitoringTable(this.props.label)}
      return (
            <tr className={lineColor}>
              <td onClick={goToPortal} className='Clickable' data-testid='campaign-label'>{this.props.label}</td>
              <td className='ColumnSpacing'/>
              <td onClick={goToPortal} className='Clickable'>{this.props.collectionStart}</td>
              <td onClick={goToPortal} className='Clickable'>{this.props.collectionEnd}</td>
              <td onClick={goToPortal} className='Clickable'>{this.props.endOfTreatment}</td>
              <td className='ColumnSpacing'/>
              <td onClick={goToPortal} className='Clickable'>{getCampaignPhase(this.props.affected, this.props.toAffect, this.props.inProgress, this.props.toControl)}</td>
              <td className='ColumnSpacing'/>
              <td onClick={goToListSU} className='Clickable'>{this.props.affected}</td>
              <td>{this.props.toAffect}</td>
              <td onClick={goToMonitoringTable} className='Clickable'>{this.props.inProgress}</td>
              <td>{this.props.toControl}</td>
            </tr>
      );
  }

}

function getCampaignPhase(affected, toAffect, inProgress, toControl){
  let phase = '';
  if(inProgress < 0 && toControl < 0 && toAffect > 0){
    phase = 'Affectation initiale';
  } else if(affected > 0 || inProgress > 0){
    phase = 'Collecte en cours';
  } else if(inProgress < 0 && toAffect < 0 && inProgress < 0 && toControl > 0){
    phase = 'Collecte terminée';
  }
  return phase;
}

export default MainScreen;
