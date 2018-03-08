import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css/normalize.css';
import './styles/styles.scss';
import _ from 'lodash';
import { Header, Image, Table, Segment } from 'semantic-ui-react';
import 'tachyons';


class App extends React.Component {
    state = {

    }
    render(){
        return (
            <div>
                <HeaderSection />
                <div className="flex justify-center items-center mt6">
                    <div className="w-60">
                        <CamperLeaderboard/>
                    </div>
                </div>
                <FooterSection/>
            </div>
        )
    }
}

const HeaderSection = () => (
    <Segment clearing color='teal' inverted>
        <Header as='h2' floated='left'>
            A leaderboard for FreeCodeCamp
        </Header>
    </Segment>
)

const FooterSection = () => (
    <Segment clearing color='teal' inverted className="mb0 mt6">
    
    </Segment>

)

class CamperLeaderboard extends React.Component {
    state = {
        column: null, 
        data: null,
    }

    componentDidMount(){
        fetch('https://fcctop100.herokuapp.com/api/fccusers/top/recent')
        .then(response => response.json())
        .then(data => this.setState({ 
            data: _.sortBy(data, 'recent').reverse(),
            column: 'recent',
            direction: 'descending',
         }))

    }

    handleSort = clickedColumn => () => {
        const { column } = this.state 

        if (column !== clickedColumn){
            fetch(`https://fcctop100.herokuapp.com/api/fccusers/top/${clickedColumn}`)
            .then(response => response.json())
            .then(data => this.setState({
                column: clickedColumn,
                data: _.sortBy(data, [clickedColumn]).reverse(),
                direction: 'descending',
            }))
            return
        }
    }

    render(){
        const { column, data, direction } = this.state
        return (
            <Table color='teal' sortable celled structured>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell colSpan='4'>Leaderboard</Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell>#</Table.HeaderCell>
                        <Table.HeaderCell>
                            Name
                        </Table.HeaderCell>
                        <Table.HeaderCell sorted={column === 'recent' ? direction: null} onClick={this.handleSort('recent')}>
                            Points in past 30 days
                        </Table.HeaderCell>
                        <Table.HeaderCell sorted={column === 'alltime' ? direction: null} onClick={this.handleSort('alltime')}>
                            All time points
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {_.map(data, ({ username, img, recent, alltime }, index) => (
                        <Table.Row key={username}>
                            <Table.Cell>{index + 1}</Table.Cell>
                            <Table.Cell>
                                <Image src={img} avatar />
                                <span>{username}</span>
                            </Table.Cell>
                            <Table.Cell>{recent}</Table.Cell>
                            <Table.Cell>{alltime}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
          </Table>
        )
    }
}


ReactDOM.render(<App/>, document.getElementById('app'));


